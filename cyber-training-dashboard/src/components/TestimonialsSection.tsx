import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    { name: 'Ahmed M.', role: 'Security Analyst', text: 'The hands-on labs helped me land my first cybersecurity job. The writeups are incredibly detailed.', avatar: 'A' },
    { name: 'Sara K.', role: 'Penetration Tester', text: 'Best platform for learning real-world hacking skills. The progression from beginner to advanced is perfect.', avatar: 'S' },
    { name: 'Omar H.', role: 'CTF Player', text: 'I improved my CTF ranking significantly after practicing on these labs. Highly recommended!', avatar: 'O' },
  ];

  return (
    <section className="py-20 px-4 bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Students Say</h2>
          <p className="text-gray-400">Join thousands of successful cybersecurity professionals</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#111827] p-6 rounded-xl border border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{t.name}</h4>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-400 italic">"{t.text}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
