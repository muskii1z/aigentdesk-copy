
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';

const AskPage = () => {
  const { resetQuestions } = useQuerify();

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-center">Ask Your AI Automation Questions</h1>
        </div>
        
        <p className="text-muted-foreground mb-12 text-center">
          Get expert answers to help you implement AI automation effectively.
        </p>

        <QuestionForm />
      </div>
    </div>
  );
};

export default AskPage;
