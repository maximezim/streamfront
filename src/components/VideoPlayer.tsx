import React, { useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const bufferQueueRef = useRef<Uint8Array[]>([]);
  const isAppendingRef = useRef(false);
  const isMediaSourceOpenRef = useRef(false);

  // Initialize MediaSource on component mount
  useEffect(() => {
    if (!videoRef.current) return;

    if (!mediaSourceRef.current) {
      mediaSourceRef.current = new MediaSource();
      videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
      mediaSourceRef.current.addEventListener('sourceopen', onSourceOpen);
      mediaSourceRef.current.addEventListener('error', onMediaSourceError);
    }

    return () => {
      if (mediaSourceRef.current) {
        mediaSourceRef.current.removeEventListener('sourceopen', onSourceOpen);
        mediaSourceRef.current.removeEventListener('error', onMediaSourceError);
        mediaSourceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle MediaSource 'sourceopen' event
  const onSourceOpen = () => {
    if (!mediaSourceRef.current || !videoRef.current) return;

    const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';
    if (MediaSource.isTypeSupported(mimeCodec)) {
      try {
        sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer(mimeCodec);
        sourceBufferRef.current.mode = 'segments';
        sourceBufferRef.current.addEventListener('updateend', onUpdateEnd);
        sourceBufferRef.current.addEventListener('error', onSourceBufferError);
        console.log('SourceBuffer created with codec:', mimeCodec);
        isMediaSourceOpenRef.current = true;
        appendToBuffer(); // Start appending if bufferQueue has data
      } catch (e) {
        console.error('Failed to add SourceBuffer:', e);
      }
    } else {
      console.error('MIME type or codec not supported:', mimeCodec);
    }
  };

  // Handle MediaSource errors
  const onMediaSourceError = (e: any) => {
    console.error('MediaSource error:', e);
  };

  // Handle SourceBuffer errors
  const onSourceBufferError = (e: any) => {
    console.error('SourceBuffer error:', e);
  };

  // Handle SourceBuffer 'updateend' event
  const onUpdateEnd = () => {
    isAppendingRef.current = false;
    appendToBuffer();
  };

  // Listen for incoming video packets and add them to the buffer queue
  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      bufferQueueRef.current.push(...newPackets);
      console.log('Added new packets to bufferQueue:', newPackets.length);
      appendToBuffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetList]);

  // Function to append data to the SourceBuffer
  const appendToBuffer = () => {
    if (
      !isMediaSourceOpenRef.current ||
      isAppendingRef.current ||
      !sourceBufferRef.current ||
      sourceBufferRef.current.updating ||
      bufferQueueRef.current.length === 0
    ) {
      return;
    }

    const chunk = bufferQueueRef.current.shift();
    if (!chunk) return;

    isAppendingRef.current = true;

    try {
      sourceBufferRef.current.appendBuffer(chunk);
      console.log('Appended chunk of size:', chunk.byteLength);
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