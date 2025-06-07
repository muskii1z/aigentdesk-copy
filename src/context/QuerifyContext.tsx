
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface Question {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

interface QuerifyUser {
  fullName: string;
  email: string;
  phone: string;
}

interface QuerifyContextType {
  questions: Question[];
  user: QuerifyUser | null;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  addQuestion: (question: string, answer: string) => Promise<void>;
  registerUser: (user: QuerifyUser) => void;
  resetQuestions: () => void;
  checkSubscriptionStatus: () => Promise<void>;
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
  const [user, setUser] = useState<QuerifyUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Always require registration
  const isRegistrationRequired = true;

  const getRandomAnswer = () => {
    const randomIndex = Math.floor(Math.random() * mockAnswers.length);
    return mockAnswers[randomIndex];
  };

  const addQuestion = async (question: string, answer: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question,
      answer: answer || getRandomAnswer(),
      timestamp: new Date()
    };

    setQuestions(prev => [newQuestion, ...prev]);
  };

  const registerUser = (userData: QuerifyUser) => {
    setUser(userData);
    toast.success("Registration successful! You can now see all answers to your questions.");
  };

  const resetQuestions = () => {
    setQuestions([]);
    setUser(null);
    setIsAuthenticated(false);
    setIsSubscribed(false);
  };

  const checkSubscriptionStatus = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        setIsAuthenticated(false);
        setIsSubscribed(false);
        setUser(null);
        return;
      }

      setIsAuthenticated(true);
      
      // Set user info from session
      const authUser = session.session.user;
      if (authUser) {
        setUser({
          fullName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          phone: authUser.user_metadata?.phone || ''
        });
      }

      // Check subscription status
      const { data: subData, error: subError } = await supabase.functions.invoke('verify-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (!subError && subData) {
        setIsSubscribed(subData.subscribed || false);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Check auth state on mount and auth changes
  useEffect(() => {
    checkSubscriptionStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata?.phone || ''
        });
        
        // Check subscription status for authenticated users
        await checkSubscriptionStatus();
      } else {
        setIsAuthenticated(false);
        setIsSubscribed(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QuerifyContext.Provider
      value={{
        questions,
        user,
        isAuthenticated,
        isSubscribed,
        addQuestion,
        registerUser,
        resetQuestions,
        checkSubscriptionStatus,
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
