
import React, { useState } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2 } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useSignUpModal } from '@/hooks/useSignUpModal';

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
    
    if (isRegistrationRequired) {
      openModal(); // Open sign-up modal if not registered
      return;
    }
    
    setIsLoading(true);
    await addQuestion(question);
    setQuestion('');
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-querify-blue" />
          </div>
        )}
        
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
        
        <div className="mt-1 text-xs text-muted-foreground text-center">
          {isRegistrationRequired ? 
            "Please sign up to ask questions" : 
            "Ask any question about AI automation"}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
