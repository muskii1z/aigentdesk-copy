
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import RegistrationForm from '@/components/RegistrationForm';

const AskPage = () => {
  const { isRegistrationRequired, questionCount } = useQuerify();

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Ask Your AI Automation Questions</h1>
        <p className="text-muted-foreground mb-8">
          Get expert answers to help you implement AI automation effectively.
          {!isRegistrationRequired && (
            <span className="ml-1">
              You have asked <span className="font-semibold">{questionCount}</span> of 3 free questions.
            </span>
          )}
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
