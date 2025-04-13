
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageSquare } from "lucide-react";

interface EventChatProps {
  eventId: string;
  messages: ChatMessage[];
}

const EventChat = ({ eventId, messages }: EventChatProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { sendChatMessage } = useEvents();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      sendChatMessage(eventId, message);
      setMessage("");
    }
  };
  
  return (
    <>
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-board-purple hover:bg-board-purple-dark rounded-full w-14 h-14 p-0 shadow-xl"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-board-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </Button>
      ) : (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 flex flex-col shadow-xl rounded-xl overflow-hidden">
          <div className="bg-board-purple text-white p-3 flex justify-between items-center">
            <h3 className="font-semibold">Event Chat</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-board-purple-dark">
              ✕
            </Button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-slate-900">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>No messages yet</p>
                <p className="text-sm">Be the first to say hello!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.senderId === 'system' ? 'justify-center' : msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.senderId === 'system' ? (
                      <div className="bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-full px-3 py-1">
                        {msg.message}
                      </div>
                    ) : msg.senderId === user?.id ? (
                      <div className="max-w-[80%]">
                        <div className="bg-board-purple text-white px-3 py-2 rounded-xl rounded-tr-none">
                          {msg.message}
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex max-w-[80%]">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-board-green text-white">
                            {msg.senderNickname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="bg-white dark:bg-slate-800 shadow-sm px-3 py-2 rounded-xl rounded-tl-none">
                            <div className="text-xs text-board-purple font-medium mb-1">
                              {msg.senderNickname}
                            </div>
                            {msg.message}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex p-3 bg-white dark:bg-slate-800 border-t">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full mr-2"
              disabled={!user}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-board-purple hover:bg-board-purple-dark rounded-full"
              disabled={!message.trim() || !user}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
};

export default EventChat;
