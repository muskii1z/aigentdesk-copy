
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white hero-pattern">
      <div className="container max-w-screen-xl py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-querify-blue">Ask Your AI Automation Questions</h1>
            
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
          
          <p className="text-muted-foreground mb-12 text-center">
            Get expert answers to help you implement AI automation effectively.
          </p>

          <QuestionForm />

          <div className="mt-12">
            <QuestionAnswer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
