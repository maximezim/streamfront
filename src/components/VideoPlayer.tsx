import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import '@/css/VideoPlayer.css';
import videoUrl from '../assets/video.mp4';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import screenfull from 'screenfull';

import { IoPlay, IoPauseOutline, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { BsFullscreen } from "react-icons/bs";
import { Slider } from './ui/slider';

interface VideoPlayerProps {
  video: {
    id: number;
    title: string;
    channel: string;
    thumbnailUrl: string;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const delay = 1500;
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [hoverVisible, setHoverVisible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
    if (!playing && isFullScreen) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setHoverVisible(false);
      }, delay);
    }
  };

  const handleMouseMove = () => {
    setHoverVisible(true);
    setIsMouseMoving(true);
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }
    mouseMoveTimeoutRef.current = setTimeout(() => {
      setIsMouseMoving(false);
      if (isFullScreen) {
        setHoverVisible(false);
      }
    }, delay);
  };

  const handleMouseEnter = () => {
    setHoverVisible(true);
  };

  const handleMouseLeave = () => {
    setHoverVisible(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleFullScreen = () => {
    if (screenfull.isEnabled && playerContainerRef.current) {
      screenfull.toggle(playerContainerRef.current);
      setIsFullScreen(!isFullScreen);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, 'seconds');
    }
  };

  useEffect(() => {
    if (isFullScreen && !isMouseMoving) {
      const timeout = setTimeout(() => {
        setHoverVisible(false);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [isFullScreen, isMouseMoving]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative z-10 h-full hover_class" ref={playerContainerRef}>
      <AspectRatio ratio={16 / 9} className="h-full" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          volume={volume}
          muted={muted}
          controls={false}
          width="100%"
          height="100%"
          className="rounded-md overflow-hidden react-player-controls"
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
        {(hoverVisible && isMouseMoving) &&  (
          <div className='video_hover flex flex-col justify-between'>
            <div className="w-full p-4 text-white text-lg">
              {video.title}
            </div>
            <div className="custom_controls text-white flex justify-between w-full p-4">
              <div className='flex items-center'>
                {playing ? (
                  <IoPauseOutline size={24} onClick={handlePlayPause} className="cursor-pointer" />
                ) : (
                  <IoPlay size={24} onClick={handlePlayPause} className="cursor-pointer" />
                )}
              </div>
              <div className='flex items-center gap-4 w-full px-8'>
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="progress-slider w-full"
                />
                <span>{formatTime(duration)}</span>
              </div>
              <div className='flex items-center gap-4'>
                {muted ? (
                  <IoVolumeMute size={22} onClick={handleMute} className="cursor-pointer" />
                ) : (
                  <IoVolumeHigh size={22} onClick={handleMute} className="cursor-pointer" />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider w-24"
                />
                <BsFullscreen size={22} onClick={handleFullScreen} className="cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;