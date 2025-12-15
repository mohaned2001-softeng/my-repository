import React from 'react';

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const heroImage = 'https://d64gsuwffb70l.cloudfront.net/692c31677e6e37525cc2a519_1764504027809_f1c4efe1.webp';
  const logo = 'https://d64gsuwffb70l.cloudfront.net/692c300d2977b5af17b3fc74_1764503896954_822c3c76.jpg';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Cyber Background" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] via-[#0A0E27]/70 to-[#0A0E27]" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute text-green-500/10 text-xs font-mono"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `pulse ${2 + Math.random() * 3}s infinite`, animationDelay: `${Math.random() * 2}s` }}>
            {Math.random() > 0.5 ? '01101001' : '10010110'}
          </div>
        ))}
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8 inline-block">
          <img src={logo} alt="Cyber Academy" className="h-20 md:h-28 mx-auto drop-shadow-2xl" />
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="text-red-500 block mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>أكاديمية الأمن السيبراني</span>
          <span className="text-2xl md:text-4xl lg:text-5xl text-white">Cyber Academy Libya</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Master cybersecurity through hands-on CTF labs. Learn penetration testing, exploit development, and ethical hacking with real-world vulnerable machines from VulnHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button onClick={onExplore}
            className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
            Explore Labs
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button onClick={onExplore}
            className="px-8 py-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-lg text-lg transition-all">
            Start Learning
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-red-500">50+</div>
            <div className="text-gray-400 text-sm">CTF Labs</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-green-500">1000+</div>
            <div className="text-gray-400 text-sm">Students</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-cyan-500">Free</div>
            <div className="text-gray-400 text-sm">To Start</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-yellow-500">24/7</div>
            <div className="text-gray-400 text-sm">Access</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
