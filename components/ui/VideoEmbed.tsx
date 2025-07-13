"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  showPlayButton?: boolean;
  thumbnail?: string;
}

interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'unsupported';
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  isShorts?: boolean;
}

export default function VideoEmbed({ 
  url, 
  title = "Video", 
  className = "", 
  autoplay = false,
  showPlayButton = true,
  thumbnail
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Extract video information from URL
  const getVideoInfo = (url: string): VideoInfo | null => {
    try {
      const urlObj = new URL(url);
      
      // YouTube patterns
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        let isShorts = false;
        
        if (urlObj.hostname.includes('youtu.be')) {
          // Handle youtu.be short URLs
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.has('v')) {
          // Handle standard YouTube URLs (watch?v=)
          videoId = urlObj.searchParams.get('v') || '';
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          // Handle YouTube Shorts URLs (/shorts/{videoId})
          videoId = urlObj.pathname.replace('/shorts/', '');
          isShorts = true;
        }
        
        if (videoId) {
          return {
            type: 'youtube',
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            isShorts
          };
        }
      }
      
      // Vimeo patterns
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop() || '';
        
        if (videoId && /^\d+$/.test(videoId)) {
          return {
            type: 'vimeo',
            videoId,
            embedUrl: `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`,
            thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`
          };
        }
      }
      
      return {
        type: 'unsupported',
        videoId: '',
        embedUrl: '',
        thumbnailUrl: ''
      };
    } catch {
      return null;
    }
  };

  const videoInfo = getVideoInfo(url);

  if (!videoInfo || videoInfo.type === 'unsupported') {
    return (
      <div className={`bg-muted border border-border rounded-lg p-6 text-center ${className}`}>
        <ExternalLink className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-3">
          Unsupported video format
        </p>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          View Video →
        </a>
      </div>
    );
  }

  const handlePlayClick = () => {
    setIsLoading(true);
    setIsPlaying(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isPlaying && showPlayButton) {
    return (
      <div className={`relative group cursor-pointer ${className}`}>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={thumbnail || videoInfo.thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback for thumbnail loading errors
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-video.jpg'; // You can add a placeholder image
            }}
          />
          
          {/* Play Button Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center"
            onClick={handlePlayClick}
          >
            <div className="bg-black/70 group-hover:bg-black/80 rounded-full p-4 transition-colors">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
          
          {/* Video Platform Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
              {videoInfo.isShorts ? 'YouTube Shorts' : videoInfo.type}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground">Loading video...</div>
          </div>
        )}
        
        <iframe
          src={videoInfo.embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      </div>
      
      {/* Video Info */}
      {title && (
        <div className="mt-2 text-sm text-muted-foreground">
          {title}
        </div>
      )}
    </div>
  );
}