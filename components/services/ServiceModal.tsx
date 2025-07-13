"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ServiceModalProps } from "@/types/services";
import { urlFor } from "@/lib/sanity";
import { X, Clock, Play } from "lucide-react";
import VideoEmbed from "@/components/ui/VideoEmbed";

export default function ServiceModal({ item, isOpen, onClose }: ServiceModalProps) {
  if (!item) return null;


  // Helper function to get demo videos (handles backward compatibility)
  const getDemoVideos = () => {
    if (item.demoVideos && item.demoVideos.length > 0) {
      return item.demoVideos;
    }
    // Fallback to legacy single video
    if (item.demoVideo) {
      return [{
        url: item.demoVideo,
        title: undefined
      }];
    }
    return [];
  };

  const demoVideos = getDemoVideos();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-lg shadow-2xl w-[95vw] sm:w-[90vw] md:w-full max-w-2xl max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative">
              <div className="aspect-[16/9] sm:aspect-video bg-muted overflow-hidden">
                <img
                  src={typeof item.thumbnail === 'string' ? item.thumbnail : urlFor(item.thumbnail).width(800).height(450).url()}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-3 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto">
              {/* Title and Price */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {item.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-muted border border-border rounded">
                      {item.filter.name}
                    </span>
                    <span>•</span>
                    <span>{item.category.name}</span>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {item.price}
                  </div>
                  <div className="flex items-center justify-end space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>


              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>



              {/* Demo Videos Section */}
              {demoVideos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>{demoVideos.length > 1 ? 'Demo Videos' : 'Demo Video'}</span>
                  </h3>
                  <div className="space-y-4">
                    {demoVideos.map((video, index) => (
                      <div key={index} className="space-y-2">
                        {video.title && (
                          <h4 className="text-sm font-medium text-foreground">{video.title}</h4>
                        )}
                        <VideoEmbed 
                          url={video.url}
                          title={video.title || `${item.title} - Demo Video ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-muted border border-border rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}