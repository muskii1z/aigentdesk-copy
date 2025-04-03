import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="gradient-bg hero-pattern py-16 md:py-24">
        <div className="container max-w-screen-xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6">
              Answer Your AI Automation Questions
            </h1>
            <p className="text-lg md:text-xl text-black max-w-md mb-12">
              AIgentDesk provides expert answers to all your AI automation questions, helping you implement intelligent solutions.
            </p>
            
            <div className="text-2xl md:text-3xl font-semibold text-black max-w-2xl mb-8 px-4">
              Are you stuck building an automation? Is your HTTP request node just not working? Ask the AI automation guru!
            </div>
            
            <div className="text-lg md:text-xl font-medium bg-querify-blue/10 text-querify-blue py-3 px-6 rounded-full mb-8 inline-block">
              Powered by AIgentic Bros
            </div>
            
            <div className="w-full max-w-2xl mb-12">
              <div className="p-2 bg-white/10 backdrop-blur rounded-xl shadow-lg">
                <img 
                  src="/lovable-uploads/f9322daa-f54e-4447-b957-403257ba769d.png" 
                  alt="AIgentDesk interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ask" className="w-full sm:w-auto">
                <Button className="bg-white text-querify-blue hover:bg-gray-100 text-lg px-10 py-7 w-full sm:w-auto">
                  Ask Your Questions
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-10 py-7 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-querify-gray">
        <div className="container max-w-screen-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate with AI?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start asking your AI automation questions today and transform your business.
          </p>
          <div className="mb-6 font-medium text-querify-blue">
            Powered by AIgentic Bros
          </div>
          <Link to="/ask">
            <Button className="bg-querify-blue hover:bg-querify-lightBlue text-white px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
