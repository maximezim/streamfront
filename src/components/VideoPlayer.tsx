import React, { useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  // Destructure packetList and messageList from brokerContext with default empty arrays
  const { packetList = [], messageList = [] } = useContext(brokerContext) || {};

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  
  // Initialize bufferQueue as a ref to avoid unnecessary re-renders
  const bufferQueueRef = useRef<Uint8Array[]>([]);
  
  // Flags to manage appending state
  const isAppendingRef = useRef(false);
  const isMediaSourceOpenRef = useRef(false);
  const isInitializedRef = useRef(false); // Prevent multiple initializations
  const shouldEndStreamRef = useRef(false); // Flag to indicate end of stream

  // Initialize MediaSource on component mount
  useEffect(() => {
    if (!videoRef.current) {
      console.error('Video element not found.');
      return;
    }

    if (!mediaSourceRef.current) {
      mediaSourceRef.current = new MediaSource();
      if (!mediaSourceRef.current) {
        console.error('Failed to create MediaSource.');
        return;
      }
      videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
      
      // Add event listeners for MediaSource
      mediaSourceRef.current.addEventListener('sourceopen', onSourceOpen);
      mediaSourceRef.current.addEventListener('error', onMediaSourceError);
      mediaSourceRef.current.addEventListener('sourceclose', onSourceClose);
      
      console.log('MediaSource initialized and event listeners added.');
    }

    // Cleanup on component unmount
    return () => {
      if (mediaSourceRef.current) {
        mediaSourceRef.current.removeEventListener('sourceopen', onSourceOpen);
        mediaSourceRef.current.removeEventListener('error', onMediaSourceError);
        mediaSourceRef.current.removeEventListener('sourceclose', onSourceClose);
        mediaSourceRef.current = null;
        console.log('MediaSource event listeners removed.');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to handle MediaSource 'sourceopen' event
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
        
        // Add event listeners for SourceBuffer
        sourceBufferRef.current.addEventListener('updateend', onUpdateEnd);
        sourceBufferRef.current.addEventListener('error', onSourceBufferError);
        
        console.log('SourceBuffer created with codec:', mimeCodec);
        isMediaSourceOpenRef.current = true;
        isInitializedRef.current = true;
        
        // Start appending if bufferQueue has data
        appendToBuffer();
      } catch (e) {
        console.error('Failed to add SourceBuffer:', e);
      }
    } else {
      console.error('MIME type or codec not supported:', mimeCodec);
    }
  };

  // Function to handle MediaSource 'sourceclose' event
  const onSourceClose = () => {
    console.log('MediaSource has been closed.');
    isMediaSourceOpenRef.current = false;
    isAppendingRef.current = false;
    sourceBufferRef.current = null;

    // Clear buffer queue since we can't append anymore
    bufferQueueRef.current = [];
  };

  // Function to handle MediaSource errors
  const onMediaSourceError = (e: any) => {
    console.error('MediaSource error:', e);
  };

  // Function to handle SourceBuffer errors
  const onSourceBufferError = (e: any) => {
    console.error('SourceBuffer error:', e);
  };

  // Function to handle SourceBuffer 'updateend' event
  const onUpdateEnd = () => {
    isAppendingRef.current = false;

    // If we should end the stream and the buffer queue is empty, end it
    if (shouldEndStreamRef.current && bufferQueueRef.current.length === 0 && mediaSourceRef.current) {
      mediaSourceRef.current.endOfStream();
      console.log('Called endOfStream on MediaSource.');
    } else {
      appendToBuffer();
    }
  };

  // Listen for incoming video packets and add them to the buffer queue
  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      bufferQueueRef.current.push(...newPackets);
      console.log(`Added ${newPackets.length} new packet(s) to bufferQueue.`);

      appendToBuffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetList]);

  // Listen for end-of-stream (EOS) messages to finalize the stream
  useEffect(() => {
    if (messageList.length > 0) {
      messageList.forEach((msg) => {
        if (msg.topic === 'go-streaming' && msg.payload.toString() === 'EOSTREAMING') {
          console.log('Received EOS message.');
          
          // Set a flag to end the stream after all chunks are appended
          shouldEndStreamRef.current = true;
          appendToBuffer();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

  // Function to append data to the SourceBuffer
  const appendToBuffer = () => {
    // Log the current bufferQueueRef state for debugging
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

    // Ensure the SourceBuffer hasn't been removed
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
