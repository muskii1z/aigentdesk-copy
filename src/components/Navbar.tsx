
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Menu, { IMenu } from '@/components/ui/menu';
import SignUpModal from '@/components/SignUpModal';
import { useSignUpModal } from '@/hooks/useSignUpModal';

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
  {
    id: 3,
    title: 'Products',
    url: '/products',
    dropdown: true,
    items: [
      {
        id: 31,
        title: 'AI Solutions',
        url: '/products/ai-solutions',
      },
      {
        id: 32,
        title: 'Automation Tools',
        url: '/products/automation',
      },
    ],
  },
  {
    id: 4,
    title: 'Blog',
    url: '/blog',
    dropdown: false,
  },
];

const Navbar: React.FC = () => {
  const { isOpen, setIsOpen, redirectUrl } = useSignUpModal();
  const navigate = useNavigate();

  const handleAskClick = () => {
    navigate('/ask');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/30">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="font-bold text-2xl text-querify-blue">AIgentDesk</div>
          </Link>

          <div className="flex-1 flex justify-center">
            <Menu list={menuItems} />
          </div>

          <div className="flex items-center gap-4">
            <Button 
              className="bg-querify-blue hover:bg-blue-700 text-white text-base px-6 py-6 text-lg font-medium"
              onClick={handleAskClick}
              size="lg"
            >
              Ask Questions
            </Button>
          </div>
        </div>
      </header>
      <SignUpModal open={isOpen} onOpenChange={setIsOpen} redirectUrl={redirectUrl} />
    </>
  );
};

export default Navbar;
