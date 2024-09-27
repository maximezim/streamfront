import React, { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
}

interface ChatProps {
  messages: ChatMessage[];
}

export function Chat({ messages }: ChatProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    // Here you would typically send the message to your backend
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow rounded-md border">
        <div className="p-4">
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <div className="text-sm">
                <strong>{message.sender}:</strong> {message.content}
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