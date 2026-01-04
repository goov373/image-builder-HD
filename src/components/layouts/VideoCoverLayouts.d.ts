import React from 'react';

export interface VideoCoverLayoutProps {
  videoCover: {
    frame: {
      variants: Array<{
        headline: string;
        body: string;
        formatting?: Record<string, unknown>;
      }>;
      currentVariant: number;
      currentLayout: number;
      layoutVariant: number;
    };
    showPlayButton?: boolean;
    episodeNumber?: string;
    seriesName?: string;
  };
  designSystem: Record<string, string>;
  activeTextField?: string | null;
  onActivateTextField?: (field: string | null) => void;
  onUpdateText?: (field: string, value: string) => void;
}

export const VideoFaceText: React.FC<VideoCoverLayoutProps>;
export const VideoBoldStatement: React.FC<VideoCoverLayoutProps>;
export const VideoEpisodeCard: React.FC<VideoCoverLayoutProps>;
export const VideoPlayOverlay: React.FC<VideoCoverLayoutProps>;

