
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const AskPage = () => {
  const { user, resetQuestions } = useQuerify();
  
  const handleLogout = () => {
    resetQuestions();
    window.location.reload();
    toast.success("Logged out successfully");
  };

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
