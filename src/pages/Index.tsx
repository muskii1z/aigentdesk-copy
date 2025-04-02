
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg hero-pattern py-16 md:py-24">
        <div className="container max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                Answer Your <br className="hidden md:inline" />
                AI Automation <br className="hidden md:inline" />
                Questions
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-md">
                QuerifyAI provides expert answers to all your AI automation questions, helping you implement intelligent solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/ask">
                  <Button className="bg-white text-querify-blue hover:bg-gray-100 text-md px-8 py-6">
                    Ask Your Questions
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 text-md px-8 py-6">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-2 bg-white/10 backdrop-blur rounded-xl shadow-lg">
                <img 
                  src="/lovable-uploads/f9322daa-f54e-4447-b957-403257ba769d.png" 
                  alt="QuerifyAI interface" 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-screen-xl">
          <h2 className="text-3xl font-bold text-center mb-12">How QuerifyAI Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-querify-gray p-6 rounded-lg">
              <div className="bg-querify-blue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Ask Your Question</h3>
              <p className="text-muted-foreground">
                Simply type your AI automation question into our easy-to-use interface.
              </p>
            </div>
            
            <div className="bg-querify-gray p-6 rounded-lg">
              <div className="bg-querify-blue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Expert Answers</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your question and provides accurate, helpful responses.
              </p>
            </div>
            
            <div className="bg-querify-gray p-6 rounded-lg">
              <div className="bg-querify-blue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Implement Solutions</h3>
              <p className="text-muted-foreground">
                Use our guidance to implement effective AI automation in your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-querify-gray">
        <div className="container max-w-screen-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate with AI?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start asking your AI automation questions today and transform your business.
          </p>
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
