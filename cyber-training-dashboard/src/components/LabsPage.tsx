import React, { useState } from 'react';
import { labs } from '../data/labs';
import LabCard from './LabCard';
import { Lab } from '@/types';

interface LabsPageProps {
  onLabClick: (labId: string) => void;
}

const LabsPage: React.FC<LabsPageProps> = ({ onLabClick }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', ...new Set(labs.map(l => l.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filtered: Lab[] = labs.filter(lab => {
    const matchCat = filter === 'All' || lab.category === filter;
    const matchDiff = diffFilter === 'All' || lab.difficulty === diffFilter;
    const matchSearch = lab.title.toLowerCase().includes(search.toLowerCase()) ||
      lab.description.toLowerCase().includes(search.toLowerCase()) ||
      lab.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchDiff && matchSearch;
  });

  if (sortBy === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === 'difficulty') {
    const order = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
    filtered.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">CTF Training Labs</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Practice on real vulnerable machines from Vulnhub with detailed step-by-step writeups</p>
        </div>
        <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search labs, skills..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none" />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none">
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
            </select>
            <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} className="px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none">
              {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none">
              <option value="default">Default</option>
              <option value="name">Name A-Z</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">{filtered.length} labs found</p>
          <div className="flex gap-2">
            {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map(d => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${diffFilter === d ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(lab => <LabCard key={lab.id} lab={lab} onClick={() => onLabClick(lab.id)} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No labs found matching your criteria</p>
            <button onClick={() => { setFilter('All'); setDiffFilter('All'); setSearch(''); }} className="mt-4 text-red-500 hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabsPage;
