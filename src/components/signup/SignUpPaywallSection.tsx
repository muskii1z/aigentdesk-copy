
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const STRIPE_LINK_BASE = 'https://buy.stripe.com/test_aEUcOWbTng0d8QodQQ';

const getSuccessUrl = () => `${window.location.origin}/payment-success`;

interface SignUpPaywallSectionProps {
  onStripeClick?: () => void;
}

const steps = [
  "Pay with Stripe",
  "After payment, you'll be redirected to the sign-up form",
  "Sign up to get access",
];

const SignUpPaywallSection: React.FC<SignUpPaywallSectionProps> = ({ onStripeClick }) => {
  const stripeLink = STRIPE_LINK_BASE + `?success_url=${encodeURIComponent(getSuccessUrl())}`;
  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-8 my-3 text-center">
      <Lock className="h-10 w-10 mb-2 text-blue-700" />
      <div className="text-2xl font-extrabold text-blue-800 mb-2">
        Full Access Required
      </div>
      <div className="text-blue-700 mb-6 text-lg font-semibold">
        To create an account, please follow these steps:
      </div>
      <ol className="text-left space-y-3 w-full max-w-xs mb-6">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-700 font-bold text-lg">{i + 1}.</span>
            <span className="text-blue-900 text-base sm:text-lg font-medium">{step}</span>
          </li>
        ))}
      </ol>
      <div className="flex justify-center w-full mb-3">
        <a
          href={stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center"
          onClick={onStripeClick}
        >
          <Button className="bg-querify-blue hover:bg-blue-700 px-6 py-2 w-auto mx-auto text-lg font-bold" type="button">
            Pay with Stripe
          </Button>
        </a>
      </div>
      <div className="text-xs text-blue-700 text-center">
        After paying, you’ll be auto-redirected to unlock registration.
      </div>
    </div>
  );
};

export default SignUpPaywallSection;
