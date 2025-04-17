
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Bot, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignUpModal from './SignUpModal';

const QuestionAnswer: React.FC = () => {
  const { questions, user, isRegistrationRequired } = useQuerify();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  if (questions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Ask your first question to see responses here</p>
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
            {isRegistrationRequired && !user ? (
              <div className="flex flex-col items-center p-6 bg-blue-50 rounded-md space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Sign up to view your answer</h3>
                  <p className="text-sm text-blue-600 mb-4">
                    Create a free account to see the answers to your questions.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowSignUpModal(true)} 
                  className="bg-querify-blue hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Button>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-purple-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-purple-700" />
                </div>
                <p>{item.answer}</p>
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
