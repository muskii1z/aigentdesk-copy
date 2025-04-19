
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
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onOpenChange, redirectUrl }) => {
  const id = useId();
  const { registerUser } = useQuerify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();

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
            <DialogTitle className="sm:text-center">
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </DialogTitle>
            <DialogDescription className="sm:text-center whitespace-pre-line">
              {isSignIn 
                ? "Welcome back! Let's continue our AI journey together."
                : "Connect with us and unlock AI automation insights.\nCreate an account to get started!"
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
