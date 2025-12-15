import React from 'react';

const SkillsSection: React.FC = () => {
  const skills = [
    { name: 'Reconnaissance', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', desc: 'Learn to gather information about targets' },
    { name: 'Exploitation', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Master vulnerability exploitation techniques' },
    { name: 'Privilege Escalation', icon: 'M5 10l7-7m0 0l7 7m-7-7v18', desc: 'Escalate from user to root access' },
    { name: 'Web Security', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', desc: 'SQL injection, XSS, and more' },
    { name: 'Network Attacks', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0', desc: 'Network enumeration and exploitation' },
    { name: 'Cryptography', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', desc: 'Crack hashes and decode ciphers' },
  ];

  return (
    <section className="py-20 px-4 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Skills You'll Master</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Our labs cover essential penetration testing skills from beginner to advanced</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <div key={i} className="bg-[#0A0E27] p-6 rounded-xl border border-gray-800 hover:border-red-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-colors">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={skill.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
              <p className="text-gray-400 text-sm">{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
