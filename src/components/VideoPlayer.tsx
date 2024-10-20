import React, { useState, useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null); // Référence pour MediaSource
  const sourceBufferRef = useRef<SourceBuffer | null>(null); // Référence pour SourceBuffer
  const [bufferQueue, setBufferQueue] = useState<Uint8Array[]>([]);
  const [isSourceBufferUpdating, setIsSourceBufferUpdating] = useState(false);

  useEffect(() => {
    // Ajouter les nouvelles données à la file d'attente
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      setBufferQueue((prevQueue) => [...prevQueue, ...newPackets]);
    }
  }, [packetList]);

  // Fonction pour initialiser MediaSource et SourceBuffer
  const initMediaSource = () => {
    if (!videoRef.current) return;

    // Créer un nouvel objet MediaSource
    mediaSourceRef.current = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);

    // Lorsque MediaSource est prêt, initialiser le SourceBuffer
    mediaSourceRef.current.addEventListener('sourceopen', () => {
      if (!mediaSourceRef.current || !videoRef.current) return;

      // Créer un SourceBuffer pour MP4 (codecs vidéo et audio adaptés à votre flux)
      const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"'; // Ajustez les codecs selon le flux MP4
      sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer(mimeCodec);

      // Surveiller l'événement de mise à jour du buffer
      sourceBufferRef.current.addEventListener('updateend', () => {
        setIsSourceBufferUpdating(false); // Marquer la fin de la mise à jour du buffer
        if (bufferQueue.length > 0) {
          appendBuffer(); // Ajouter le prochain segment dès que le buffer est disponible
        }
      });

      // Ajouter les paquets vidéo au buffer
      appendBuffer();
    });
  };

  // Fonction pour ajouter des paquets au SourceBuffer
  const appendBuffer = () => {
    if (!sourceBufferRef.current || sourceBufferRef.current.updating || bufferQueue.length === 0) {
      return;
    }

    // Prendre le premier paquet de la file d'attente
    const packet = bufferQueue.shift()!;
    setBufferQueue([...bufferQueue]); // Mettre à jour la file d'attente

    // Ajouter le paquet au SourceBuffer
    setIsSourceBufferUpdating(true);
    sourceBufferRef.current.appendBuffer(packet);
  };

  useEffect(() => {
    // Initialiser MediaSource lors du montage
    if (packetList.length > 0 && !mediaSourceRef.current) {
      initMediaSource();
    }
  }, [packetList]);

  useEffect(() => {
    // Quand des paquets sont disponibles, les ajouter au SourceBuffer
    if (!isSourceBufferUpdating && bufferQueue.length > 0) {
      appendBuffer();
    }
  }, [bufferQueue, isSourceBufferUpdating]);

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
