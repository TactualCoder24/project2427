import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  tagline: string;
  price: string;
  period: string;
  duration: string;
  eligibility: string;
  startDate: string;
  schedule: string;
  level: string;
  badge: string;
  highlights: string[];
}

const courses: Course[] = [
  {
    id: 'python-ml-zero-to-hero',
    title: 'Python + ML: Zero to Hero',
    tagline: 'From your first line of Python to building real Machine Learning models',
    price: '₹299',
    period: '/month',
    duration: '3 months',
    eligibility: 'Class 7th – 12th students',
    startDate: 'Starts Aug 1, 2026',
    schedule: '3 live classes / week',
    level: 'Beginner → Intermediate',
    badge: '🔥 Most Popular',
    highlights: [
      'Python programming from absolute scratch',
      'Maths for ML (stats, linear algebra, calculus basics)',
      'NumPy, Pandas & data handling',
      'Scikit-learn & PyTorch fundamentals',
      'Capstone ML project + certificate',
    ],
  },
];

const Learn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
          <span className="text-gradient-intelligence">🎓 Vidvas Learn</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
          <span className="text-gradient-intelligence">Learn AI Skills</span>
          <br />
          <span className="text-ink">That Actually Matter</span>
        </h1>

        <p className="text-xl text-ink-2 max-w-3xl mx-auto font-inter">
          Live, mentor-led courses designed for school students who want a real head start
          in programming and Artificial Intelligence — built and taught by the Vidvas AI team.
        </p>
      </div>

      {/* Course Card */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative glass-premium rounded-2xl p-6 border-2 border-intelligence-blue shadow-glow-blue transition-all duration-300 hover:scale-105 flex flex-col"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-intelligence shadow-glow-blue text-white px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  {course.badge}
                </span>
              </div>

              <div className="text-center mb-4 mt-2">
                <h3 className="text-2xl font-bold text-ink mb-2 font-inter">{course.title}</h3>
                <p className="text-ink-2 text-sm mb-4 font-inter">{course.tagline}</p>

                <div className="mb-2">
                  <span className="text-4xl font-bold text-gradient-intelligence">{course.price}</span>
                  <span className="text-ink-2 text-sm font-inter">{course.period}</span>
                </div>
                <p className="text-signal-green text-xs font-inter">for {course.duration} · billed monthly</p>
              </div>

              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-xs text-ink-2 font-inter">
                  <span className="text-cyber-aqua">🎓</span>
                  <span>{course.eligibility}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-2 font-inter">
                  <span className="text-intelligence-blue">📅</span>
                  <span>{course.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-2 font-inter">
                  <span className="text-signal-green">🗓️</span>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-2 font-inter">
                  <span className="text-neon-green">📊</span>
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                {course.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-intelligence-blue/20 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-intelligence-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-ink-2 text-xs font-inter">{h}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/learn/${course.id}`)}
                className="w-full py-3 rounded-xl font-bold font-inter transition-all duration-300 text-sm bg-gradient-intelligence text-white shadow-glow-blue hover:shadow-glow-teal"
              >
                View Curriculum &amp; Enroll
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why learn with Vidvas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <h2 className="text-4xl font-bold text-center mb-12 font-inter">
          <span className="text-gradient-intelligence">Why Learn</span>{' '}
          <span className="text-ink">With Vidvas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '👨‍🏫', title: 'Live Mentor-Led Classes', desc: 'No pre-recorded videos — real doubt-solving, every class.' },
            { icon: '💰', title: 'Affordable Pricing', desc: 'Premium AI education at ₹299/month, built for Indian students.' },
            { icon: '🧠', title: 'Industry-Aligned Curriculum', desc: 'Learn the exact tools (NumPy, Pandas, PyTorch) used in real ML jobs.' },
            { icon: '🏆', title: 'Certificate + Projects', desc: 'Finish with a portfolio-ready ML project and a certificate.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-premium rounded-xl p-6 border border-edge text-center hover-lift">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-ink mb-2 font-inter">{item.title}</h3>
              <p className="text-ink-2 text-sm font-inter">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="glass-premium rounded-2xl p-12 border border-intelligence-blue/30">
          <h2 className="text-4xl font-bold mb-6 font-inter">
            <span className="text-gradient-intelligence">Ready to Start</span>{' '}
            <span className="text-ink">Your AI Journey?</span>
          </h2>
          <p className="text-xl text-ink-2 mb-8 font-inter">
            Seats for the August batch are limited — reserve yours today.
          </p>
          <button
            onClick={() => navigate('/learn/python-ml-zero-to-hero')}
            className="bg-gradient-intelligence text-white px-12 py-4 rounded-xl font-bold text-lg shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
          >
            View Course Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learn;
