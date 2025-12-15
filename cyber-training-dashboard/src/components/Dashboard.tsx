import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { labs } from '../data/labs';

interface DashboardProps {
  onLabClick: (labId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLabClick }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('users').update({ full_name: fullName, bio }).eq('id', user.id);
    setSaving(false);
    setEditing(false);
  };

  if (!user) return null;

  const recentLabs = labs.slice(0, 6);
  const beginnerLabs = labs.filter(l => l.difficulty === 'Beginner').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.full_name || 'Student'}!</h1>
          <p className="text-gray-400">Track your progress and continue learning</p>
        </div>
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {['overview', 'profile', 'progress'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Continue Learning</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {beginnerLabs.map(lab => (
                    <div key={lab.id} onClick={() => onLabClick(lab.id)} className="flex gap-4 p-3 bg-[#0A0E27] rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                      <img src={lab.image} alt={lab.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{lab.title}</h4>
                        <p className="text-green-400 text-sm">{lab.difficulty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">All Labs</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {recentLabs.map(lab => (
                    <div key={lab.id} onClick={() => onLabClick(lab.id)} className="p-3 bg-[#0A0E27] rounded-lg cursor-pointer hover:bg-gray-800 transition-colors text-center">
                      <img src={lab.image} alt={lab.title} className="w-full h-20 rounded-lg object-cover mb-2" />
                      <h4 className="text-white text-sm font-medium truncate">{lab.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white">{user.full_name || 'Cyber Student'}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-gray-400">Labs Completed</span><span className="text-white font-bold">0</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">In Progress</span><span className="text-white font-bold">0</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total Labs</span><span className="text-white font-bold">{labs.length}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.full_name || 'Cyber Student'}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} disabled={!editing}
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} disabled={!editing} rows={4}
                    className="w-full px-4 py-3 bg-[#0A0E27] border border-gray-700 rounded-lg text-white disabled:opacity-50" placeholder="Tell us about yourself..." />
                </div>
                {editing ? (
                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">{saving ? 'Saving...' : 'Save Changes'}</button>
                    <button onClick={() => setEditing(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="px-6 py-3 border border-gray-600 text-gray-300 hover:border-red-500 rounded-lg">Edit Profile</button>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'progress' && (
          <div className="bg-[#111827] rounded-2xl p-8 border border-gray-800 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Start Your Journey</h3>
            <p className="text-gray-400 mb-6">Complete labs to track your progress here!</p>
            <button onClick={() => onLabClick(labs[0].id)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">Start First Lab</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
