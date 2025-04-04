
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import RegistrationForm from '@/components/RegistrationForm';

const AskPage = () => {
  const { isRegistrationRequired } = useQuerify();

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Ask Your AI Automation Questions</h1>
        <p className="text-muted-foreground mb-12 text-center">
          Get expert answers to help you implement AI automation effectively.
        </p>

        {isRegistrationRequired ? (
          <RegistrationForm />
        ) : (
          <QuestionForm />
        )}

        <div className="mt-12">
          <QuestionAnswer />
        </div>
      </div>
    </div>
  );
};

export default AskPage;
