import { NextResponse } from 'next/server';

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID; // Your channel ID

// Simple in-memory cache to reduce API calls
let cachedData: any = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: 'Missing API key or channel ID' },
        { status: 500 }
      );
    }

    // Check if we have fresh cached data
    const now = Date.now();
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Serving cached YouTube data');
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
        }
      });
    }

    // Get channel statistics
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    );

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      console.error('YouTube API Response Error:', errorText);
      throw new Error(`Failed to fetch channel data: ${channelResponse.status}`);
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    const channel = channelData.items[0];
    const stats = channel.statistics;

    // Get recent videos to count shorts vs long-form
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video&key=${API_KEY}`
    );

    const videosData = await videosResponse.json();
    
    // Get video details to determine duration (shorts are <60 seconds)
    const videoIds = videosData.items?.map((item: any) => item.id.videoId).join(',') || '';
    
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );

    const videoDetails = await videoDetailsResponse.json();

    // Parse duration and categorize videos, also collect video data
    let shortFormCount = 0;
    let longFormCount = 0;
    const videos: any[] = [];
    const shorts: any[] = [];

    // Combine video details with snippet data
    videoDetails.items?.forEach((video: any, index: number) => {
      const duration = video.contentDetails.duration;
      const durationInSeconds = parseDuration(duration);
      const snippetData = videosData.items?.[index];
      
      if (snippetData) {
        const videoData = {
          id: video.id,
          title: snippetData.snippet.title,
          description: snippetData.snippet.description,
          thumbnail: snippetData.snippet.thumbnails.medium?.url || snippetData.snippet.thumbnails.default.url,
          publishedAt: snippetData.snippet.publishedAt,
          duration: formatDuration(durationInSeconds),
          durationSeconds: durationInSeconds
        };
        
        if (durationInSeconds <= 60) {
          shortFormCount++;
          shorts.push(videoData);
        } else {
          longFormCount++;
          videos.push(videoData);
        }
      }
    });

    // Get video statistics (views, likes, etc.)
    const videoStatsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
    );
    const videoStatsData = await videoStatsResponse.json();

    // Add statistics to video data
    videos.forEach((video, index) => {
      const statsItem = videoStatsData.items?.find((item: any) => item.id === video.id);
      if (statsItem) {
        video.viewCount = parseInt(statsItem.statistics.viewCount) || 0;
        video.likeCount = parseInt(statsItem.statistics.likeCount) || 0;
      }
    });

    shorts.forEach((short, index) => {
      const statsItem = videoStatsData.items?.find((item: any) => item.id === short.id);
      if (statsItem) {
        short.viewCount = parseInt(statsItem.statistics.viewCount) || 0;
        short.likeCount = parseInt(statsItem.statistics.likeCount) || 0;
      }
    });

    const youtubeStats = {
      channelTitle: channel.snippet.title,
      channelThumbnail: channel.snippet.thumbnails.default.url,
      subscriberCount: parseInt(stats.subscriberCount) || 0,
      viewCount: parseInt(stats.viewCount) || 0,
      videoCount: parseInt(stats.videoCount) || 0,
      shortFormCount,
      longFormCount,
      videos: videos.slice(0, 9), // Latest 9 videos
      shorts: shorts.slice(0, 10), // Latest 10 shorts
      allVideos: videos, // All videos for load more
      lastUpdated: new Date().toISOString()
    };

    // Cache the successful response
    cachedData = youtubeStats;
    lastFetchTime = now;
    console.log('Fresh YouTube data cached');

    return NextResponse.json(youtubeStats, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' // Cache for 30 minutes
      }
    });

  } catch (error) {
    console.error('YouTube API Error:', error);
    
    // Return fallback data with empty videos when quota exceeded
    const fallbackData = {
      channelTitle: 'Farhan Azhar',
      channelThumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kNKVz3bFSxTjlvHJq7ExWM9bCdRl5fGnGvN7pMkA=s176-c-k-c0x00ffffff-no-rj',
      subscriberCount: 3500,
      viewCount: 544200,
      videoCount: 30,
      shortFormCount: 10,
      longFormCount: 20,
      videos: [], // Empty when quota exceeded
      shorts: [], // Empty when quota exceeded
      allVideos: [], // Empty when quota exceeded
      lastUpdated: new Date().toISOString(),
      quotaExceeded: true // Flag to indicate quota exceeded
    };
    
    return NextResponse.json(fallbackData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' // 10 minutes cache for fallback
      }
    });
  }
}

// Helper function to parse ISO 8601 duration
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Helper function to format duration for display
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `0:${seconds.toString().padStart(2, '0')}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}