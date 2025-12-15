import React from 'react';
import { labs } from '../data/labs';
import LabCard from './LabCard';

interface FeaturedLabsProps {
  onLabClick: (labId: string) => void;
  onViewAll: () => void;
}

const FeaturedLabs: React.FC<FeaturedLabsProps> = ({ onLabClick, onViewAll }) => {
  const featured = labs.slice(0, 6);

  return (
    <section className="py-20 px-4 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Start Learning</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">Featured Labs</h2>
            <p className="text-gray-400 max-w-xl">Begin your cybersecurity journey with our most popular CTF challenges from VulnHub</p>
          </div>
          <button onClick={onViewAll} className="mt-6 md:mt-0 group px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium rounded-lg transition-all flex items-center gap-2">
            View All Labs
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(lab => (
            <LabCard key={lab.id} lab={lab} onClick={() => onLabClick(lab.id)} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Can't decide where to start?</p>
          <button onClick={() => onLabClick(labs[0].id)} className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4">
            Try our beginner-friendly DC-1 lab
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLabs;
