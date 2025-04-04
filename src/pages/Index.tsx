
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import { VideoPlayer } from '@/components/ui/video-player';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroWithMockup
        title="Answer Your AI Automation Questions"
        description="AIgentDesk provides expert answers to all your AI automation questions, helping you implement intelligent solutions."
        primaryCta={{
          text: "Ask Your Questions",
          href: "/ask",
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
          <div className="w-full pt-12 px-4 sm:px-6 lg:px-8">
            <VideoPlayer 
              src="https://download.samplelib.com/mp4/sample-5s.mp4" 
              poster="/lovable-uploads/f9322daa-f54e-4447-b957-403257ba769d.png"
              className="animate-appear opacity-0 [animation-delay:700ms] shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] border border-querify-blue/10 rounded-xl"
            />
          </div>
        )}
      />

      <section className="py-16 bg-blue-50/30">
        <div className="container max-w-screen-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-querify-blue">Ready to Automate with AI?</h2>
          <p className="text-lg text-querify-blue/80 mb-8 max-w-2xl mx-auto">
            Start asking your AI automation questions today and transform your business.
          </p>
          <div className="mb-6 font-medium text-querify-blue">
            Powered by AIgentic Bros, built for doers
          </div>
          <Link to="/ask">
            <Button className="bg-querify-blue hover:bg-blue-700 text-white px-8 py-6">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
