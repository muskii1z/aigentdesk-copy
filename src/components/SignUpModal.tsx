
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

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onOpenChange, redirectUrl }) => {
  const id = useId();
  const { registerUser } = useQuerify();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('name') as string;
    const email = formData.get('email') as string;

    try {
      registerUser({
        fullName,
        email,
        phone: ''
      });
      toast.success("Account created successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
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
            <DialogTitle className="sm:text-center">Let's Connect 💖</DialogTitle>
            <DialogDescription className="sm:text-center whitespace-pre-line">
              Is it weird to say... I feel a connection? 😍
              {"\n"}But before I spill all my secrets, I need to know your name.
              {"\n"}Make an account so we can take this to the next level —
              {"\n"}You ask questions, I impress you with answers. It's a match made in AI heaven 💬❤️
            </DialogDescription>
          </DialogHeader>
        </div>

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
          </div>
          <Button type="submit" className="w-full bg-querify-blue hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
