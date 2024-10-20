import { createContext, useState, useEffect, ReactNode } from 'react';
import { initializeMqttClient, disconnectMqttClient, requestVideoPacket, fetchStreamsFromAPI } from '@/broker';
import { DataObject, VideoPacket, ChatMessage } from '@/broker';

interface brokerContextProps {
  streamList: DataObject[];
  packetList: VideoPacket[];
  chatMessages: ChatMessage[];
  requestVideoPacket: (videoId: string) => void;
}

const BrokerContext = createContext<brokerContextProps>({
  streamList: [],
  packetList: [],
  chatMessages: [],
  requestVideoPacket: () => {},
});

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
  const [streamList, setStreamList] = useState<DataObject[]>([]);
  const [packetList, setPacketList] = useState<VideoPacket[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    initializeMqttClient(
      setStreamList, 
      (newPackets) => {
        setPacketList((prevPacketList: any) => [...prevPacketList, ...newPackets]);
      },
      setChatMessages
    );
    fetchStreamsFromAPI().catch((error) => console.error('Erreur lors de la récupération des streams', error));
    return () => {
      disconnectMqttClient();
    };
  }, []);

  return (
    <BrokerContext.Provider value={{ streamList, packetList, chatMessages, requestVideoPacket }}>
      {children}
    </BrokerContext.Provider>
  );
};

export default BrokerContext;
