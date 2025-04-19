
import React from 'react';
import { useQuerify } from '@/context/QuerifyContext';
import QuestionForm from '@/components/QuestionForm';
import QuestionAnswer from '@/components/QuestionAnswer';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';

const AskPage = () => {
  const { user, resetQuestions } = useQuerify();
  
  const handleLogout = () => {
    resetQuestions();
    window.location.reload();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <div className="container max-w-screen-xl py-4">
          <div className="flex justify-end">
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
        </div>
      )}

      <HeroWithMockup
        title="Ask Your AI Automation Questions"
        description="Get expert answers to help you implement AI automation effectively"
        primaryCta={{
          text: "Ask a Question",
          href: "#ask-form"
        }}
        mockupImage={{
          src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80",
          alt: "AI Automation Interface",
          width: 2000,
          height: 1333
        }}
      />

      <div className="container max-w-4xl mx-auto pb-16" id="ask-form">
        <div className="space-y-16">
          <QuestionForm />
          <QuestionAnswer />
        </div>
      </div>
    </div>
  );
};

export default AskPage;
