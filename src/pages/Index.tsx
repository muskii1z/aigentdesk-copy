
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import { useQuerify } from '@/context/QuerifyContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useQuerify();
  
  const handleGetAccess = () => {
  // Replace this URL with your actual Stripe Payment Link URL
  window.location.href = 'https://buy.stripe.com/test_00g29ZgNCcxXbDO9AA';
};


  return (
    <div className="flex flex-col min-h-screen">
      <HeroWithMockup
        title="Answer Your AI Automation Questions"
        description="AIgentDesk provides expert answers to all your AI automation questions, helping you implement intelligent solutions."
        primaryCta={{
          text: "Get Access",
          onClick: handleGetAccess
        }}
        secondaryCta={{
          text: "Learn More",
          href: "/about"
        }}
        mockupImage={{
          alt: "AIgentDesk interface",
          width: 1248,
          height: 765,
          src: "/lovable-uploads/f9322daa-f54e-4447-b957-403257ba769d.png"
        }}
        className="bg-gradient-to-br from-blue-50 to-white hero-pattern"
        renderCustomContent={() => (
          <div className="w-full max-w-3xl mx-auto animate-appear opacity-0 [animation-delay:500ms]">
            <AspectRatio ratio={16 / 9} className="bg-black rounded-xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/UX-R-PkjE84?rel=0&modestbranding=1&controls=1&showinfo=0"
                title="AIgentDesk Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </AspectRatio>
          </div>
        )}
      />
    </div>
  );
};

export default Index;
