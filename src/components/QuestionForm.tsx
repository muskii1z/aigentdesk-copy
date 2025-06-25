import React, { useState } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSignUpModal } from '@/hooks/useSignUpModal';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addQuestion, user } = useQuerify();
  const { openModal } = useSignUpModal();

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
      const webhookUrl = 'https://digitalvaultsolutions.app.n8n.cloud/webhook/c3abe09f-5c95-4711-9b74-da4bd64f722a/chat';
      console.log(`Sending question to webhook: ${webhookUrl}`);
      
      // Debug logging for user object
      console.log('User object:', user);
      console.log('User email:', user?.email);
      
      // Create sessionId with multiple fallbacks and debugging
      let sessionId = user?.email || `user_${Date.now()}` || 'anonymous';
      console.log('Generated sessionId:', sessionId);
      
      // Create the payload
      const payload = { 
        question: questionText,
        timestamp: new Date().toISOString(),
        sessionId: sessionId 
      };
      
      // Debug logging for the complete payload
      console.log('Complete payload being sent:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
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
    
    if (!question.trim()) return;
    
    // Check if user is logged in
    if (!user) {
      // If not logged in, open the sign-up modal
      openModal('/ask');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send to webhook and wait for response
      const webhookResponse = await sendToWebhook(question);
      
      // Add question and the webhook response to the context
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
            placeholder={placeholders[0]}
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
