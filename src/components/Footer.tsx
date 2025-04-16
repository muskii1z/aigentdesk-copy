
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="container max-w-screen-xl py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl text-querify-blue">AIgentDesk</span>
            </Link>
            <div className="py-2 px-3 rounded-md text-querify-blue font-medium inline-block bg-querify-blue/5 border border-querify-blue/10">
              Powered by AIgentic Bros
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AIgentDesk helps you answer your AI automation questions with accurate, helpful responses.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-sm text-muted-foreground hover:text-querify-blue">Features</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-querify-blue">Pricing</Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-querify-blue">About</Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm text-muted-foreground hover:text-querify-blue">Blog</Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-querify-blue">Privacy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-querify-blue">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AIgentDesk. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-xs text-muted-foreground hover:text-querify-blue">
              Twitter
            </Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-querify-blue">
              LinkedIn
            </Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-querify-blue">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
