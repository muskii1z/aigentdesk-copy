
import React, { useEffect, useState } from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from 'react-router-dom';

const AskPage = () => {
  const { user, resetQuestions, checkSubscriptionStatus, isAuthenticated, isSubscribed } = useQuerify();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetQuestions();
    toast.success("Logged out successfully");
  };

  // Handle successful payment redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Verify the payment session
      const verifyPayment = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-session', {
            body: { sessionId }
          });

          if (error) {
            console.error('Session verification error:', error);
            toast.error('Failed to verify payment. Please contact support.');
            return;
          }

          if (data?.verified) {
            toast.success('Payment successful! Welcome to AIgentDesk! 🎉');
            // Check subscription status to update the UI
            await checkSubscriptionStatus();
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          toast.error('Failed to verify payment. Please contact support.');
        }
      };

      verifyPayment();
    }
  }, [searchParams, checkSubscriptionStatus]);

  // Protect the page - redirect if not authenticated or not subscribed
  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        toast.error("Please sign up to access AIgentDesk");
        navigate('/');
        return;
      }

      if (!isSubscribed) {
        toast.error("Please complete your subscription to access AIgentDesk");
        navigate('/');
        return;
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [isAuthenticated, isSubscribed, navigate]);

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-16">
      <div className="max-w-4xl mx-auto">
        {user && (
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm text-slate-600">
              Welcome back, {user.fullName}!
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}

        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ask Your AI Automation Questions
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Get expert answers to help you implement AI automation effectively.
          </p>
        </div>

        <div className="space-y-16">
          <QuestionForm />
          <QuestionAnswer />
        </div>
      </div>
    </div>
  );
};

export default AskPage;
