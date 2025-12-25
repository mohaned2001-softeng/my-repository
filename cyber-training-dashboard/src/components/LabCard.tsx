import React from 'react';
import { Lab } from '@/types';
import { buildAssetUrl } from '@/lib/config';

interface LabCardProps {
  lab: Lab;
  onClick: () => void;
}

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-orange-500',
  Expert: 'bg-red-500',
};

const LabCard: React.FC<LabCardProps> = ({ lab, onClick }) => {
  const resolveImageSrc = () => {
    if (lab.image_url) {
      return buildAssetUrl(lab.image_url);
    }
    if (typeof lab.image === 'string') {
      return buildAssetUrl(lab.image) ?? lab.image;
    }
    if (lab.image instanceof File) {
      return URL.createObjectURL(lab.image);
    }
    return 'https://placehold.co/600x400?text=Cyber+Lab';
  };
  const imageSrc = resolveImageSrc();
  const formatDuration = () => {
    if (!lab.estimated_time) {
      return 'N/A';
    }
    if (lab.estimated_time >= 60) {
      const hours = lab.estimated_time / 60;
      return `${hours % 1 === 0 ? hours : hours.toFixed(1)}h`;
    }
    return `${lab.estimated_time}m`;
  };
  return (
    <div onClick={onClick}
      className="group bg-[#111827] rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/10">
      <div className="relative h-48 overflow-hidden">
        <img src={imageSrc} alt={lab.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 ${difficultyColors[lab.difficulty] ?? 'bg-gray-500'} text-white text-xs font-semibold rounded-full`}>
            {lab.difficulty}
          </span>
          <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full">
            {lab.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{lab.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{lab.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(lab.skills ?? []).slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">{skill}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration()}
          </span>
          <span className="text-red-500 font-medium group-hover:underline">Start Lab</span>
        </div>
      </div>
    </div>
  );
};

export default LabCard;
