
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuerify } from '@/context/QuerifyContext';
import { formatDistanceToNow } from 'date-fns';

const QuestionAnswer: React.FC = () => {
  const { questions } = useQuerify();

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your Questions</h2>
      
      {questions.map((item) => (
        <Card key={item.id} className="animate-fade-in">
          <CardHeader className="bg-secondary/30 py-4">
            <CardTitle className="text-md">{item.question}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </p>
          </CardHeader>
          <CardContent className="py-4">
            <p>{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionAnswer;
