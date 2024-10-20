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
      console.log('Nouveaux paquets ajoutés à la file d\'attente:', newPackets.length);
    }
  }, [packetList]);

  // Fonction pour initialiser MediaSource et SourceBuffer
  const initMediaSource = () => {
    if (!videoRef.current) return;

    // Créer un nouvel objet MediaSource
    mediaSourceRef.current = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
    console.log('MediaSource créé, en attente de l\'ouverture du SourceBuffer.');

    // Lorsque MediaSource est prêt, initialiser le SourceBuffer
    mediaSourceRef.current.addEventListener('sourceopen', () => {
      if (!mediaSourceRef.current || !videoRef.current) return;

      const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"'; // Ajustez les codecs selon le flux MP4
      try {
        sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer(mimeCodec);
        console.log('SourceBuffer ajouté avec codec:', mimeCodec);
      } catch (e) {
        console.error('Erreur lors de l\'ajout du SourceBuffer:', e);
        return;
      }

      sourceBufferRef.current.addEventListener('updateend', () => {
        setIsSourceBufferUpdating(false);
        console.log('Mise à jour du SourceBuffer terminée.');
        
        // Afficher la taille actuelle du buffer
        if(!sourceBufferRef.current) return;
        const bufferedRanges = sourceBufferRef.current.buffered;
        for (let i = 0; i < bufferedRanges.length; i++) {
          console.log(`Range ${i}: start=${bufferedRanges.start(i)}, end=${bufferedRanges.end(i)}`);
        }

        if (bufferQueue.length > 0) {
          appendBuffer();
        }
      });

      // Ajouter les paquets vidéo au buffer
      appendBuffer();
    });
  };

  // Fonction pour ajouter des paquets au SourceBuffer
  const appendBuffer = () => {
    if (!sourceBufferRef.current || sourceBufferRef.current.updating || bufferQueue.length === 0) {
      console.log('Le SourceBuffer est en cours de mise à jour ou la file d\'attente est vide.');
      return;
    }

    const packet = bufferQueue.shift()!;
    setBufferQueue([...bufferQueue]);
    setIsSourceBufferUpdating(true);
    try {
      sourceBufferRef.current.appendBuffer(packet);
      console.log('Paquet ajouté au SourceBuffer:', packet.byteLength);

      // Afficher la taille du buffer après l'ajout du paquet
      const bufferedRanges = sourceBufferRef.current.buffered;
      for (let i = 0; i < bufferedRanges.length; i++) {
        console.log(`Range après ajout du paquet ${i}: start=${bufferedRanges.start(i)}, end=${bufferedRanges.end(i)}`);
      }

    } catch (e) {
      console.error('Erreur lors de l\'ajout d\'un paquet au SourceBuffer:', e);
    }
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
