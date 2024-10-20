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
  data: Uint8Array; 
}

export interface VideoPacketSIS {
  MsgPackPacket: Uint8Array;
  A: Uint8Array;
  V: Uint8Array;
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
let packetList: VideoPacket[] = [];
let chatMessages: any[] = [];
let currentPacketNumber = 0;

const BROKER_HOSTNAME = window.location.hostname;
const BROKER_PORT = 1886;
const BROKER_USERNAME = "viewer";
const BROKER_PASSWORD = "zimzimlegoat";
const MQTT_URL = `mqtt://${BROKER_HOSTNAME}:${BROKER_PORT}`;
const BROKER_SERVICE_TOPIC = 'packet-request'; 

let onStreamListUpdate: (data: DataObject[]) => void = () => {};
let onPacketListUpdate: (packets: VideoPacket[]) => void = () => {};
let chatMessagesCallback: ((messages: any[]) => void) | null = null;

export const initializeMqttClient = (
  onDataUpdate: (data: DataObject[]) => void, 
  onPacketUpdate: (packets: VideoPacket[]) => void,
  onChatMessage: (messages: any[]) => void
) => {
  onStreamListUpdate = onDataUpdate;
  onPacketListUpdate = onPacketUpdate;
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




export const requestVideoPacket = (videoId: number) => {
  if (client) {
    let channel_uuid = `stream-${clientID}`;
    const packetRequest = {
      videoId: videoId,
      packetNumber: currentPacketNumber,
      channel_uuid: channel_uuid, 
    };

    subscribeToChannel(packetRequest.channel_uuid);
    client.publish(BROKER_SERVICE_TOPIC, JSON.stringify(packetRequest));
    console.log('Requête pour le paquet', currentPacketNumber);
  }
};

const subscribeToChannel = (videoTopic: string) => {
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
              packetList.push(decodedMessage);

              onPacketListUpdate(packetList);

              currentPacketNumber++;
              requestNextPacket(clientID, videoTopic, currentPacketNumber);
            } catch (error) {
              console.error('Erreur de décodage MsgPack', error);
            }
          }
        });
      }
    });

    client.subscribe(`chat-${clientID}`, (err) => {
      if (err) {
        console.error('Erreur lors de la souscription au topic chat', err);
      } else {
        console.log(`Souscrit au topic de chat chat-${clientID}`);

        client?.on('message', (receivedTopic, message) => {
          if (receivedTopic === `chat-${clientID}`) {
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

const requestNextPacket = (clientId: string, topic: string, packetNumber: number) => {
  if (client) {
    const nextPacketRequest = {
      clientId,
      topic,
      packetNumber,
    };

    client.publish(BROKER_SERVICE_TOPIC, JSON.stringify(nextPacketRequest));
    console.log('Requête pour le paquet suivant', packetNumber);
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
export const getPacketList = () => packetList;
export const getClientID = () => clientID;
