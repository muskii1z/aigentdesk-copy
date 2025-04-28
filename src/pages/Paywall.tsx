import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from "@/integrations/supabase/client";

const Paywall: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useQuerify();

  const handlePaymentClick = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { user_id: user?.id },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-lg w-full rounded-xl p-10 shadow-xl bg-white border border-blue-100 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-querify-blue">
            Get Full Access to AI Chat
          </h1>
          <p className="text-lg text-gray-600">
            Unlock unlimited AI-powered conversations and get expert answers to all your questions.
          </p>
          <div className="pt-4">
            <div className="text-4xl font-bold text-querify-blue">$29.99</div>
            <div className="text-gray-500">One-time payment</div>
          </div>
        </div>

        <div className="space-y-4">
          <ul className="space-y-3">
            {[
              'Unlimited AI chat access',
              'Expert answers to your questions',
              'Priority support',
              'Access to all future features',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={handlePaymentClick}
          disabled={isLoading}
          className="w-full py-6 text-lg font-semibold bg-querify-blue hover:bg-blue-700"
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>Pay Now & Get Access</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Paywall;
