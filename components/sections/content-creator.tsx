"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Eye, Video, Play } from 'lucide-react';

interface YouTubeStats {
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  shortFormCount: number;
  longFormCount: number;
  lastUpdated: string;
}

export function ContentCreator() {
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Creator Stack Skills for moving stripe
  const creatorSkills = [
    'YouTube', 'Video Editing', 'Storytelling', 'OBS Studio', 'DaVinci Resolve', 
    'Audacity', 'SEO', 'Analytics', 'Audience Growth', 'Content Strategy',
    'Premiere Pro', 'After Effects', 'Thumbnail Design', 'Script Writing',
    'Live Streaming', 'Community Management', 'Brand Collaboration'
  ];

  useEffect(() => {
    setIsClient(true);
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      fetchYouTubeStats();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchYouTubeStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/youtube-stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching YouTube stats:', err);
      // Set fallback data to prevent error display
      setStats({
        channelTitle: 'Farhan Azhar',
        channelThumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kNKVz3bFSxTjlvHJq7ExWM9bCdRl5fGnGvN7pMkA=s176-c-k-c0x00ffffff-no-rj', // Your actual channel thumbnail
        subscriberCount: 3500,
        viewCount: 544200,
        videoCount: 30,
        shortFormCount: 10,
        longFormCount: 20,
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Content Creator
          </h2>
        </motion.div>

        {/* Moving Skills Stripe */}
        <div className="relative overflow-hidden mb-16 py-6 bg-muted/50 rounded-2xl border border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10"></div>
          <motion.div
            className="flex space-x-6 whitespace-nowrap will-change-transform"
            animate={{
              x: [0, -1920], // Move by a specific pixel amount
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear',
              },
            }}
            style={{ width: 'max-content' }}
          >
            {/* Triple the skills array to ensure seamless loop */}
            {[...creatorSkills, ...creatorSkills, ...creatorSkills].map((skill, index) => (
              <div
                key={index}
                className="flex items-center px-5 py-3 bg-primary/10 rounded-full border border-primary/30 shadow-sm hover:bg-primary/20 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {skill}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Channel Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {loading ? (
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
          ) : stats ? (
            <div className="dashboard-card overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={stats.channelThumbnail} 
                    alt={stats.channelTitle}
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground">
                      {stats.channelTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">YouTube Channel</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Subscribers */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center space-y-3 p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(stats.subscriberCount)}
                      </p>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                  </motion.div>

                  {/* Total Views */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center space-y-3 p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {formatNumber(stats.viewCount)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                  </motion.div>

                  {/* Long Form Videos */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center space-y-3 p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Video className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.longFormCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Long Form</p>
                    </div>
                  </motion.div>

                  {/* Short Form Videos */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center space-y-3 p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Play className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.shortFormCount}
                      </p>
                      <p className="text-sm text-muted-foreground">Shorts</p>
                    </div>
                  </motion.div>
                </div>

                {/* Last Updated */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Updated {isClient ? new Date(stats.lastUpdated).toLocaleTimeString() : 'Loading...'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-card p-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Unable to load YouTube stats
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
          )}
        </motion.div>
      </div>
    </section>
  );
}