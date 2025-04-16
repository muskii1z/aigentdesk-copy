
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Bot, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSignUpModal } from '@/hooks/useSignUpModal';

const QuestionAnswer: React.FC = () => {
  const { questions, user, isRegistrationRequired } = useQuerify();
  const { openModal } = useSignUpModal();

  const handleSignUpClick = () => {
    openModal();
  };

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
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700 mb-3 text-center">Sign up to see the response to your question</p>
                <Button 
                  onClick={handleSignUpClick} 
                  className="bg-querify-blue hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up now
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
    </div>
  );
};

export default QuestionAnswer;
