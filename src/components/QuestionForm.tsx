
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuerify } from '@/context/QuerifyContext';
import { Loader2 } from 'lucide-react';

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addQuestion, isRegistrationRequired } = useQuerify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isRegistrationRequired) return;
    
    setIsLoading(true);
    await addQuestion(question);
    setQuestion('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Ask your AI automation question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[120px]"
          disabled={isRegistrationRequired || isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-querify-blue hover:bg-querify-lightBlue"
        disabled={!question.trim() || isRegistrationRequired || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
          </>
        ) : (
          'Ask Question'
        )}
      </Button>
    </form>
  );
};

export default QuestionForm;
