
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Bot, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignUpModal from './SignUpModal';
import ReactMarkdown from 'react-markdown';

const STRIPE_LINK = 'https://buy.stripe.com/test_aEUcOWbTng0d8QodQQ';

const isPaid = () => typeof window !== 'undefined' && localStorage.getItem('ai_paid_signup') === 'yes';

const SIGNUP_STEPS = [
  "Pay with Stripe",
  "After payment, you'll be redirected to the sign-up form",
  "Sign up to get access"
];

const PaywallInstructions = () => (
  <div className="mb-4 w-full">
    <div className="text-2xl font-extrabold text-blue-800 mb-2 text-center">
      Full Access Required
    </div>
    <div className="text-lg font-semibold text-blue-700 mb-4 text-center">
      To view answers and create an account, please follow these steps:
    </div>
    <ol className="text-left space-y-3 w-full max-w-xs mx-auto mb-4">
      {SIGNUP_STEPS.map((step, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="text-blue-700 font-bold text-lg">{idx + 1}.</span>
          <span className="text-blue-900 text-base sm:text-lg font-medium">{step}</span>
        </li>
      ))}
    </ol>
  </div>
);

const QuestionAnswer: React.FC = () => {
  const { questions, user, isRegistrationRequired } = useQuerify();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  if (questions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          {isRegistrationRequired && !(user && isPaid()) ? (
            <div className="flex flex-col items-center space-y-4">
              <Lock className="h-10 w-10 text-blue-700" />
              <PaywallInstructions />
              <div className="flex justify-center w-full mb-0">
                <a
                  href={STRIPE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center"
                >
                  <Button className="bg-querify-blue hover:bg-blue-700 w-auto px-6 py-2 mb-2 text-lg font-bold">
                    Pay with Stripe
                  </Button>
                </a>
              </div>
              <span className="text-xs text-blue-700 text-center">
                After paying, you’ll be redirected to unlock registration.
              </span>
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
                <Lock className="h-10 w-10 text-blue-700" />
                <PaywallInstructions />
                <div className="flex justify-center w-full mb-0">
                  <a
                    href={STRIPE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex justify-center"
                  >
                    <Button className="bg-querify-blue hover:bg-blue-700 w-auto px-6 py-2 mb-2 text-lg font-bold">
                      Pay with Stripe
                    </Button>
                  </a>
                </div>
                <span className="text-xs text-blue-700 text-center">
                  After paying, you’ll be redirected to unlock registration.
                </span>
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
