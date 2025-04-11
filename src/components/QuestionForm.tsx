
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
  const [initAttempts, setInitAttempts] = useState(0);

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

  // Initialize n8n chat
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let styleElement: HTMLStyleElement | null = null;
    let initInterval: number | null = null;
    
    const initChat = () => {
      console.log('Attempting to initialize n8n chat...');
      
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
          toast.success('Chat initialized successfully');
          
          // Clear the interval if initialization succeeds
          if (initInterval) {
            window.clearInterval(initInterval);
          }
        } catch (error) {
          console.error('Failed to initialize n8n chat:', error);
          setInitAttempts(prev => prev + 1);
          if (initAttempts > 5) {
            toast.error('Failed to initialize chat after multiple attempts');
            if (initInterval) {
              window.clearInterval(initInterval);
            }
          }
        }
      } else {
        console.warn('N8n chat not available yet, waiting...');
        setInitAttempts(prev => prev + 1);
      }
    };

    const loadScript = () => {
      scriptElement = document.createElement('script');
      scriptElement.src = 'https://cdn.n8n.io/chat/n8n-chat.umd.js';
      scriptElement.async = true;
      scriptElement.onload = () => {
        console.log('N8n chat script loaded successfully');
        // Try to initialize immediately after script loads
        initChat();
        
        // Also set up an interval to retry initialization a few times
        initInterval = window.setInterval(() => {
          if (!chatInitialized && initAttempts < 10) {
            initChat();
          } else {
            if (initInterval) {
              window.clearInterval(initInterval);
            }
          }
        }, 1000);
      };
      
      scriptElement.onerror = () => {
        console.error('Failed to load n8n chat script');
        toast.error('Failed to load chat script');
      };
      
      document.body.appendChild(scriptElement);

      // Add CSS to hide the default textarea
      styleElement = document.createElement('style');
      styleElement.textContent = `
        #n8n-chat textarea, #n8n-chat .n8n-chat-input-container {
          display: none !important;
        }
        #my-chat-container {
          width: 100%;
          height: 100%;
          min-height: 500px;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `;
      document.head.appendChild(styleElement);
    };

    loadScript();

    return () => {
      // Cleanup
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
      
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
      
      if (initInterval) {
        window.clearInterval(initInterval);
      }
    };
  }, [chatInitialized, initAttempts]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    console.log('Attempting to send message:', question);
    setIsLoading(true);
    
    // Use n8n chat to send message
    if (window.__n8nChat && chatInitialized) {
      try {
        console.log('Sending message via n8n chat');
        window.__n8nChat.sendMessage(question);
        
        // Process the question in our local context as well
        try {
          await addQuestion(question);
        } catch (error) {
          console.error('Failed to process question locally:', error);
        }
        
        setQuestion('');
      } catch (error) {
        console.error('Failed to send message via n8n chat:', error);
        toast.error('Failed to send message');
      }
    } else {
      console.error('N8n chat not initialized');
      toast.error('Chat not initialized yet');
      
      // Still try to process the question locally even if chat fails
      try {
        await addQuestion(question);
        setQuestion('');
      } catch (error) {
        console.error('Failed to process question locally:', error);
      }
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
            placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
            value={question}
            onChange={handleChange}
            className="flex-1 rounded-full"
            id="my-input"
          />
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading} 
            className="rounded-full"
            id="my-send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-1 text-xs text-muted-foreground text-center">
          {chatInitialized ? 
            "Ask any question about AI automation" : 
            "Initializing chat system..."}
        </div>
      </form>
      
      {/* Chat container will be initialized by n8n chat */}
      <div id="my-chat-container" className="w-full h-[500px] border rounded-lg p-4">
        {!chatInitialized && 
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-querify-blue" />
              <p className="text-muted-foreground">Initializing chat system...</p>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default QuestionForm;
