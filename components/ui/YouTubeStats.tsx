"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Users, Video, Play } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
}

interface YouTubeStats {
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  shortFormCount: number;
  longFormCount: number;
  videos: YouTubeVideo[];
  shorts: YouTubeVideo[];
  allVideos: YouTubeVideo[];
  lastUpdated: string;
  quotaExceeded?: boolean;
}

interface YouTubeStatsProps {
  channelUrl?: string;
  className?: string;
  showVideos?: boolean;
}

export default function YouTubeStats({ 
  channelUrl = "https://www.youtube.com/@farhanoic",
  className = "",
  showVideos = true
}: YouTubeStatsProps) {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedVideos, setDisplayedVideos] = useState<YouTubeVideo[]>([]);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchYouTubeStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchYouTubeStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update displayed videos when stats change
  useEffect(() => {
    if (stats) {
      setDisplayedVideos(showAllVideos ? stats.allVideos : stats.videos);
    }
  }, [stats, showAllVideos]);

  const fetchYouTubeStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/youtube-stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube stats');
      }
      
      const data = await response.json();
      
      // Ensure all required properties exist with default values
      const sanitizedStats = {
        channelTitle: data.channelTitle || 'Farhan Azhar',
        channelThumbnail: data.channelThumbnail || 'https://yt3.googleusercontent.com/ytc/AIdro_kNKVz3bFSxTjlvHJq7ExWM9bCdRl5fGnGvN7pMkA=s176-c-k-c0x00ffffff-no-rj',
        subscriberCount: typeof data.subscriberCount === 'number' ? data.subscriberCount : 3500,
        viewCount: typeof data.viewCount === 'number' ? data.viewCount : 544200,
        videoCount: typeof data.videoCount === 'number' ? data.videoCount : 30,
        shortFormCount: typeof data.shortFormCount === 'number' ? data.shortFormCount : 10,
        longFormCount: typeof data.longFormCount === 'number' ? data.longFormCount : 20,
        videos: Array.isArray(data.videos) ? data.videos : [],
        shorts: Array.isArray(data.shorts) ? data.shorts : [],
        allVideos: Array.isArray(data.allVideos) ? data.allVideos : [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
      
      setStats(sanitizedStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching YouTube stats:', err);
      // Set fallback data to prevent error display
      setStats({
        channelTitle: 'Farhan Azhar',
        channelThumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kNKVz3bFSxTjlvHJq7ExWM9bCdRl5fGnGvN7pMkA=s176-c-k-c0x00ffffff-no-rj',
        subscriberCount: 3500,
        viewCount: 544200,
        videoCount: 30,
        shortFormCount: 10,
        longFormCount: 20,
        videos: [],
        shorts: [],
        allVideos: [],
        lastUpdated: new Date().toISOString()
      });
      setError('Failed to load YouTube stats');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined): string => {
    if (!num || typeof num !== 'number') {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    if (!isClient) return 'Loading...';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const handleLoadMore = () => {
    setShowAllVideos(true);
  };

  // Prevent hydration issues by only rendering after client-side mount
  if (!isClient) {
    return (
      <div className={`dashboard-card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Video className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`dashboard-card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Video className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`dashboard-card p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Video className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {error || 'Unable to load YouTube stats'}
            </p>
            <button 
              onClick={fetchYouTubeStats}
              className="text-xs text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`dashboard-card overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img 
              src={stats.channelThumbnail} 
              alt={stats.channelTitle}
              className="w-10 h-10 rounded-full border-2 border-primary/20"
            />
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {stats.channelTitle}
              </h3>
              <p className="text-xs text-muted-foreground">YouTube Channel</p>
            </div>
          </div>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-muted rounded-md transition-colors group"
          >
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Subscribers */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 rounded-lg p-3 text-center space-y-1.5"
          >
            <Users className="w-4 h-4 text-red-500 mx-auto" />
            <div className="space-y-0.5">
              <p className="text-base font-bold text-foreground">
                {formatNumber(stats.subscriberCount)}
              </p>
              <p className="text-xs text-muted-foreground">Subscribers</p>
            </div>
          </motion.div>

          {/* Total Views */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 rounded-lg p-3 text-center space-y-1.5"
          >
            <Eye className="w-4 h-4 text-blue-500 mx-auto" />
            <div className="space-y-0.5">
              <p className="text-base font-bold text-foreground">
                {formatNumber(stats.viewCount)}
              </p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </motion.div>

          {/* Long Form Videos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 rounded-lg p-3 text-center space-y-1.5"
          >
            <Video className="w-4 h-4 text-green-500 mx-auto" />
            <div className="space-y-0.5">
              <p className="text-base font-bold text-foreground">
                {stats.longFormCount}
              </p>
              <p className="text-xs text-muted-foreground">Long Form</p>
            </div>
          </motion.div>

          {/* Short Form Videos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-muted/50 rounded-lg p-3 text-center space-y-1.5"
          >
            <Play className="w-4 h-4 text-purple-500 mx-auto" />
            <div className="space-y-0.5">
              <p className="text-base font-bold text-foreground">
                {stats.shortFormCount}
              </p>
              <p className="text-xs text-muted-foreground">Shorts</p>
            </div>
          </motion.div>
        </div>

        {/* Last Updated */}
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Updated {isClient ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Videos Section */}
      {showVideos && displayedVideos.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-foreground">Latest Videos</h4>
            {!showAllVideos && stats.allVideos.length > 9 && (
              <button
                onClick={handleLoadMore}
                className="text-xs text-primary hover:underline"
              >
                Load More ({stats.allVideos.length - 9} more)
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {displayedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openVideo(video.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Play className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
                <h5 className="text-xs font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {video.title}
                </h5>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(video.viewCount)} views</span>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Shorts Section */}
      {showVideos && stats.shorts.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-semibold text-foreground mb-4">Latest Shorts</h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {stats.shorts.map((short, index) => (
              <motion.div
                key={short.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openVideo(short.id)}
                className="group cursor-pointer flex-shrink-0"
              >
                <div className="relative w-24 aspect-[9/16] bg-muted rounded-lg overflow-hidden mb-2">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {short.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Play className="w-4 h-4 text-white" fill="white" />
                  </div>
                </div>
                <h5 className="text-xs font-medium text-foreground line-clamp-2 mb-1 w-24 group-hover:text-primary transition-colors">
                  {short.title}
                </h5>
                <div className="text-xs text-muted-foreground w-24">
                  <div>{formatNumber(short.viewCount)} views</div>
                  <div>{formatDate(short.publishedAt)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quota Exceeded Message */}
      {showVideos && displayedVideos.length === 0 && (
        <div className="p-6 border-b border-border">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Videos Temporarily Unavailable</h4>
              <p className="text-xs text-muted-foreground">
                {stats?.quotaExceeded 
                  ? "YouTube API quota exceeded. Videos will be available after quota reset."
                  : "Videos will load once the connection is restored."
                }
              </p>
            </div>
            <button 
              onClick={fetchYouTubeStats}
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}