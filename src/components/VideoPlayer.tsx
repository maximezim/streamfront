import React, { useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList = [], messageList = [] } = useContext(brokerContext) || {};

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  
  const bufferQueueRef = useRef<Uint8Array[]>([]);
  const isAppendingRef = useRef(false);
  const isMediaSourceOpenRef = useRef(false);
  const isInitializedRef = useRef(false);
  const shouldEndStreamRef = useRef(false);

  useEffect(() => {
    if (!videoRef.current) {
      console.error('Video element not found.');
      return;
    }

    if (!mediaSourceRef.current) {
      mediaSourceRef.current = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
      mediaSourceRef.current.addEventListener('sourceopen', onSourceOpen);
      mediaSourceRef.current.addEventListener('error', onMediaSourceError);
      mediaSourceRef.current.addEventListener('sourceclose', onSourceClose);
      console.log('MediaSource initialized and event listeners added.');
    }

    return () => {
      if (mediaSourceRef.current) {
        mediaSourceRef.current.removeEventListener('sourceopen', onSourceOpen);
        mediaSourceRef.current.removeEventListener('error', onMediaSourceError);
        mediaSourceRef.current.removeEventListener('sourceclose', onSourceClose);
        mediaSourceRef.current = null;
        console.log('MediaSource event listeners removed.');
      }
    };
  }, []);

  const onSourceOpen = () => {
    if (!mediaSourceRef.current || !videoRef.current) {
      console.error('MediaSource or video element not available.');
      return;
    }

    if (isInitializedRef.current) {
      console.warn('MediaSource already initialized.');
      return;
    }

    const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';
    if (MediaSource.isTypeSupported(mimeCodec)) {
      try {
        sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer(mimeCodec);
        sourceBufferRef.current.mode = 'segments';
        sourceBufferRef.current.addEventListener('updateend', onUpdateEnd);
        sourceBufferRef.current.addEventListener('error', onSourceBufferError);
        console.log('SourceBuffer created with codec:', mimeCodec);
        isMediaSourceOpenRef.current = true;
        isInitializedRef.current = true;

        appendToBuffer();
      } catch (e) {
        console.error('Failed to add SourceBuffer:', e);
      }
    } else {
      console.error('MIME type or codec not supported:', mimeCodec);
    }
  };

  const onSourceClose = () => {
    console.log('MediaSource has been closed.');
    isMediaSourceOpenRef.current = false;
    isAppendingRef.current = false;
    sourceBufferRef.current = null;
    bufferQueueRef.current = []; // Clear buffer on close
  };

  const onMediaSourceError = (e: any) => {
    console.error('MediaSource error:', e);
  };

  const onSourceBufferError = (e: any) => {
    console.error('SourceBuffer error:', e);
    // Handle specific SourceBuffer errors if needed
  };

  const onUpdateEnd = () => {
    isAppendingRef.current = false;

    if (shouldEndStreamRef.current && bufferQueueRef.current.length === 0 && mediaSourceRef.current) {
      mediaSourceRef.current.endOfStream();
      console.log('Called endOfStream on MediaSource.');
    } else {
      appendToBuffer();
    }
  };

  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      bufferQueueRef.current.push(...newPackets);
      console.log(`Added ${newPackets.length} new packet(s) to bufferQueue.`);
      appendToBuffer();
    }
  }, [packetList]);

  useEffect(() => {
    if (messageList.length > 0) {
      messageList.forEach((msg) => {
        if (msg.topic === 'go-streaming' && msg.payload.toString() === 'EOSTREAMING') {
          console.log('Received EOS message.');
          shouldEndStreamRef.current = true;
          appendToBuffer();
        }
      });
    }
  }, [messageList]);

  const appendToBuffer = () => {
    console.log('Attempting to append to bufferQueue:', bufferQueueRef.current);

    if (
      !isMediaSourceOpenRef.current ||
      isAppendingRef.current ||
      !sourceBufferRef.current ||
      sourceBufferRef.current.updating ||
      bufferQueueRef.current.length === 0
    ) {
      console.log('Conditions not met for appending. Skipping.');
      return;
    }

    if (!mediaSourceRef.current || mediaSourceRef.current.readyState !== 'open') {
      console.warn('MediaSource is not open or has been closed. Aborting append.');
      return;
    }

    const chunk = bufferQueueRef.current.shift();
    if (!chunk) {
      console.warn('No chunk available to append.');
      return;
    }

    isAppendingRef.current = true;

    try {
      sourceBufferRef.current.appendBuffer(chunk);
      console.log(`Appended chunk of size: ${chunk.byteLength} bytes.`);
    } catch (e) {
      console.error('Error appending buffer:', e);
      isAppendingRef.current = false;
    }
  };

  return (
    <div>
      <h3>Video Player</h3>
      <video ref={videoRef} controls autoPlay style={{ width: '100%', height: 'auto' }} />
      {packetList.length > 0 ? (
        <p>Packets received: {packetList.length}</p>
      ) : (
        <p>Waiting for packets...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
