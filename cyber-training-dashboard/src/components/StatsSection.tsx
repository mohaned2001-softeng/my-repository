import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    { value: '50+', label: 'CTF Labs', color: 'text-red-500' },
    { value: '1000+', label: 'Active Students', color: 'text-green-500' },
    { value: '100%', label: 'Hands-On', color: 'text-cyan-500' },
    { value: '24/7', label: 'Access', color: 'text-yellow-500' },
  ];

  const categories = [
    { name: 'Linux', count: 25, icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Web', count: 15, icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { name: 'Network', count: 8, icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
    { name: 'Crypto', count: 5, icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#111827] p-6 rounded-xl border border-gray-800 text-center">
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Lab Categories</h2>
          <p className="text-gray-400">Choose your learning path</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all cursor-pointer group">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{cat.name}</h3>
              <p className="text-gray-500">{cat.count} Labs</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
