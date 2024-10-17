import React, { useRef, useEffect } from 'react';
import '@/css/VideoPlayer.css';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useVideo } from '@/VideoContext';

/*
interface VideoPlayerProps {
  video: {
    id: number;
    title: string;
    channel: string;
    thumbnailUrl: string;
  };
}
*/

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);

  const { videoData } = useVideo();

  useEffect(() => {
    if (videoData && mediaSourceRef.current && sourceBufferRef.current) {
      if (sourceBufferRef.current.updating) {
        sourceBufferRef.current.addEventListener('updateend', () => {
          sourceBufferRef.current?.appendBuffer(videoData);
        }, { once: true });
      } else {
        sourceBufferRef.current.appendBuffer(videoData);
      }
    }
  }, [videoData]);

  useEffect(() => {
    if (playerRef.current) {
      const mediaSource = new MediaSource();
      mediaSourceRef.current = mediaSource;

      playerRef.current.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        sourceBufferRef.current = sourceBuffer;
      });
    }
  }, []);


  return (
    <div className="relative z-10 h-full hover_class" ref={playerContainerRef}>
      <AspectRatio ratio={16 / 9} className="h-full">
        <video ref={playerRef} controls className='w-full h-full'></video>
        {/* <ReactPlayer
        {(hoverVisible && isMouseMoving) &&  (
          <div className='video_hover flex flex-col justify-between'>
            <div className="w-full p-4 text-white text-lg">
              {"a changer"}
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
        */}
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;