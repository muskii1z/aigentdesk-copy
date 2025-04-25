
import React, { useState } from 'react';
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuerify } from '@/context/QuerifyContext';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import { Lock } from "lucide-react";

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
  defaultView?: 'sign-up' | 'sign-in';
}

const STRIPE_LINK = 'https://buy.stripe.com/fZe3cz3k76Xw2Xu5kk';

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onOpenChange, redirectUrl, defaultView = 'sign-up' }) => {
  const id = useId();
  const { registerUser } = useQuerify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignIn, setIsSignIn] = useState(defaultView === 'sign-in');
  const navigate = useNavigate();

  // Payment check for signup only
  const isPaid = typeof window !== "undefined" && localStorage.getItem('ai_paid_signup') === 'yes';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isPaid) {
      toast.error("You must pay for access before signing up.");
      setIsSubmitting(false);
      return;
    }

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

  // Ensures toggling always resets modal to correct state & prompt
  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl font-bold text-querify-blue">
            AI
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{isSignIn ? 'Welcome Back! 👋' : "Let's Connect 💖"}</DialogTitle>
            <DialogDescription className="sm:text-center whitespace-pre-line">
              {isSignIn 
                ? "Great to see you again! Let's continue our AI journey together."
                : "Is it weird to say... I feel a connection? 😍\nBut before I spill all my secrets, I need to know your name.\nMake an account so we can take this to the next level —\nYou ask questions, I impress you with answers. It's a match made in AI heaven 💬❤️"
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Centered paywall section always rendered for sign-up if not isPaid */}
        {!isPaid && !isSignIn && (
          <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-8 my-3 text-center">
            <Lock className="h-8 w-8 mb-2 text-blue-700" />
            <div className="text-lg font-semibold text-blue-800 mb-1">Full Access Required</div>
            <div className="text-blue-700 mb-3 text-sm">
              To create an account, please pay for full access.
            </div>
            <div className="flex justify-center w-full mb-2">
              <a
                href={STRIPE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center"
                onClick={() => setTimeout(() => localStorage.setItem('ai_paid_signup', 'yes'), 1500)}
              >
                <Button className="bg-querify-blue hover:bg-blue-700 px-6 py-2 w-auto mx-auto">
                  Pay with Stripe
                </Button>
              </a>
            </div>
            <div className="text-xs text-blue-700 text-center">
              After paying, come back here to finish creating your account.
            </div>
          </div>
        )}

        {/* For sign-in, show SignInForm.
            For sign-up AND paid, show the registration form.
            If user is not paid, just show the payment block above and no form. */}
        {isSignIn ? (
          <SignInForm onSuccess={() => onOpenChange(false)} redirectUrl={redirectUrl} />
        ) : (
          isPaid && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-name`}>Full name</Label>
                  <Input 
                    id={`${id}-name`} 
                    name="name"
                    placeholder="John Doe" 
                    type="text" 
                    required 
                    disabled={isSubmitting || !isPaid}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <Input 
                    id={`${id}-email`} 
                    name="email"
                    placeholder="john@example.com" 
                    type="email" 
                    required 
                    disabled={isSubmitting || !isPaid}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-password`}>Password</Label>
                  <Input 
                    id={`${id}-password`} 
                    name="password"
                    placeholder="••••••••" 
                    type="password" 
                    required 
                    minLength={6}
                    disabled={isSubmitting || !isPaid}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-querify-blue hover:bg-blue-700" disabled={isSubmitting || !isPaid}>
                {isSubmitting ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
          )
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            {/* toggles between sign-in and sign-up modes, always opening the same modal */}
            {isSignIn 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>

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
