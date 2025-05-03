
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AskPage = () => {
  const { user, resetQuestions } = useQuerify();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user) {
      navigate('/');
      return;
    }
    
    // Check if user has paid access
    const checkAccess = async () => {
      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('paid, has_access')
          .eq('email', user.email)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking access:", error);
          toast.error("Failed to verify access. Please try again later.");
          setIsPaid(false);
        } else {
          setIsPaid(data?.paid || data?.has_access || false);
        }
      } catch (err) {
        console.error("Error:", err);
        setIsPaid(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [user, navigate]);
  
  const handleLogout = () => {
    resetQuestions();
    window.location.reload();
    toast.success("Logged out successfully");
  };

  // Show loading state while checking access
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-16 flex justify-center items-center min-h-[50vh]">
        <p>Verifying your access...</p>
      </div>
    );
  }
  
  // If user doesn't have paid access, show paywall
  if (!isPaid) {
    return (
      <div className="container max-w-screen-xl py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Access Required</h1>
          <p className="mb-6">You need to purchase access to view this content.</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-querify-blue hover:bg-blue-700"
            >
              Get Access
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-16">
      <div className="max-w-4xl mx-auto">
        {user && (
          <div className="flex justify-end mb-8">
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
