
import React, { useState } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2, Send } from 'lucide-react';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addQuestion, isRegistrationRequired } = useQuerify();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // If registration is required, open the modal when they try to submit
    if (isRegistrationRequired) {
      openModal('/ask');
      return;
    }
    
    // Process the question if user is already registered
    setIsLoading(true);
    await addQuestion(question);
    setQuestion('');
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
          />
          <Button 
            type="submit" 
            disabled={!question.trim()} 
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
