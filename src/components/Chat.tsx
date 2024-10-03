import React, { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { connectToBroker, sendMessage } from '../brokerService'
import { v4 as uuidv4 } from 'uuid'
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip'

interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderName: string
}

interface ChatProps {
  messages: ChatMessage[]
  username: string | null
}

export function Chat({ messages, username }: ChatProps) {
  const [newMessage, setNewMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages)

  // Generate a unique client ID
  const clientIdRef = useRef<string>(uuidv4())

  useEffect(() => {
    // Connect to the broker when the component is mounted
    connectToBroker((msg: string) => {
      // Parse the incoming message
      const messageObject = JSON.parse(msg)

      // Check if the message already exists to prevent duplicates
      setChatMessages((prevMessages) => {
        if (prevMessages.some((m) => m.id === messageObject.id)) {
          // Message already exists
          return prevMessages
        } else {
          // Add new message
          const receivedMessage: ChatMessage = {
            id: messageObject.id,
            content: messageObject.content,
            senderId: messageObject.senderId,
            senderName: messageObject.senderName,
          }
          return [...prevMessages, receivedMessage]
        }
      })
    })
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !username) return

    // Create the message object with a unique ID and sender info
    const sentMessage: ChatMessage = {
      id: uuidv4(),
      content: newMessage,
      senderId: clientIdRef.current,
      senderName: username || 'You',
    }

    // Send the message to the broker
    sendMessage(JSON.stringify(sentMessage))

    // Add the new message to the chat immediately
    setChatMessages((prevMessages) => [...prevMessages, sentMessage])
    setNewMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && username) {
      e.preventDefault() // Prevent the default behavior (newline)
      handleSendMessage() // Send the message
    }
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
          placeholder={username ? "Type your message here." : "Log in to type a message."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow resize-none"
          disabled={!username} // Disable if not logged in
        />
        <TooltipProvider>
          <Tooltip content={username ? "" : "Log in to send a message"}>
            <div>
              <Button
                onClick={handleSendMessage}
                className="mt-2 w-full"
                disabled={!username} // Disable the button if not logged in
              >
                Send
              </Button>
            </div>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
