
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { AuroraBackground } from '@/components/ui/aurora-background';

const AskPage = () => {
  const { user, resetQuestions } = useQuerify();
  
  const handleLogout = () => {
    resetQuestions();
    window.location.reload();
    toast.success("Logged out successfully");
  };

  return (
    <AuroraBackground className="min-h-screen h-auto py-0">
      <div className="container max-w-screen-xl py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Ask Your AI Automation Questions
            </h1>
            
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 mb-12 text-center">
            Get expert answers to help you implement AI automation effectively.
          </p>

          <QuestionForm />

          <div className="mt-12">
            <QuestionAnswer />
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default AskPage;
