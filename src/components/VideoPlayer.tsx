import React, { useEffect, useContext, useRef, useState } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList = [], messageList = [] } = useContext(brokerContext) || {};
  
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bufferQueueRef = useRef<Uint8Array[]>([]);
  const isAppendingRef = useRef(false);

  // Écoute des nouveaux paquets de vidéo
  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      bufferQueueRef.current.push(...newPackets);
      console.log(`Added ${newPackets.length} new packet(s) to bufferQueue.`);
      appendToBlob();
    }
  }, [packetList]);

  // Fonction pour gérer l'ajout de paquets au Blob
  const appendToBlob = () => {
    if (bufferQueueRef.current.length === 0 || isAppendingRef.current) {
      console.log('Conditions not met for appending. Skipping.');
      return;
    }

    isAppendingRef.current = true; // Indique que nous sommes en train d'ajouter au Blob

    // Log l'état actuel de bufferQueue pour le débogage
    console.log('Current bufferQueue before appending:', bufferQueueRef.current);

    // Crée un Blob à partir de la file d'attente actuelle
    const newBlob = new Blob(bufferQueueRef.current.map(chunk => new Uint8Array(chunk)), { type: 'video/mp4' });

    // Met à jour le Blob vidéo
    setVideoBlob(newBlob);
    console.log(`Appended chunk. New Blob size: ${newBlob.size} bytes.`);

    // Vider la queue après ajout
    bufferQueueRef.current = []; // Clear the queue after appending
    isAppendingRef.current = false; // Réinitialise le flag d'ajout
  };

  // Écoute pour les messages d'EOS pour finaliser le flux
  useEffect(() => {
    if (messageList.length > 0) {
      messageList.forEach((msg) => {
        if (msg.topic === 'go-streaming' && msg.payload.toString() === 'EOSTREAMING') {
          console.log('Received EOS message. Finalizing video blob.');
          // Ici, vous pouvez décider de finaliser le blob si besoin
        }
      });
    }
  }, [messageList]);

  useEffect(() => {
    if (videoRef.current && videoBlob) {
      videoRef.current.src = URL.createObjectURL(videoBlob);
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
