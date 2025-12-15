import React from 'react';

const AboutPage: React.FC = () => {
  const logo = 'https://d64gsuwffb70l.cloudfront.net/692c300d2977b5af17b3fc74_1764503896954_822c3c76.jpg';

  const features = [
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Hands-On Learning', desc: 'Practice on real vulnerable machines from VulnHub' },
    { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Detailed Writeups', desc: 'Step-by-step solutions for every lab challenge' },
    { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', title: 'Community', desc: 'Join the Libyan cybersecurity community' },
    { icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', title: 'Skill Building', desc: 'Progress from beginner to expert level' },
  ];

  const team = [
    { name: 'Dr. Ahmed Ali', role: 'Lead Instructor', specialty: 'Penetration Testing' },
    { name: 'Eng. Fatima Hassan', role: 'Security Researcher', specialty: 'Web Security' },
    { name: 'Omar Khalid', role: 'CTF Champion', specialty: 'Reverse Engineering' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20">
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <img src={logo} alt="Cyber Academy" className="h-24 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">أكاديمية الأمن السيبراني</h1>
          <h2 className="text-2xl text-red-500 mb-6">Cyber Academy Libya</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Libya's premier cybersecurity training platform. We provide hands-on CTF labs and penetration testing training to build the next generation of security professionals.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-[#0A0E27] p-6 rounded-xl border border-gray-800 hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Mission</h2>
          <div className="bg-[#111827] p-8 rounded-2xl border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Cyber Academy Libya is dedicated to empowering individuals with practical cybersecurity skills. Our platform provides access to real-world vulnerable machines and detailed writeups to help you master penetration testing.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Whether you're a beginner starting your journey or an experienced professional looking to sharpen your skills, our comprehensive lab environment offers challenges for every skill level.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <div key={i} className="bg-[#0A0E27] p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {t.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-white">{t.name}</h3>
                <p className="text-red-400">{t.role}</p>
                <p className="text-gray-500 text-sm mt-2">{t.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
          <p className="text-gray-400 mb-6">Have questions? Reach out to us!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://www.cyberacademy.ly" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
              Visit Our Website
            </a>
            <a href="mailto:info@cyberacademy.ly" className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-red-500 font-semibold rounded-lg transition-colors">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
