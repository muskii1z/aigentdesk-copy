import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Bot, UserPlus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignUpModal from './SignUpModal';
import ReactMarkdown from 'react-markdown';

const STRIPE_LINK = 'https://buy.stripe.com/test_aEUcOWbTng0d8QodQQ';

const isPaid = () => typeof window !== 'undefined' && localStorage.getItem('ai_paid_signup') === 'yes';

const QuestionAnswer: React.FC = () => {
  const { questions, user, isRegistrationRequired } = useQuerify();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  if (questions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          {isRegistrationRequired && !(user && isPaid()) ? (
            <div className="flex flex-col items-center space-y-4">
              <Lock className="h-8 w-8 text-blue-700" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Full Access Required</h3>
                <p className="text-sm text-blue-600 mb-4">
                  To view answers, first pay and create your account.
                </p>
              </div>
              <div className="flex justify-center w-full mb-0">
                <a
                  href={STRIPE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center"
                >
                  <Button className="bg-querify-blue hover:bg-blue-700 w-auto px-6 py-2 mb-2">
                    Pay with Stripe
                  </Button>
                </a>
              </div>
              <Button 
                onClick={() => setShowSignUpModal(true)} 
                className="bg-green-600 hover:bg-green-700 w-full md:w-auto flex items-center gap-2"
                size="lg"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
              <span className="text-xs text-blue-700 text-center">Already paid? Just sign up or sign in to unlock!</span>
              <SignUpModal 
                open={showSignUpModal} 
                onOpenChange={setShowSignUpModal} 
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Ask your first question to see responses here</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Your Conversation
      </h2>
      
      {questions.map((item) => (
        <Card key={item.id} className="animate-fade-in">
          <CardHeader className="bg-secondary/30 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 p-2 rounded-full">
                <MessageCircle className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-md">{item.question}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            {!(user && isPaid()) ? (
              <div className="flex flex-col items-center p-6 bg-blue-50 rounded-md space-y-4">
                <Lock className="h-8 w-8 text-blue-700" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Full Access Required</h3>
                  <p className="text-sm text-blue-600 mb-4">
                    To see your answer, please pay and register.
                  </p>
                </div>
                <div className="flex justify-center w-full mb-0">
                  <a
                    href={STRIPE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center"
                  >
                    <Button className="bg-querify-blue hover:bg-blue-700 w-auto px-6 py-2 mb-2">
                      Pay with Stripe
                    </Button>
                  </a>
                </div>
                <Button 
                  onClick={() => setShowSignUpModal(true)} 
                  className="bg-green-600 hover:bg-green-700 w-full md:w-auto flex items-center gap-2"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Button>
                <span className="text-xs text-blue-700 text-center">Already paid? Just sign up or sign in to unlock!</span>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-purple-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-purple-700" />
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden break-words w-full">
                  <div className="overflow-auto">
                    <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <SignUpModal 
        open={showSignUpModal} 
        onOpenChange={setShowSignUpModal} 
      />
    </div>
  );
};

export default QuestionAnswer;
