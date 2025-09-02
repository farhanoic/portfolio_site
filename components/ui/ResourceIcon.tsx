"use client";

import React from 'react';
import Image from 'next/image';

interface ResourceIconProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ResourceIcon({ icon, size = 'medium', className = '' }: ResourceIconProps) {
  const [imageError, setImageError] = React.useState(false);
  
  // Memoize computed values to prevent re-computation on every render
  const { isUrl, isGoogleRedirect, sizeClasses, sizeConfig } = React.useMemo(() => {
    const isUrl = icon?.startsWith('http://') || icon?.startsWith('https://');
    const isGoogleRedirect = isUrl && icon.includes('google.com/url');
    
    const sizeClasses = {
      small: 'w-6 h-6 text-xl',
      medium: 'w-8 h-8 text-3xl',
      large: 'w-12 h-12 text-4xl'
    };

    const sizeConfig = {
      small: { width: 24, height: 24 },
      medium: { width: 32, height: 32 },
      large: { width: 48, height: 48 }
    };

    return { isUrl, isGoogleRedirect, sizeClasses, sizeConfig };
  }, [icon]);

  // Reset error state when icon changes
  React.useEffect(() => {
    setImageError(false);
  }, [icon]);

  if (isUrl && !imageError && !isGoogleRedirect) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center overflow-hidden rounded-md bg-muted/10`}>
        <Image
          src={icon}
          alt="Resource logo"
          width={sizeConfig[size].width}
          height={sizeConfig[size].height}
          className="object-contain"
          unoptimized // For external URLs
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Show warning for Google redirect URLs or fallback for failed images
  if (isGoogleRedirect || imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-red-500/10 border border-red-500/30 rounded-md`} title={isGoogleRedirect ? "Google redirect URL detected. Please use direct image URL." : "Image failed to load"}>
        <div className="text-red-500">⚠️</div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      {icon}
    </div>
  );
}