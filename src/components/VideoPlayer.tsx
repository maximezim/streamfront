import React, { useState, useEffect } from 'react';
import videoUrl from '@/assets/test.mp4'; // Importer la vidéo

const VideoPlayer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlobUrl, setCurrentBlobUrl] = useState<string | null>(null);

  const fetchAndDisplayVideo = async (videoFileUrl: string) => {
    try {
      const response = await fetch(videoFileUrl); // Charger la vidéo depuis l'URL
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const videoArrayBuffer = await response.arrayBuffer(); // Convertir la réponse en ArrayBuffer
      const totalBytes = videoArrayBuffer.byteLength;

      // Diviser le ArrayBuffer en plusieurs parties
      const numberOfParts = 10; // Nombre de parties à diviser
      const partSize = Math.ceil(totalBytes / numberOfParts); // Taille de chaque partie
      const parts: Uint8Array[] = []; // Pour stocker les parties au fur et à mesure

      let combinedArray = new Uint8Array(0); // Tableau pour combiner les morceaux progressifs

      const loadPart = (partIndex: number) => {
        if (partIndex >= numberOfParts) {
          console.log('All parts loaded.');
          return;
        }

        const start = partIndex * partSize;
        const end = Math.min(start + partSize, totalBytes);
        const partData = new Uint8Array(videoArrayBuffer.slice(start, end));

        // Concaténer le nouveau morceau à l'array existant
        const updatedArray = new Uint8Array(combinedArray.length + partData.length);
        updatedArray.set(combinedArray, 0);
        updatedArray.set(partData, combinedArray.length);

        combinedArray = updatedArray; // Mettre à jour le tableau complet

        // Créer un Blob à partir des données combinées
        const newBlob = new Blob([combinedArray], { type: 'video/mp4' });
        const newBlobUrl = URL.createObjectURL(newBlob);

        // Mettre à jour la vidéo avec le nouveau Blob en manipulant directement le DOM
        updateVideoSource(newBlobUrl, partIndex);

        // Charger la partie suivante après un court délai
        setTimeout(() => loadPart(partIndex + 1), 500); // Ajoute un délai pour simuler le chargement progressif
      };

      loadPart(0); // Commencer avec la première partie
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setIsLoading(false); // Fin du chargement
    }
  };

  const updateVideoSource = (newBlobUrl: string, partIndex: number) => {
    const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement; // Manipulation directe du DOM

    if (videoElement) {
      if (currentBlobUrl) {
        // Révoquer l'ancien URL Blob pour libérer la mémoire
        URL.revokeObjectURL(currentBlobUrl);
      }

      // Mettre à jour le nouvel URL Blob
      setCurrentBlobUrl(newBlobUrl);

      // Assigner le nouveau Blob à la vidéo
      videoElement.src = newBlobUrl;
      videoElement.load(); // Recharger la vidéo pour prendre en compte le nouveau contenu

      console.log(`Part ${partIndex + 1} loaded and video updated with new Blob URL.`);
    }
  };

  useEffect(() => {
    // Lancer le chargement de la vidéo progressive
    fetchAndDisplayVideo(videoUrl);
  }, []);

  return (
    <div>
      <h3>Lecteur Vidéo Progressif avec Blob</h3>

      {isLoading && <p>Chargement de la vidéo...</p>}

      <video
        id="videoPlayer" // Manipulation via id, comme dans ton exemple
        controls
        autoPlay
        muted
        style={{ width: '100%', height: 'auto' }}
      >
        Votre navigateur ne supporte pas la balise vidéo.
      </video>
    </div>
  );
};

export default VideoPlayer;
