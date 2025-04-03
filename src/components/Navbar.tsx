
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/30">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl text-querify-blue">AIgentDesk</div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="text-querify-blue hover:text-blue-700">
            Home
          </Link>
          <Link to="/about" className="text-querify-blue/60 hover:text-blue-700">
            About
          </Link>
          <Link to="/blog" className="text-querify-blue/60 hover:text-blue-700">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/ask">
            <Button className="bg-querify-blue hover:bg-blue-700 text-white">
              Ask Questions
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
