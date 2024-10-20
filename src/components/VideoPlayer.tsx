import React, { useState, useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const [bufferQueue, setBufferQueue] = useState<Uint8Array[]>([]);

  useEffect(() => {
    // Crée un MediaSource
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.src = URL.createObjectURL(mediaSource);
    }

    mediaSource.addEventListener('sourceopen', () => {
      // Crée un SourceBuffer pour le format vidéo
      if (mediaSource.readyState === 'open') {
        sourceBufferRef.current = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        processBufferQueue(); // Démarre le traitement de la file d'attente
      }
    });

    // Nettoyage lorsque le composant est démonté
    return () => {
      if (videoElement) {
        URL.revokeObjectURL(videoElement.src);
      }
      mediaSourceRef.current = null;
      sourceBufferRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Ajoute les nouvelles données à la file d'attente
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      setBufferQueue((prevQueue: any) => [...prevQueue, ...newPackets]);
    }
  }, [packetList]);

  const processBufferQueue = () => {
    if (sourceBufferRef.current && bufferQueue.length > 0) {
      const data: Uint8Array = bufferQueue[0]; // Récupère le premier élément de la file d'attente
      if (sourceBufferRef.current.updating) {
        // Si le SourceBuffer est occupé, ne rien faire pour le moment
        return;
      }
      // Ajoute le buffer au SourceBuffer
      sourceBufferRef.current.appendBuffer(data);
      // Supprime le premier élément de la file d'attente
      setBufferQueue((prevQueue: string | any[]) => prevQueue.slice(1));
    }
  };

  // Écoutez l'événement updateend pour savoir quand le SourceBuffer est prêt pour de nouvelles données
  useEffect(() => {
    if (sourceBufferRef.current) {
      const handleUpdateEnd = () => {
        processBufferQueue(); // Traite la prochaine donnée de la file d'attente
      };

      sourceBufferRef.current.addEventListener('updateend', handleUpdateEnd);

      // Nettoyez l'écouteur d'événements
      return () => {
        sourceBufferRef.current?.removeEventListener('updateend', handleUpdateEnd);
      };
    }
  }, [bufferQueue]);

  return (
    <div>
      <h3>Lecteur Vidéo Progressif avec MediaSource</h3>
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
