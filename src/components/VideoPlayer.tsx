import React, { useState, useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [bufferQueue, setBufferQueue] = useState<Uint8Array[]>([]);

  useEffect(() => {
    // Ajouter les nouvelles données à la file d'attente
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      setBufferQueue((prevQueue) => [...prevQueue, ...newPackets]);
    }
  }, [packetList]);

  // Fonction pour afficher la vidéo lorsque les paquets sont disponibles
  const displayVideo = () => {
    if (bufferQueue.length === 0 || !videoRef.current) return;

    const combinedBytes = new Uint8Array(bufferQueue.reduce((sum, packet) => sum + packet.length, 0));
    let offset = 0;
    bufferQueue.forEach((packet) => {
      combinedBytes.set(packet, offset);
      offset += packet.length;
    });

    const blob = new Blob([combinedBytes], { type: 'video/x-msvideo' }); // Ajustez le type si nécessaire
    videoRef.current.src = URL.createObjectURL(blob);
    videoRef.current.load();
    videoRef.current.play();
  };

  // Écoutez les mises à jour de la file d'attente et affichez la vidéo
  useEffect(() => {
    displayVideo();
  }, [bufferQueue]);

  return (
    <div>
      <h3>Lecteur Vidéo</h3>
      <video ref={videoRef} controls autoPlay />
      {packetList.length > 0 ? (
        <p>Nombre de paquets reçus : {packetList.length}</p>
      ) : (
        <p>En attente des paquets...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
