
import React from 'react';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import SignUpModal from '@/components/SignUpModal';

const AskPage = () => {
  const { isRegistrationRequired } = useQuerify();
  const { isOpen, openModal, closeModal } = useSignUpModal();
  
  // We'll no longer auto-open the modal on page load
  // The modal will only appear when the user tries to submit a question

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Ask Your AI Automation Questions</h1>
        <p className="text-muted-foreground mb-12 text-center">
          Get expert answers to help you implement AI automation effectively.
        </p>

        <QuestionForm />

        <div className="mt-12">
          <QuestionAnswer />
        </div>

        <SignUpModal 
          open={isOpen} 
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            }
          }} 
        />
      </div>
    </div>
  );
};

export default AskPage;
