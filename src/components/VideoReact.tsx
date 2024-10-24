import React, { useEffect, useContext, useRef, useState } from 'react';
import brokerContext from '@/broker_context';
import ReactPlayer from 'react-player';
import 'react-player/lib/index.css';

const VideoPlayer: React.FC = () => {
  const { packetList = [], messageList = [] } = useContext(brokerContext) || {};

  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const bufferQueueRef = useRef<Uint8Array[]>([]);
  const isAppendingRef = useRef(false);
  const playerRef = useRef<any>(null); // Référence au lecteur vidéo

  // Écoute des nouveaux paquets de vidéo
  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = [...packetList];
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

  return (
    <div>
      {videoBlob && (
        <ReactPlayer
          ref={playerRef}
          url={URL.createObjectURL(videoBlob)} // Utilise le blob comme source
          controls
          autoPlay
          style={{ width: '100%', height: 'auto' }}
          onError={(e) => console.error('Error playing video:', e)} // Gérer les erreurs de lecture
        />
      )}
    </div>
  );
};

export default VideoPlayer;