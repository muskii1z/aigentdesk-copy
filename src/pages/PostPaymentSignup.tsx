
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import SignUpModal from '@/components/SignUpModal';
import { Button } from '@/components/ui/button';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PostPaymentSignup = () => {
  const { openModal, isOpen, setIsOpen } = useSignUpModal();
  const navigate = useNavigate();
  const { user } = useQuerify();
  const [isResendingInvite, setIsResendingInvite] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get the email from URL parameter if available
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

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

  const handleResendInvite = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResendingInvite(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email
      });

      if (error) {
        toast.error(`Failed to send login link: ${error.message}`);
      } else {
        toast.success("Magic link sent! Please check your email");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error sending magic link:", error);
    } finally {
      setIsResendingInvite(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-querify-blue">Thank You For Your Purchase!</h1>
        <p className="text-lg text-slate-700">
          Your account has been created!
        </p>
        <p className="text-slate-600">
          Please check your email for a magic link to set your password and access AIgentDesk.
        </p>
        
        <div className="p-6 bg-white rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Didn't receive an email?</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                Your Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              onClick={handleResendInvite}
              disabled={isResendingInvite || !email}
              className="w-full bg-querify-blue hover:bg-blue-700 text-white"
            >
              {isResendingInvite ? 'Sending...' : 'Resend Magic Link'}
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>If you continue to have issues, please contact support.</p>
          </div>
        </div>
        
        {!isOpen && (
          <Button 
            onClick={() => openModal('/ask')}
            className="mt-4 bg-querify-blue hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        )}
        
        <SignUpModal
          open={isOpen}
          onOpenChange={handleModalClose}
          defaultView="sign-in"
          redirectUrl="/ask"
          allowRegistration={true}
        />
      </div>
    </div>
  );
};

export default PostPaymentSignup;
