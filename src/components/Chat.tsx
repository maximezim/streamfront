import React, { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { connectToBroker, sendMessage } from '../brokerService'
import { v4 as uuidv4 } from 'uuid'  // Import UUID library

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
}

interface ChatProps {
  messages: ChatMessage[];
}

export function Chat({ messages }: ChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages)

  // Generate a unique client ID
  const clientIdRef = useRef<string>(uuidv4());

  useEffect(() => {
    // Connect to the broker when the component is mounted
    connectToBroker((msg: string) => {
      // Parse the incoming message
      const messageObject = JSON.parse(msg);

      // Check if the message already exists to prevent duplicates
      setChatMessages((prevMessages) => {
        if (prevMessages.some(m => m.id === messageObject.id)) {
          // Message already exists
          return prevMessages;
        } else {
          // Add new message
          const receivedMessage: ChatMessage = {
            id: messageObject.id,
            content: messageObject.content,
            senderId: messageObject.senderId,
            senderName: messageObject.senderName,
          };
          return [...prevMessages, receivedMessage];
        }
      });
    });
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Create the message object with a unique ID and sender info
    const sentMessage: ChatMessage = {
      id: uuidv4(),
      content: newMessage,
      senderId: clientIdRef.current,
      senderName: 'You'
    }

    // Send the message to the broker
    sendMessage(sentMessage);

    // Add the new message to the chat immediately
    setChatMessages((prevMessages) => [...prevMessages, sentMessage])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full">
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
          className="flex-grow"
        />
        <Button 
          onClick={handleSendMessage} 
          className="mt-2 w-full"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
