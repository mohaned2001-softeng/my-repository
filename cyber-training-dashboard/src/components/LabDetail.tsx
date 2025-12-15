import React, { useState } from 'react';
import { labs } from '../data/labs';
import { useAuth } from '../context/AuthContext';

interface LabDetailProps {
  labId: string;
  onBack: () => void;
  onLogin: () => void;
}

const diffColors: Record<string, string> = { Beginner: 'text-green-400 bg-green-500/20', Intermediate: 'text-yellow-400 bg-yellow-500/20', Advanced: 'text-orange-400 bg-orange-500/20', Expert: 'text-red-400 bg-red-500/20' };

const LabDetail: React.FC<LabDetailProps> = ({ labId, onBack, onLogin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const lab = labs.find(l => l.id === labId);
  const relatedLabs = labs.filter(l => l.category === lab?.category && l.id !== labId).slice(0, 3);

  if (!lab) return <div className="min-h-screen bg-[#0A0E27] pt-24 text-white text-center">Lab not found</div>;

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Labs
        </button>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-gray-800">
              <div className="relative h-64 md:h-80">
                <img src={lab.image} alt={lab.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-3 mb-3">
                    <span className={`px-3 py-1 ${diffColors[lab.difficulty]} text-sm font-semibold rounded-full`}>{lab.difficulty}</span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded-full">{lab.category}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{lab.title}</h1>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-4 border-b border-gray-700 mb-6">
                  {['overview', 'skills', 'writeup'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 font-medium capitalize ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Description</h2>
                    <p className="text-gray-300 mb-6">{lab.description}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#0A0E27] p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-500">{lab.estimatedTime}</div>
                        <div className="text-gray-400 text-sm">Duration</div>
                      </div>
                      <div className="bg-[#0A0E27] p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-500">{lab.skills.length}</div>
                        <div className="text-gray-400 text-sm">Skills</div>
                      </div>
                      <div className="bg-[#0A0E27] p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-cyan-500">VulnHub</div>
                        <div className="text-gray-400 text-sm">Platform</div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'skills' && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Skills You'll Learn</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {lab.skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#0A0E27] rounded-lg">
                          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-white">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'writeup' && (
                  <div className="text-center py-8">
                    {user ? (
                      <a href={lab.writeupUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                        View Full Writeup on Hacking Articles
                      </a>
                    ) : (
                      <div>
                        <p className="text-gray-400 mb-4">Login to access the full writeup</p>
                        <button onClick={onLogin} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Login to Continue</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user ? (
                  <a href={lab.writeupUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-center transition-colors">
                    View Writeup
                  </a>
                ) : (
                  <button onClick={onLogin} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Login to Access</button>
                )}
                <button className="w-full py-3 border border-gray-600 text-gray-300 hover:border-red-500 rounded-lg">Download VM</button>
              </div>
            </div>
            {relatedLabs.length > 0 && (
              <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Related Labs</h3>
                <div className="space-y-3">
                  {relatedLabs.map(rl => (
                    <div key={rl.id} className="flex gap-3 p-2 bg-[#0A0E27] rounded-lg cursor-pointer hover:bg-gray-800" onClick={() => window.location.reload()}>
                      <img src={rl.image} alt={rl.title} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <h4 className="text-white text-sm font-medium">{rl.title}</h4>
                        <p className="text-gray-500 text-xs">{rl.difficulty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDetail;
