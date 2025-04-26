
import React from 'react';

const Terms = () => {
  return (
    <div className="container max-w-screen-xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-querify-blue">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
          <p>By accessing or using AIgentDesk's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Use License</h2>
          <p>We grant you a limited, non-exclusive, non-transferable license to use our services for your personal or business purposes, subject to these Terms.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>You must provide accurate account information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You agree not to misuse our services</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Service Modifications</h2>
          <p>We reserve the right to modify or discontinue our services at any time, with or without notice.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
