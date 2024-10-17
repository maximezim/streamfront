import mqtt from 'mqtt'
import { v4 as uuidv4 } from 'uuid'  

const BROKER_URL = "remicaulier.fr"
const BROKER_PORT = 1886 
const BROKER_USERNAME = "viewer"
const BROKER_PASSWORD = "zimzimlegoat"
const BROKER_STREAMING_TOPIC = "chat-streaming"

let client = null;


export function connectToBroker(onMessageReceived) {
  if (!client) {
    // Using MQTT protocol with TCP
    const brokerUrl = `mqtt://${BROKER_URL}:${BROKER_PORT}`
    const clientId = uuidv4();  // Generate a unique clientId

    client = mqtt.connect(brokerUrl, {
      clientId: clientId,
      username: BROKER_USERNAME,
      password: BROKER_PASSWORD
    });

    client.on('connect', () => {
      console.log('Connected to broker with clientId:', clientId);
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
}

export function sendMessage(messageObject) {
  if (client) {
    client.publish(BROKER_STREAMING_TOPIC, messageObject);
  }
}
