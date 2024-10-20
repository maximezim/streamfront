import React, { useState, useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const [bufferQueue, setBufferQueue] = useState<Uint8Array[]>([]);
  const [isSourceBufferUpdating, setIsSourceBufferUpdating] = useState(false);

  useEffect(() => {
    if (packetList.length > 0) {
      const newPackets: Uint8Array[] = packetList.map((packet: VideoPacket) => packet.data);
      setBufferQueue((prevQueue) => [...prevQueue, ...newPackets]);
      console.log('Nouveaux paquets ajoutés à la file d\'attente:', newPackets.length);
    }
  }, [packetList]);

  const initMediaSource = () => {
    if (!videoRef.current) return;

    mediaSourceRef.current = new MediaSource();
    videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
    console.log('MediaSource créé, en attente de l\'ouverture du SourceBuffer.');

    mediaSourceRef.current.addEventListener('sourceopen', () => {
      if (!mediaSourceRef.current || !videoRef.current) return;

      const mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"';
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

        if (sourceBufferRef.current) {
          const bufferedRanges = sourceBufferRef.current.buffered;
          for (let i = 0; i < bufferedRanges.length; i++) {
            console.log(`Range ${i}: start=${bufferedRanges.start(i)}, end=${bufferedRanges.end(i)}`);
          }
        }

        if (bufferQueue.length > 0) {
          setTimeout(() => appendBuffer(), 100);
        }
      });

      appendBuffer();
    });
  };

  const appendBuffer = () => {
    if (!sourceBufferRef.current || sourceBufferRef.current.updating || bufferQueue.length === 0) {
      console.log(sourceBufferRef.current?.updating);
      console.log(bufferQueue.length);
      console.log('Le SourceBuffer est en cours de mise à jour ou la file d\'attente est vide.');
      return;
    }

    const packet = bufferQueue.shift()!;
    setBufferQueue([...bufferQueue]);
    setIsSourceBufferUpdating(true);

    try {
      sourceBufferRef.current.appendBuffer(packet);
      console.log('Paquet ajouté au SourceBuffer:', packet.byteLength);

      if (sourceBufferRef.current) {
        const bufferedRanges = sourceBufferRef.current.buffered;
        for (let i = 0; i < bufferedRanges.length; i++) {
          console.log(`Range après ajout du paquet ${i}: start=${bufferedRanges.start(i)}, end=${bufferedRanges.end(i)}`);
        }
      }
    } catch (e) {
      console.error('Erreur lors de l\'ajout d\'un paquet au SourceBuffer:', e);
      setIsSourceBufferUpdating(false);
    }
  };

  useEffect(() => {
    if (packetList.length > 0 && !mediaSourceRef.current) {
      initMediaSource();
    }
  }, [packetList]);

  useEffect(() => {
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
