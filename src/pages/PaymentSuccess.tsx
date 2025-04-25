
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignUpModal from "@/components/SignUpModal";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(true); // Modal opens after payment

  useEffect(() => {
    // Set the flag in localStorage so user can sign up
    localStorage.setItem("ai_paid_signup", "yes");
    toast.success("Payment successful! You can now register an account.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white border border-blue-100 rounded-xl shadow-xl max-w-lg p-8 flex flex-col items-center space-y-6">
        <div className="text-3xl font-bold text-green-600 text-center">Payment Successful 🎉</div>
        <p className="text-md text-gray-700 text-center">
          Thank you for your payment! Registration is now unlocked.<br />
        </p>
        <div className="w-full flex flex-col items-center gap-2">
          <span className="text-base text-blue-800 font-semibold">Ready to get started?</span>
          <span className="text-sm text-blue-700">The registration form will appear shortly.</span>
        </div>
        <button
          className="text-blue-700 underline text-sm"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
      {/* Pass allowRegistration to unlock form fields after payment */}
      <SignUpModal open={show} onOpenChange={setShow} defaultView="sign-up" redirectUrl="/" allowRegistration />
    </div>
  );
};

export default PaymentSuccess;
