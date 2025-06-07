
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  currentContent?: any;
  currentTime?: number;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const AIChatAssistant = ({ 
  currentContent, 
  currentTime = 0, 
  isMinimized = false,
  onToggleMinimize 
}: AIChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you discuss the content you're listening to, answer questions, or provide insights. What would you like to talk about?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      // Mock AI response for now
      const context = currentContent ? {
        title: currentContent.title,
        author: currentContent.author,
        currentTime: Math.floor(currentTime / 60) // minutes
      } : null;

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock AI responses based on context
      const responses = [
        `That's an interesting point about "${currentContent?.title || 'the content'}". ${context ? `At ${context.currentTime} minutes in, ` : ''}the author seems to be emphasizing the importance of...`,
        "I can help clarify that concept. From what I understand, the main idea is...",
        "Great question! This relates to what was discussed earlier about...",
        `Based on the content by ${currentContent?.author || 'the author'}, I think they would say...`,
        "That's a thoughtful observation. It connects to the broader theme of..."
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    },
    onSuccess: (aiResponse) => {
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      toast.error("Failed to get AI response");
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 huly-glass border-white/10 z-50">
        <CardHeader className="pb-2 cursor-pointer" onClick={onToggleMinimize}>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
            <Badge variant="secondary" className="ml-auto">
              {messages.length - 1}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 huly-glass border-white/10 z-50 flex flex-col">
      <CardHeader className="pb-2 cursor-pointer" onClick={onToggleMinimize}>
        <CardTitle className="text-sm flex items-center gap-2 huly-gradient-text">
          <Bot className="h-4 w-4" />
          AI Chat Assistant
          {currentContent && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {currentContent.title}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'huly-gradient text-white'
                  }`}>
                    {message.role === 'user' ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-lg p-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'huly-glass border-white/10 text-foreground'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full huly-gradient text-white flex items-center justify-center">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                </div>
                <div className="huly-glass border-white/10 text-foreground rounded-lg p-2 text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the content..."
            className="huly-glass border-white/20 text-foreground"
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessage.isPending}
            className="huly-gradient text-white border-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatAssistant;
