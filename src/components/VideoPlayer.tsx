import React, { useEffect, useContext, useRef, useState } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList = [], messageList = [] } = useContext(brokerContext) || {};
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const bufferQueueRef = useRef<Uint8Array[]>([]);

  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      bufferQueueRef.current.push(...newPackets);
      console.log(`Added ${newPackets.length} new packet(s) to bufferQueue.`);
      appendToBlob();
    }
  }, [packetList]);

  useEffect(() => {
    if (messageList.length > 0) {
      messageList.forEach((msg) => {
        if (msg.topic === 'go-streaming' && msg.payload.toString() === 'EOSTREAMING') {
          console.log('Received EOS message.');
          //finalizeVideoBlob();
        }
      });
    }
  }, [messageList]);

  const appendToBlob = () => {
    if (bufferQueueRef.current.length === 0) {
      console.log('No chunks to append to the Blob.');
      return;
    }

    // Create a Blob from the current buffer queue
    const newBlob = new Blob(bufferQueueRef.current.map(chunk => new Uint8Array(chunk)), { type: 'video/mp4' });

    // Set the new Blob
    setVideoBlob(newBlob);
    
    console.log(`Appended chunk. New Blob size: ${newBlob.size} bytes.`);
  };

  const finalizeVideoBlob = () => {
    console.log('Finalizing video Blob.');
    
    // Call appendToBlob to ensure the last chunk is added
    appendToBlob();
  };

  useEffect(() => {
    if (videoRef.current && videoBlob) {
      const videoUrl = URL.createObjectURL(videoBlob);
      videoRef.current.src = videoUrl;

      // Cleanup the URL object on component unmount
      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [videoBlob]);

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
