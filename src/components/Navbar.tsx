
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Menu, { IMenu } from '@/components/ui/menu';
import SignupCheckoutModal from '@/components/SignupCheckoutModal';
import SignUpModal from '@/components/SignUpModal';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

const menuItems: IMenu[] = [
  {
    id: 1,
    title: 'Home',
    url: '/',
    dropdown: false,
  },
  {
    id: 2,
    title: 'About',
    url: '/about',
    dropdown: false,
  },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useQuerify();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  const handleSignUp = () => {
    setIsSignupModalOpen(true);
  };

  const handleSignIn = () => {
    setIsSigninModalOpen(true);
  };

  const handleGoToApp = async () => {
    setIsCheckingSubscription(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setIsSigninModalOpen(true);
        return;
      }

      // Check subscription status
      const { data: subData, error: subError } = await supabase.functions.invoke('verify-subscription', {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (subError) {
        console.error('Subscription check error:', subError);
        toast.error('Error checking subscription status');
        return;
      }

      if (subData?.subscribed) {
        // User has subscription, go to ask page
        navigate('/ask');
      } else {
        // User exists but no subscription, create checkout
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('signup-checkout', {
          body: { email: user.email, password: 'existing-user' },
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });

        if (checkoutError) {
          console.error('Checkout error:', checkoutError);
          toast.error('Error creating checkout session');
          return;
        }

        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
        }
      }
    } catch (error) {
      console.error('Error in handleGoToApp:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/30">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center">
              <div className="font-bold text-xl md:text-2xl text-querify-blue">AIgentDesk</div>
            </Link>
            
            <div className="hidden md:inline-block font-medium text-querify-blue text-sm py-1 px-3 rounded-md bg-querify-blue/5 border border-querify-blue/10">
              Powered by AIgentic Bros
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <Menu list={menuItems} />
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <Button 
                className="bg-querify-blue hover:bg-blue-700 text-white"
                onClick={handleGoToApp}
                disabled={isCheckingSubscription}
              >
                {isCheckingSubscription ? 'Checking...' : 'Go to App'}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  className="border-querify-blue text-querify-blue hover:bg-querify-blue hover:text-white"
                  onClick={handleSignIn}
                >
                  Sign in
                </Button>
                <Button 
                  className="bg-querify-blue hover:bg-blue-700 text-white"
                  onClick={handleSignUp}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <SignupCheckoutModal 
        open={isSignupModalOpen} 
        onOpenChange={setIsSignupModalOpen} 
      />
      
      <SignUpModal 
        open={isSigninModalOpen} 
        onOpenChange={setIsSigninModalOpen}
        defaultView="sign-in"
      />
    </>
  );
};

export default Navbar;
