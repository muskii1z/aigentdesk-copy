import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useQuerify } from '@/context/QuerifyContext';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import SignUpForm, { SignUpFormValues } from './signup/SignUpForm';
import SignUpHeader from './signup/SignUpHeader';
import SignUpInfo from './signup/SignUpInfo';

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onOpenChange, redirectUrl = '/ask' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useQuerify();
  const { closeModal } = useSignUpModal();

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Log the values for debugging
      console.log('Sign up form values:', values);
      
      // Register the user with first and last name combined
      registerUser({
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: '' // Default empty phone since we're not collecting it
      });
      
      // Show success message
      toast.success('Account created successfully!');
      
      // Close modal
      closeModal();
      
      // No need to navigate since we want to keep the user on the chat page
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton>
        <SignUpHeader />
        <SignUpInfo />
        <SignUpForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
