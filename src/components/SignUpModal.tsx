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

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
  defaultView?: 'sign-up' | 'sign-in';
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onOpenChange, redirectUrl, defaultView = 'sign-up' }) => {
  const id = useId();
  const { registerUser } = useQuerify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignIn, setIsSignIn] = useState(defaultView === 'sign-in');
  const navigate = useNavigate();

  // Restrict access if not paid
  if (typeof window !== 'undefined') {
    const paid = localStorage.getItem('ai_paid_signup');
    if (paid !== 'yes') {
      // Optionally close modal if open, and inform user
      if (open && typeof onOpenChange === "function") {
        onOpenChange(false);
      }
      return (
        <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm">
            <div className="text-xl font-bold text-querify-blue mb-2">Payment Required</div>
            <p className="text-gray-700 mb-4">
              You must complete payment before creating an account.
            </p>
            <a
              href="/paywall"
              className="px-4 py-2 rounded bg-querify-blue text-white hover:bg-blue-700 transition"
            >
              Go to Paywall
            </a>
          </div>
        </div>
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

        {isSignIn ? (
          <SignInForm onSuccess={() => onOpenChange(false)} redirectUrl={redirectUrl} />
        ) : (
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-querify-blue hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>
        )}

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
