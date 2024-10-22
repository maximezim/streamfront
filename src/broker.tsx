import mqtt from 'mqtt';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';  
import * as msgpack from '@msgpack/msgpack';

export interface DataObject {
  ID: number;
  DeletedAt: string | null;
  VideoID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface VideoPacket {
  video_id: string;
  packet_number: number;
  total_packets: number;
  data: Uint8Array; // Champ contenant les données en Uint8Array
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
}

let client: mqtt.MqttClient | null = null;
let clientID: string;

let streamList: DataObject[] = [];
let packetList: Uint8Array[] = []; // On garde seulement le champ "data" des VideoPacket
let chatMessages: any[] = [];
let currentPacketNumber = 1;

const BROKER_HOSTNAME = window.location.hostname;
const BROKER_PORT = 1886;
const BROKER_USERNAME = "viewer";
const BROKER_PASSWORD = "zimzimlegoat";
const MQTT_URL = `mqtt://${BROKER_HOSTNAME}:${BROKER_PORT}`;
const BROKER_SERVICE_TOPIC = 'packet-request'; 

let onStreamListUpdate: (data: DataObject[]) => void = () => {};
let onPacketListUpdate: (packets: Uint8Array[]) => void = () => {}; // On travaille avec Uint8Array[]
let chatMessagesCallback: ((messages: any[]) => void) | null = null;

function wait(ms: number): Promise<void> {
  console.log('Waiting...');
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const initializeMqttClient = (
  onDataUpdate: (data: DataObject[]) => void, 
  onPacketUpdate: (packets: Uint8Array[]) => void, // Modification ici pour Uint8Array
  onChatMessage: (messages: any[]) => void
) => {
  onStreamListUpdate = onDataUpdate;
  onPacketListUpdate = (newPackets: Uint8Array[]) => { // On gère des Uint8Array
    onPacketUpdate(newPackets);
  };
  chatMessagesCallback = onChatMessage;
  
  clientID = uuidv4(); 
  client = mqtt.connect(MQTT_URL, {
    clientId: clientID,
    username: BROKER_USERNAME,
    password: BROKER_PASSWORD
  });

  client.on('connect', () => {
    console.log('Connecté au broker MQTT');
    client?.subscribe(BROKER_SERVICE_TOPIC, (err) => {
      if (err) {
        console.error('Erreur lors de la souscription au topic', err);
      } else {
        console.log(`Souscrit au topic ${BROKER_SERVICE_TOPIC}`);
      }
    });
  });

  client.on('close', () => {
    console.log('Déconnecté du broker MQTT');
  });
};

export const fetchStreamsFromAPI = async () => {
  try {
    const response = await axios.get<DataObject[]>('/videos', {});
    streamList = response.data;
    onStreamListUpdate(streamList);
    console.log('Données reçues de l\'API:', streamList);
  } catch (error) {
    console.error('Erreur lors de la récupération des données depuis l\'API', error);
  }
};

export const requestVideoPacket = (videoId: string) => {
  if (client) {
    let channel_uuid = `stream-${clientID}`;
    const packetRequest = {
      video_id: videoId,
      packet_number: currentPacketNumber,
      channel_uuid: channel_uuid, 
    };

    subscribeToChannel(videoId, packetRequest.channel_uuid);
    client.publish(BROKER_SERVICE_TOPIC, JSON.stringify(packetRequest));
    console.log('Requête pour le paquet', currentPacketNumber);
  }
};

const subscribeToChannel = (videoID: string, videoTopic: string) => {
  if (client) {
    client.subscribe(videoTopic, (err) => {
      if (err) {
        console.error('Erreur lors de la souscription au topic vidéo', err);
      } else {
        console.log(`Souscrit au topic vidéo ${videoTopic}`);

        client?.on('message', async (receivedTopic, message) => {
          if (receivedTopic === videoTopic) {
            try {
              const decodedMessage = msgpack.decode(new Uint8Array(message)) as VideoPacket;
              const updatedPacketList = [...packetList, decodedMessage.data];

              onPacketListUpdate(updatedPacketList); 
              currentPacketNumber++;
              requestNextPacket(videoID, videoTopic);
            } catch (error) {
              console.error('Erreur de décodage MsgPack', error);
            }
          }
        });
      }
    });

    client.subscribe(`chat-${videoID}`, (err) => {
      if (err) {
        console.error('Erreur lors de la souscription au topic chat', err);
      } else {
        console.log(`Souscrit au topic de chat chat-${videoID}`);

        client?.on('message', (receivedTopic, message) => {
          if (receivedTopic === `chat-${videoID}`) {
            try {
              const chatMessage = JSON.parse(message.toString());
              chatMessages.push(chatMessage);

              if (chatMessagesCallback) {
                chatMessagesCallback([...chatMessages]);
              }
            } catch (error) {
              console.error('Erreur de parsing du message de chat', error);
            }
          }
        });
      }
    });
  }
};

const requestNextPacket = (videoId: string, topic: string) => {
  if (client) {
    const nextPacketRequest = {
      video_id: videoId,
      packet_number: currentPacketNumber,
      channel_uuid: topic, 
    };
    client.publish(BROKER_SERVICE_TOPIC, JSON.stringify(nextPacketRequest));
    console.log('Requête pour le paquet suivant', currentPacketNumber);
  }
};

export const sendMessageToChat = (message: any) => {
  if (client) {
    client.publish(`chat-${clientID}`, JSON.stringify(message));
  }
}

export const disconnectMqttClient = () => {
  if (client) {
    client.end();
    console.log('Client MQTT déconnecté');
  }
};

export const getStreamList = () => streamList;
export const getPacketList = () => packetList; // Liste des Uint8Array (données des paquets)
export const getClientID = () => clientID;
