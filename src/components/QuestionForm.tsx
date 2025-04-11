
import React, { useState, useEffect } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addQuestion } = useQuerify();
  const [chatInitialized, setChatInitialized] = useState(false);

  const placeholders = [
    "How can AI automation streamline my business operations?",
    "What are the first steps to implementing AI in my workflow?",
    "How do I measure ROI on my AI investments?",
    "Can AI help with customer service automation?",
    "What AI tools are best for small business marketing?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  useEffect(() => {
    // Initialize n8n chat when component mounts
    const initChat = () => {
      if (window.__n8nChat) {
        try {
          window.__n8nChat.init({
            chatId: 'n8n-chat',
            webhookUrl: 'http://localhost:5678/webhook/a9ea4cf7-903c-49e2-8b2a-9ad81cfa2b36/chat',
            showWelcomeScreen: false,
            mode: 'fullscreen',
            container: document.getElementById('my-chat-container'),
          });
          console.log('N8n chat initialized successfully');
          setChatInitialized(true);
        } catch (error) {
          console.error('Failed to initialize n8n chat:', error);
          toast.error('Failed to initialize chat');
        }
      } else {
        console.warn('N8n chat not available yet');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.n8n.io/chat/n8n-chat.umd.js';
    script.async = true;
    script.onload = () => {
      console.log('N8n chat script loaded');
      initChat();
    };
    document.body.appendChild(script);

    // Add CSS to hide the default textarea
    const style = document.createElement('style');
    style.textContent = `
      #n8n-chat textarea, #n8n-chat .n8n-chat-input-container {
        display: none !important;
      }
      #my-chat-container {
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    console.log('Attempting to send message:', question);
    
    // Use n8n chat to send message
    if (window.__n8nChat) {
      try {
        console.log('Sending message via n8n chat');
        window.__n8nChat.sendMessage(question);
        toast.success('Message sent');
        setQuestion('');
      } catch (error) {
        console.error('Failed to send message via n8n chat:', error);
        toast.error('Failed to send message');
      }
    } else {
      console.error('N8n chat not initialized');
      toast.error('Chat not initialized yet');
    }
    
    // Process the question in our local context
    setIsLoading(true);
    try {
      await addQuestion(question);
      setQuestion('');
    } catch (error) {
      console.error('Failed to process question locally:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-querify-blue" />
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={placeholders[0]}
            value={question}
            onChange={handleChange}
            className="flex-1 rounded-full"
            id="my-input"
          />
          <Button 
            type="submit" 
            disabled={!question.trim()} 
            className="rounded-full"
            id="my-send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-1 text-xs text-muted-foreground text-center">
          Ask any question about AI automation
        </div>
      </form>
      
      {/* Chat container will be initialized by n8n chat */}
      <div id="my-chat-container" className="w-full h-[500px] border rounded-lg"></div>
    </div>
  );
};

export default QuestionForm;
