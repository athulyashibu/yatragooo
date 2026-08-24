import React, { useState } from 'react';
import { getDefaultAvatarForUser } from '../../utils/avatars';

interface UserAvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  showRing?: boolean;
  ringColor?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  alt?: string;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-6 h-6 rounded-md text-[10px]',
  sm: 'w-8 h-8 rounded-lg text-xs',
  md: 'w-10 h-10 rounded-xl text-sm',
  lg: 'w-12 h-12 rounded-2xl text-base',
  xl: 'w-16 h-16 rounded-2xl text-lg',
  '2xl': 'w-24 h-24 rounded-3xl text-2xl',
  '3xl': 'w-32 h-32 rounded-3xl text-3xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  showRing = true,
  ringColor = 'ring-orange-500/20',
  loading = 'lazy',
  onClick,
  alt,
}) => {
  const [imgError, setImgError] = useState(false);

  // Fallback to deterministic default avatar if src missing or failed to load
  const effectiveSrc = !src || imgError ? getDefaultAvatarForUser(name) : src;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block shrink-0 overflow-hidden select-none transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${className}`}
    >
      <img
        src={effectiveSrc}
        alt={alt || name}
        loading={loading}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size] || sizeClasses.md} object-cover shadow-xs ${
          showRing ? `ring-2 ${ringColor}` : ''
        }`}
      />
    </div>
  );
};
