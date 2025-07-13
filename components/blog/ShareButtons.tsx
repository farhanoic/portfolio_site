"use client";

import { motion } from 'framer-motion';
import { Share2, Twitter, Linkedin, Link2, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt: string;
}

export function ShareButtons({ title, url, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    url,
    text: excerpt,
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-6 dashboard-card">
        <div className="flex items-center space-x-3">
          <Share2 className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Share this article</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNativeShare}
              className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          )}

          {/* Twitter */}
          <motion.a
            href={shareUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-muted-foreground hover:text-[#1DA1F2] transition-colors rounded-full hover:bg-muted"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-muted-foreground hover:text-[#0A66C2] transition-colors rounded-full hover:bg-muted"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </motion.a>

          {/* Copy Link */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className={`p-2 transition-colors rounded-full hover:bg-muted ${
              copied 
                ? 'text-green-500' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            aria-label="Copy link"
          >
            {copied ? <Copy className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center mt-2"
        >
          <span className="text-sm text-green-500">Link copied to clipboard!</span>
        </motion.div>
      )}
    </div>
  );
}