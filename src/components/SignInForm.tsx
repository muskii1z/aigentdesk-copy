
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuerify } from '@/context/QuerifyContext';
import { toast } from 'sonner';

interface SignInFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess, redirectUrl }) => {
  const id = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { registerUser, checkSubscriptionStatus } = useQuerify();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Register user in context after successful signin
        registerUser({
          fullName: data.user.user_metadata.full_name || '',
          email: data.user.email || '',
          phone: ''
        });
        
        // Check subscription status after sign in
        await checkSubscriptionStatus();
        
        // Verify subscription status before allowing access
        const { data: subData, error: subError } = await supabase.functions.invoke('verify-subscription', {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
        });

        if (!subError && subData?.subscribed) {
          toast.success("Signed in successfully!");
          onSuccess?.();
          
          if (redirectUrl) {
            navigate(redirectUrl);
          }
        } else {
          // User is authenticated but doesn't have an active subscription
          toast.error("Your subscription has expired or payment is incomplete. Please complete your subscription to continue.");
          
          // Sign out the user since they don't have a valid subscription
          await supabase.auth.signOut();
          
          // You could redirect to a payment completion page here
          // For now, we'll just prevent access
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-querify-blue hover:bg-blue-700" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default SignInForm;
