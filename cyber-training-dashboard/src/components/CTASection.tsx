import React from 'react';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-red-900/50 to-[#0A0E27]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Start Your Cybersecurity Journey?
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of security enthusiasts learning penetration testing through hands-on CTF challenges. Start with beginner labs and progress to expert-level challenges.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/30"
          >
            Create Free Account
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 border-2 border-white/30 text-white hover:border-white hover:bg-white/10 font-semibold rounded-lg text-lg transition-all"
          >
            Browse Labs
          </button>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>50+ Labs</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Detailed Writeups</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
