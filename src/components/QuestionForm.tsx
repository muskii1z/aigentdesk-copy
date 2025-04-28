
import React, { useState } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import { supabase } from '@/integrations/supabase/client'; // Fixed import path
import { useNavigate } from 'react-router-dom';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addQuestion, user } = useQuerify();
  const { openModal } = useSignUpModal();
  const navigate = useNavigate();

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

  const sendToWebhook = async (questionText: string) => {
    try {
      const webhookUrl = 'http://localhost:5678/webhook/6735c7d2-1412-44aa-8312-b5e5d8bc3f83';
      console.log(`Sending question to webhook: ${webhookUrl}`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: questionText,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook request failed with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      
      // Extract only the output field from the response
      if (responseData && responseData.output) {
        return responseData.output;
      } else {
        console.warn('Response did not contain an output field:', responseData);
        return "The webhook didn't return an expected output format.";
      }
    } catch (error) {
      console.error('Error sending to webhook:', error);
      toast.error('Failed to send question to webhook');
      return "Error: Failed to get a response from the webhook.";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      openModal('/ask');
      return;
    }

    try {
      // Only attempt to check subscription status if user exists
      if (user.id) {
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('paid')
          .eq('user_id', user.id)
          .single();

        if (!subscriber?.paid) {
          navigate('/paywall');
          return;
        }
      } else {
        // Handle case where user exists but has no ID
        navigate('/paywall');
        return;
      }
      
      setIsLoading(true);
      
      const webhookResponse = await sendToWebhook(question);
      
      await addQuestion(question, webhookResponse);
      toast.success('Question sent successfully!');
      setQuestion('');
    } catch (error) {
      console.error('Error processing question:', error);
      toast.error('Failed to process your question');
    } finally {
      setIsLoading(false);
    }
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
            placeholder={placeholders ? placeholders[0] : "Ask a question about AI automation"}
            value={question}
            onChange={handleChange}
            className="flex-1 rounded-full"
          />
          <Button 
            type="submit" 
            disabled={!question.trim() || isLoading} 
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-1 text-xs text-muted-foreground text-center">
          Ask any question about AI automation
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
