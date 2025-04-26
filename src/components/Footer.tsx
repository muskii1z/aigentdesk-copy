
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container max-w-screen-xl py-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-3">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl text-querify-blue">AIgentDesk</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AIgentDesk helps you answer your AI automation questions with accurate, helpful responses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-querify-blue">Pricing</Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-querify-blue">About</Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-querify-blue">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-querify-blue">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} AIgentDesk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
