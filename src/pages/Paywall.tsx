
import React, { useState } from 'react';
import SignUpModal from '@/components/SignUpModal';

const STRIPE_LINK = 'https://buy.stripe.com/fZe3cz3k76Xw2Xu5kk';

const Paywall: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  // After payment, set localStorage so site knows they've paid
  const handleContinue = () => {
    localStorage.setItem('ai_paid_signup', 'yes');
    setShowSignUp(true);
  };

  if (showSignUp) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <SignUpModal open={true} onOpenChange={() => {}} redirectUrl="/" defaultView="sign-up" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-lg rounded-xl p-10 shadow-xl bg-white border border-blue-100 space-y-8 flex flex-col items-center">
        <div className="text-3xl font-bold text-querify-blue text-center">
          Get Full Access
        </div>
        <p className="text-lg text-gray-800 text-center">
          To register and ask questions, you must first purchase access.
        </p>
        <a
          href={STRIPE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button className="w-full py-3 px-8 bg-querify-blue text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-xl">
            Pay with Stripe
          </button>
        </a>
        <p className="text-gray-600 text-center">
          After completing payment, return to this page and click below to unlock sign up:
        </p>
        <button
          className="w-full py-2 px-6 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors"
          onClick={handleContinue}
        >
          Continue to Sign Up
        </button>
      </div>
    </div>
  );
};

export default Paywall;
