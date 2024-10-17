import mqtt from 'mqtt'
import { v4 as uuidv4 } from 'uuid'  
import { decode } from "@msgpack/msgpack";

const BROKER_URL = "remicaulier.fr"
const BROKER_PORT = 1886 
const BROKER_USERNAME = "viewer"
const BROKER_PASSWORD = "zimzimlegoat"
const BROKER_STREAMING_TOPIC = "chat-streaming"
const BROKER_SERVICE_TOPIC = "broker-service"

let BROKER_VIDEO_TOPIC = "";
let client = null;
let idClient = null;

let paquets = [];
let paquetCpt = 0;

export function brokerService(){
  
  if(!client){

    const brokerUrl = `mqtt://${BROKER_URL}:${BROKER_PORT}`
    const clientId = uuidv4();  
    idClient = clientId;

    client = mqtt.connect(brokerUrl, {
      clientId: clientId,
      username: BROKER_USERNAME,
      password: BROKER_PASSWORD
    });
    
    client.on('connect', () => {
      client.subscribe(BROKER_SERVICE_TOPIC, (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === BROKER_SERVICE_TOPIC) {
        const msg = message.toString();
        const object = JSON.parse(msg);
        if (object.channel) {
          BROKER_VIDEO_TOPIC = object.channel;
        }
      }
    });

  }
}

export function connectToBroker(onMessageReceived) {

    client.on('connect', () => {
      client.subscribe(BROKER_STREAMING_TOPIC, (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === BROKER_STREAMING_TOPIC) {
        const msg = message.toString();
        onMessageReceived(msg);
      }
    });

    client.on('error', (error) => {
      console.error('Connection error:', error);
    });

}

export function sendMessage(messageObject) {
  if (client) {
    client.publish(BROKER_STREAMING_TOPIC, messageObject);
  }
}

export function sendStream(id, setVideoData) {

  if (client) {
    paquets = [];
    paquetCpt = 0;
    BROKER_VIDEO_TOPIC = 'stream-' + idClient;
    const object = {
      id: id,
      channel: BROKER_VIDEO_TOPIC,
      paquet : paquetCpt,
    };

    const message = JSON.stringify(object);
    client.publish(BROKER_SERVICE_TOPIC, message);
    paquetCpt++;

    client.on('connect', () => {
      client.subscribe(BROKER_VIDEO_TOPIC,(err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      if (topic === BROKER_VIDEO_TOPIC) {

        let paquet = decode(message);
        paquets.push(paquet.data);

        setVideoData(paquets);

        const object = {
          id: id,
          channel: BROKER_VIDEO_TOPIC,
          paquet : paquetCpt,
        };

        client.publish(BROKER_SERVICE_TOPIC,JSON.stringify(object));
        paquetCpt++;

      }});
    
  }
}
