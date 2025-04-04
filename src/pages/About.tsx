import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const About = () => {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-querify-blue">About AIgentDesk</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg text-center mb-8 border-l-4 border-querify-blue">
          <p className="text-lg font-medium text-querify-blue">Powered by Aigentic Bros, built for doers</p>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6 text-querify-blue/90">
            AIgentDesk was founded by Aigentic Bros with a simple mission: to make AI automation accessible to everyone. 
            We believe that the future of business lies in intelligent automation, but we also understand 
            that navigating this complex field can be challenging.
          </p>
          
          <p className="mb-6 text-querify-blue/80">
            Our platform provides expert answers to your AI automation questions, helping you understand 
            how to implement these technologies in your business.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-querify-blue">About Aigentic Bros</h2>
          
          <p className="mb-6 text-querify-blue/90">
            Aigentic Bros is on a mission to help local businesses grow using the power of AI — and teach 
            everyday people how to turn that into real income. We specialize in using AI tools and 
            automation to simplify marketing, generate leads, and streamline operations for local businesses. 
            Whether you're a business owner ready to modernize, or an aspiring freelancer looking to build 
            an AI-powered side hustle, we give you the tools, strategies, and step-by-step playbooks to win 
            in the new economy. No tech background needed — just a willingness to learn, take action, and 
            provide real value. Let's build smarter, together.
          </p>
          
          <div className="flex items-center mb-8">
            <a 
              href="https://www.instagram.com/aigenticbros?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Instagram size={20} />
              Follow us on Instagram
            </a>
          </div>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-querify-blue">Our Approach</h2>
          
          <p className="mb-6 text-querify-blue/90">
            We combine the latest in AI technology with expert human knowledge to provide accurate, 
            helpful responses to your questions. Our system is constantly learning and improving, 
            ensuring that you always receive the most up-to-date information.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-querify-blue">Why Choose AIgentDesk</h2>
          
          <ul className="list-disc pl-6 mb-6 space-y-2 text-querify-blue/90">
            <li>Expert answers from AI specialists</li>
            <li>Easy-to-understand explanations of complex concepts</li>
            <li>Practical advice you can implement right away</li>
            <li>Continuous updates to keep pace with rapidly evolving technology</li>
            <li>Personalized recommendations based on your business needs</li>
          </ul>
          
          <p className="mb-8 text-querify-blue/90">
            Ready to explore how AI automation can transform your business? Start asking questions 
            today and take the first step towards a more efficient, intelligent future.
          </p>
          
          <div className="mt-8">
            <Link to="/ask">
              <Button className="bg-querify-blue hover:bg-blue-700 text-white">
                Ask Your Questions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
