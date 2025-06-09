
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import { useNavigate } from 'react-router-dom';
import SignupCheckoutModal from '@/components/SignupCheckoutModal';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useQuerify();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  const handleSignUp = async () => {
    // If no user is authenticated, open signup modal
    if (!user) {
      setIsSignupModalOpen(true);
      return;
    }

    // If user exists, check their subscription status
    setIsCheckingSubscription(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setIsSignupModalOpen(true);
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
      console.error('Error in handleSignUp:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const getButtonText = () => {
    if (isCheckingSubscription) return 'Checking...';
    if (user) return 'Continue to App';
    return 'Sign up';
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <HeroWithMockup
          title="Answer Your AI Automation Questions"
          description="AIgentDesk provides expert answers to all your AI automation questions, helping you implement intelligent solutions."
          primaryCta={{
            text: getButtonText(),
            href: "#",
            onClick: handleSignUp,
          }}
          secondaryCta={{
            text: "Learn More",
            href: "/about",
          }}
          mockupImage={{
            alt: "AIgentDesk interface",
            width: 1248,
            height: 765,
            src: "/lovable-uploads/f9322daa-f54e-4447-b957-403257ba769d.png"
          }}
          className="bg-gradient-to-br from-blue-50 to-white hero-pattern"
          renderCustomContent={() => (
            <div className="w-full pt-12 px-4 sm:px-6 lg:px-8 flex justify-center">
              <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] border border-querify-blue/10 bg-black animate-appear opacity-0 [animation-delay:700ms]">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/UX-R-PkjE84?rel=0&modestbranding=1&controls=1&showinfo=0"
                  title="AIgentDesk Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        />

        <section className="py-16 bg-blue-50/30">
          <div className="container max-w-screen-xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-querify-blue">Ready to Automate with AI?</h2>
            <p className="text-lg text-querify-blue/80 mb-8 max-w-2xl mx-auto">
              Start asking your AI automation questions today and transform your business.
            </p>
            <Button 
              className="bg-querify-blue hover:bg-blue-700 text-white px-16 py-8 text-xl font-medium w-72"
              onClick={handleSignUp}
              disabled={isCheckingSubscription}
              size="lg"
            >
              {getButtonText()}
            </Button>
          </div>
        </section>
      </div>

      <SignupCheckoutModal 
        open={isSignupModalOpen} 
        onOpenChange={setIsSignupModalOpen} 
      />
    </>
  );
};

export default Index;
