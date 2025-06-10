
import React from 'react';

const Terms = () => {
  return (
    <div className="container max-w-screen-xl py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-querify-blue mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-querify-blue mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600 mb-4">
              By accessing and using AIgentDesk, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-querify-blue mb-4">Use License</h2>
            <p className="text-slate-600 mb-4">
              Permission is granted to temporarily use AIgentDesk for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-querify-blue mb-4">Disclaimer</h2>
            <p className="text-slate-600 mb-4">
              The materials on AIgentDesk are provided on an 'as is' basis. AIgentDesk makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-querify-blue mb-4">Limitations</h2>
            <p className="text-slate-600 mb-4">
              In no event shall AIgentDesk or its suppliers be liable for any damages arising 
              out of the use or inability to use the materials on AIgentDesk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-querify-blue mb-4">Contact Information</h2>
            <p className="text-slate-600">
              If you have any questions about these Terms of Service, please contact us at support@aigentdesk.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
