
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import { useQuerify } from '@/context/QuerifyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useQuerify();
  
  const handleGetAccess = async () => {
    if (!user) {
      navigate('/ask');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start subscription process');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroWithMockup
        title="Answer Your AI Automation Questions"
        description="AIgentDesk provides expert answers to all your AI automation questions, helping you implement intelligent solutions."
        primaryCta={{
          text: "Get Access",
          onClick: handleGetAccess,
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
        className="bg-gradient-to-br from-blue-50 to-white hero-pattern !py-8 md:!py-12 lg:!py-16"
        renderCustomContent={() => (
          <>
            <div className="w-full pt-6 px-4 sm:px-6 lg:px-8 flex justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/UX-R-PkjE84?rel=0&modestbranding=1&controls=1&showinfo=0"
                title="AIgentDesk Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default Index;
