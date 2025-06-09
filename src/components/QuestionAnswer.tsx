
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QuestionAnswer: React.FC = () => {
  const { questions, user, isRegistrationRequired } = useQuerify();

  if (questions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Ask your first question to see responses here</p>
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
                  <p className="text-sm text-blue-600">
                    Please sign in using the navigation bar to view your answers.
                  </p>
                </div>
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
    </div>
  );
};

export default QuestionAnswer;
