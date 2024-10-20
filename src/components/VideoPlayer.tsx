import React, { useState, useEffect, useContext, useRef } from 'react';
import brokerContext from '@/broker_context';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { VideoPacket } from '@/broker';

const VideoPlayer: React.FC = () => {
  const { packetList } = useContext(brokerContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      });
      setLoaded(true);
    };

    loadFFmpeg();
  }, []);

  const transcode = async () => {
    if (packetList.length === 0) {
      if (messageRef.current) {
        messageRef.current.innerHTML = "Aucun paquet disponible pour la conversion.";
      }
      return;
    }

    // Fusionner les paquets de bytes en un seul Uint8Array
    const allBytes = new Uint8Array(packetList.reduce((sum, packet) => sum + packet.data.length, 0));
    let offset = 0;
    packetList.forEach(packet => {
      allBytes.set(packet.data, offset);
      offset += packet.data.length;
    });

    // Écrire le fichier AVI dans le système de fichiers de FFmpeg
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile("input.avi", allBytes);
    await ffmpeg.exec(["-i", "input.avi", "output.mp4"]); // Conversion en MP4

    // Lire le fichier MP4 et l'afficher
    const fileData = await ffmpeg.readFile('output.mp4');
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    }

    if (messageRef.current) {
      messageRef.current.innerHTML = "Conversion terminée avec succès.";
    }
  };

  return (
    <div>
      <h3>Lecteur Vidéo avec Conversion AVI à MP4</h3>
      <video ref={videoRef} controls autoPlay />
      {packetList.length > 0 ? (
        <>
          <p>Nombre de paquets reçus : {packetList.length}</p>
          <button onClick={transcode}>Convertir AVI en MP4</button>
        </>
      ) : (
        <p>En attente des paquets...</p>
      )}
      <p ref={messageRef}></p>
    </div>
  );
};

export default VideoPlayer;
