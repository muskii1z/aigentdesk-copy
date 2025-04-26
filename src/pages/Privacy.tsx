
import React from 'react';

const Privacy = () => {
  return (
    <div className="container max-w-screen-xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-querify-blue">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p>AIgentDesk ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Account information (name, email, password)</li>
            <li>Usage data and interaction with our services</li>
            <li>Payment information when purchasing our services</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you updates and communications</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information and maintain its confidentiality.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
