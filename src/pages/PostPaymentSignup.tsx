import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import SignUpModal from '@/components/SignUpModal';
import { Button } from '@/components/ui/button';
import { useQuerify } from '@/context/QuerifyContext';

const PostPaymentSignup = () => {
  const { openModal, isOpen, setIsOpen } = useSignUpModal();
  const navigate = useNavigate();
  const { user } = useQuerify();

  // If user is already logged in, redirect to the ask page
  useEffect(() => {
    if (user) {
      navigate('/ask');
    } else {
      // Otherwise, open the signup modal
      openModal('/ask');
    }
  }, [user, navigate, openModal]);

  const handleModalClose = () => {
    // If they close the modal without signing up, we still want to
    // give them a way to reopen it
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-querify-blue">Thank You For Your Purchase!</h1>
        <p className="text-lg text-slate-700">
          You're just one step away from accessing AIgentDesk.
        </p>
        <p className="text-slate-600">
          Create your account to get started. If you closed the signup window, 
          you can reopen it using the button below.
        </p>
        
        {!isOpen && (
          <Button 
            onClick={() => openModal('/ask')}
            className="mt-4 bg-querify-blue hover:bg-blue-700 text-white"
          >
            Create Account
          </Button>
        )}
        
        <SignUpModal
          open={isOpen}
          onOpenChange={handleModalClose}
          defaultView="sign-up"
          redirectUrl="/ask"
          allowRegistration={true}
        />
      </div>
    </div>
  );
};

export default PostPaymentSignup;
