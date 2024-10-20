import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import brokerContext from '@/broker_context';
import { useContext } from 'react';
import { getClientID, sendMessageToChat, ChatMessage } from "@/broker";


interface ChatProps {
  username: string;
}

export function Chat({ username }: ChatProps) {
  const clientID = getClientID();
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const { chatMessages: messagesFromContext } = useContext(brokerContext);

  useEffect(() => {
    setChatMessages(messagesFromContext);
  }, [messagesFromContext]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const sentMessage: ChatMessage = {
      id: uuidv4(),
      content: newMessage,
      senderId: clientID,
      senderName: username,
    };

    sendMessageToChat(sentMessage); 
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSendMessage(); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ScrollArea className="flex-grow rounded-md border">
        <div className="p-4">
          {chatMessages.map((message) => (
            <React.Fragment key={message.id}>
              <div className="text-sm">
                <strong>{message.senderName}:</strong> {message.content}
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 flex flex-col">
        <Textarea
          placeholder="Type your message here."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add the key down handler here
          className="flex-grow resize-none"
        />
        <Button 
          disabled={username === ''}
          onClick={handleSendMessage} 
          className="mt-2 w-full"
        >
          Send
        </Button>
      </div>
    </div>
  );
}


