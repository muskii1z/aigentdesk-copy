
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-querify-blue">About AIgentDesk</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg text-center mb-8 border-l-4 border-querify-blue">
          <p className="text-lg font-medium text-querify-blue">Powered by AIgentic Bros, built for doers</p>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6 text-querify-blue/90">
            AIgentDesk was founded with a simple mission: to make AI automation accessible to everyone. 
            We believe that the future of business lies in intelligent automation, but we also understand 
            that navigating this complex field can be challenging.
          </p>
          
          <p className="mb-6 text-querify-blue/80">
            Our platform provides expert answers to your AI automation questions, helping you understand 
            how to implement these technologies in your business.
          </p>
          
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
