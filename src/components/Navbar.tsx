
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Menu, { IMenu } from '@/components/ui/menu';
import SignUpModal from '@/components/SignUpModal';
import { useSignUpModal } from '@/hooks/useSignUpModal';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard } from 'lucide-react';

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
  const { isOpen, setIsOpen } = useSignUpModal();
  const { user } = useQuerify();

  const handlePaymentClick = async () => {
    if (!user) {
      setIsOpen(true);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { user_id: user.id },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleSignInClick = () => {
    setIsOpen(true);
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
            {!user && (
              <Button 
                variant="outline"
                className="text-querify-blue border-querify-blue hover:bg-querify-blue/5"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            )}
            <Button 
              className="bg-querify-blue hover:bg-blue-700 text-white hidden md:inline-flex"
              onClick={handlePaymentClick}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Get Access
            </Button>
          </div>
        </div>
      </header>
      <SignUpModal
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultView="sign-in"
        allowRegistration={false}
      />
    </>
  );
};

export default Navbar;
