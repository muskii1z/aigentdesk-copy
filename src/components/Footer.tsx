
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container max-w-screen-xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl text-querify-blue">AIgentDesk</span>
            </Link>
            <div className="py-2 px-3 rounded-md text-querify-blue font-medium bg-querify-blue/5 border border-querify-blue/10">
              Powered by AIgentic Bros
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} AIgentDesk. All rights reserved.
            </p>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-querify-blue transition-colors"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-querify-blue transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
