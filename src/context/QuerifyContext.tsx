
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

interface User {
  fullName: string;
  email: string;
  phone: string;
}

interface QuerifyContextType {
  questions: Question[];
  user: User | null;
  addQuestion: (question: string) => Promise<void>;
  registerUser: (user: User) => void;
  resetQuestions: () => void;
  isRegistrationRequired: boolean;
}

const QuerifyContext = createContext<QuerifyContextType | undefined>(undefined);

const mockAnswers = [
  "AI automation can help streamline your business processes by handling repetitive tasks, analyzing large datasets, and providing insights that would be time-consuming for humans to generate.",
  "When implementing AI automation, start with a clear goal, choose the right tools, ensure quality data, and continuously monitor and refine the system.",
  "Common challenges in AI automation include data quality issues, integration with existing systems, change management, and ensuring ethical AI use and compliance with regulations.",
  "To measure ROI on AI automation investments, track metrics like time saved, error reduction, increased productivity, customer satisfaction improvements, and direct cost savings.",
  "AI tools like ChatGPT can be integrated into your workflow through APIs, plugins for existing software, or dedicated solutions built for your specific needs."
];

export const QuerifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Set isRegistrationRequired to false so users can ask questions without registering
  const isRegistrationRequired = false;

  const getRandomAnswer = () => {
    const randomIndex = Math.floor(Math.random() * mockAnswers.length);
    return mockAnswers[randomIndex];
  };

  const addQuestion = async (question: string) => {
    // Remove registration check
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      question,
      answer: getRandomAnswer(),
      timestamp: new Date()
    };

    setQuestions(prev => [newQuestion, ...prev]);
  };

  const registerUser = (userData: User) => {
    setUser(userData);
    toast.success("Registration successful! You can now ask questions.");
  };

  const resetQuestions = () => {
    setQuestions([]);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <QuerifyContext.Provider
      value={{
        questions,
        user,
        addQuestion,
        registerUser,
        resetQuestions,
        isRegistrationRequired
      }}
    >
      {children}
    </QuerifyContext.Provider>
  );
};

export const useQuerify = () => {
  const context = useContext(QuerifyContext);
  if (context === undefined) {
    throw new Error('useQuerify must be used within a QuerifyProvider');
  }
  return context;
};
