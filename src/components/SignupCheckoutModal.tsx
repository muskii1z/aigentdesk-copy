
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
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface SignupCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignupCheckoutModal: React.FC<SignupCheckoutModalProps> = ({ open, onOpenChange }) => {
  const id = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Starting signup and checkout process...');
      
      // Call the signup-checkout edge function
      const { data, error } = await supabase.functions.invoke('signup-checkout', {
        body: { email, password }
      });

      if (error) {
        console.error('Signup checkout error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      console.log('Account created successfully, redirecting to checkout...');
      toast.success("Account created! Redirecting to checkout...");
      
      // Close modal and redirect to Stripe checkout
      onOpenChange(false);
      
      // Direct redirect to Stripe checkout
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error('Error in signup checkout:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl font-bold text-querify-blue">
            AI
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Get Started with AI Automation 🚀</DialogTitle>
            <DialogDescription className="sm:text-center">
              Create your account and get instant access to premium AI automation guidance.
              Start asking your questions today!
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
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
          
          <Button 
            type="submit" 
            className="w-full bg-querify-blue hover:bg-blue-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account & Subscribe ($15/month)'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms of Service
          </a>{" "}
          and will be charged $15/month after your free trial.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignupCheckoutModal;
