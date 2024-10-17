import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface VideoContextType {
  videoData: Uint8Array | null;
  setVideoData: Dispatch<SetStateAction<Uint8Array | null>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videoData, setVideoData] = useState<Uint8Array | null>(null);

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};