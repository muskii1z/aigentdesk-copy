
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuerify } from "@/context/QuerifyContext"; // Fixed import path
import Check from "@/assets/icons/Check";
import Button from "@/components/Button";
import { supabase } from "@/integrations/supabase/client"; // Added missing import

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const { user } = useQuerify();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!user) return;

      try {
        // Make sure user.id exists before using it
        if (user.id) {
          const { error } = await supabase
            .from('subscribers')
            .upsert({
              user_id: user.id,
              email: user.email,
              paid: true,
              payment_date: new Date().toISOString(),
            });

          if (error) throw error;
        }
        
        toast.success('Payment processed successfully!');
        setTimeout(() => {
          navigate('/ask');
        }, 2000);
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Failed to process payment confirmation');
      } finally {
        setIsProcessing(false);
      }
    };

    updatePaymentStatus();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-lg rounded-xl p-10 shadow-xl bg-white border border-blue-100 space-y-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600">
          {isProcessing ? 
            "We're processing your payment and setting up your access..." :
            "Your payment has been processed and you now have full access to AI Chat!"}
        </p>
        <Button 
          onClick={() => navigate('/ask')}
          className="bg-querify-blue hover:bg-blue-700"
        >
          Start Chatting
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
