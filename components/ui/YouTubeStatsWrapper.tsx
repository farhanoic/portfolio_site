"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Video } from 'lucide-react';

const YouTubeStats = dynamic(() => import('./YouTubeStats'), {
  ssr: false,
  loading: () => (
    <div className="dashboard-card p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
          <Video className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
          <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
          <p className="text-xs text-muted-foreground">Loading YouTube channel...</p>
        </div>
      </div>
    </div>
  )
});

interface YouTubeStatsWrapperProps {
  channelUrl?: string;
  className?: string;
}

export default function YouTubeStatsWrapper({ channelUrl, className }: YouTubeStatsWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="dashboard-card p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Video className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
            <p className="text-xs text-muted-foreground">Loading YouTube channel...</p>
          </div>
        </div>
      </div>
    );
  }

  return <YouTubeStats channelUrl={channelUrl} className={className} />;
}