
import React, { useState } from 'react';
import { useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuerify } from '@/context/QuerifyContext';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpPaywallSection from './signup/SignUpPaywallSection';
import SignUpFormSection from './signup/SignUpFormSection';

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
  defaultView?: 'sign-up' | 'sign-in';
  allowRegistration?: boolean; // NEW: allow full registration form
}

const STRIPE_LINK = 'https://buy.stripe.com/test_aEUcOWbTng0d8QodQQ';

const SignUpModal: React.FC<SignUpModalProps> = ({
  open,
  onOpenChange,
  redirectUrl,
  defaultView = 'sign-up',
  allowRegistration = false,
}) => {
  const id = useId();
  const { registerUser } = useQuerify();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // After payment (allowRegistration), lock into sign-up mode only
  const isSignInModeRestricted = allowRegistration;
  const [isSignIn, setIsSignIn] = useState(defaultView === 'sign-in' && !allowRegistration);

  const navigate = useNavigate();

  // Payment check for signup only
  const isPaid = (typeof window !== "undefined" && localStorage.getItem('ai_paid_signup') === 'yes') || allowRegistration;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // STRICT CLIENT PAYWALL ENFORCEMENT
    if (!isPaid) {
      toast.error("You must pay for access before signing up.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const fullName = formData.get('name') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        registerUser({
          fullName,
          email,
          phone: ''
        });

        toast.success("Account created successfully! You can now ask questions.");
        onOpenChange(false);

        if (redirectUrl) {
          navigate(redirectUrl);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    // Disallow toggle if post-payment sign up!
    if (!isSignInModeRestricted) setIsSignIn((prev) => !prev);
  };

  const onStripeClick = () => {
    setTimeout(() => localStorage.setItem('ai_paid_signup', 'yes'), 1500);
  };

  // Toggle should ONLY be available if allowRegistration is true (i.e. post-payment)
  const showToggle = allowRegistration;

  // Lock into proper view  
  const showSignInForm = isSignIn && !allowRegistration;
  const showPaywall = !isSignIn && !isPaid && !allowRegistration;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl font-bold text-querify-blue">AI</div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {showSignInForm
                ? 'Welcome Back! 👋'
                : "Let's Connect 💖"}
            </DialogTitle>
            <DialogDescription className="sm:text-center whitespace-pre-line">
              {showSignInForm
                ? "Great to see you again! Let's continue our AI journey together."
                : "Is it weird to say... I feel a connection? 😍\nBut before I spill all my secrets, I need to know your name.\nMake an account so we can take this to the next level —\nYou ask questions, I impress you with answers. It's a match made in AI heaven 💬❤️"
              }
            </DialogDescription>
          </DialogHeader>
        </div>
        {/* Show paywall if required */}
        {showPaywall && (
          <SignUpPaywallSection onStripeClick={onStripeClick} />
        )}
        {showSignInForm ? (
          <SignInForm onSuccess={() => onOpenChange(false)} redirectUrl={redirectUrl} />
        ) : (
          <SignUpFormSection
            id={id}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isPaid={isPaid}
            showFields={isPaid} // Pass prop to only show fields when paid AND allowed
          />
        )}
        {/* Only show sign-in/sign-up toggle if post-payment "allowRegistration" is true */}
        {showToggle && (
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        )}
        <p className="text-center text-xs text-muted-foreground">
          By using this service you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
