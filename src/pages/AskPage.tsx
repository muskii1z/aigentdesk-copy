
import React from 'react';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import SignUpModal from '@/components/SignUpModal';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const AskPage = () => {
  const { isRegistrationRequired, user, resetQuestions } = useQuerify();
  const { isOpen, closeModal, openModal } = useSignUpModal();
  
  const handleLogout = () => {
    // Clear user data in context
    resetQuestions();
    // Force page reload to reset all states
    window.location.reload();
    toast.success("Logged out successfully");
  };

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center">Ask Your AI Automation Questions</h1>
          
          {!isRegistrationRequired && (
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
          {isRegistrationRequired ? (
            <div className="p-6 border border-blue-100 rounded-lg bg-blue-50 text-center">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Sign up to see your responses</h3>
              <p className="text-blue-700 mb-4">Create an account to ask questions and see AI responses</p>
              <Button 
                onClick={() => openModal('/ask')}
                className="bg-querify-blue hover:bg-blue-700"
              >
                Sign Up Now
              </Button>
            </div>
          ) : (
            <div id="my-chat-container" className="w-full h-[500px] border rounded-lg"></div>
          )}
        </div>

        <SignUpModal 
          open={isOpen} 
          onOpenChange={(open) => {
            // If user is registered, allow closing the modal
            if (!open && !isRegistrationRequired) {
              closeModal();
            }
          }} 
        />
      </div>
    </div>
  );
};

export default AskPage;
