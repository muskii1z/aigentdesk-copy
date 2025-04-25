import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const STRIPE_LINK_BASE = 'https://buy.stripe.com/test_aEUcOWbTng0d8QodQQ';

const getSuccessUrl = () => `${window.location.origin}/payment-success`;

interface SignUpPaywallSectionProps {
  onStripeClick?: () => void;
}

const SignUpPaywallSection: React.FC<SignUpPaywallSectionProps> = ({ onStripeClick }) => {
  const stripeLink = STRIPE_LINK_BASE + `?success_url=${encodeURIComponent(getSuccessUrl())}`;
  return (
    <div className="flex flex-col items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-8 my-3 text-center">
      <Lock className="h-8 w-8 mb-2 text-blue-700" />
      <div className="text-lg font-semibold text-blue-800 mb-1">Full Access Required</div>
      <div className="text-blue-700 mb-3 text-sm">
        To create an account, please pay for full access.
      </div>
      <div className="flex justify-center w-full mb-2">
        <a
          href={stripeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex justify-center"
          onClick={onStripeClick}
        >
          <Button className="bg-querify-blue hover:bg-blue-700 px-6 py-2 w-auto mx-auto" type="button">
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
