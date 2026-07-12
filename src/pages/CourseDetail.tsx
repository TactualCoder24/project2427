import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const curriculum = [
  {
    module: 'Module 1',
    title: 'Python Foundations',
    weeks: 'Weeks 1–3',
    topics: [
      'Variables, data types & operators',
      'Loops, conditionals & functions',
      'Lists, tuples, dictionaries & sets',
      'File handling & error handling',
      'Object-Oriented Programming basics',
    ],
  },
  {
    module: 'Module 2',
    title: 'Maths for Machine Learning',
    weeks: 'Weeks 4–5',
    topics: [
      'Linear algebra: vectors & matrices',
      'Statistics & probability essentials',
      'Calculus intuition: derivatives & gradients',
      'Why the maths matters — connecting theory to ML',
    ],
  },
  {
    module: 'Module 3',
    title: 'Data Handling with NumPy & Pandas',
    weeks: 'Weeks 6–7',
    topics: [
      'NumPy arrays & vectorized operations',
      'Pandas DataFrames & Series',
      'Data cleaning & preprocessing',
      'Exploratory Data Analysis (EDA)',
      'Data visualization with Matplotlib/Seaborn',
    ],
  },
  {
    module: 'Module 4',
    title: 'Machine Learning with Scikit-learn',
    weeks: 'Weeks 8–9',
    topics: [
      'Supervised learning: regression & classification',
      'Train/test splits, cross-validation',
      'Decision Trees, Random Forests, KNN, SVM',
      'Model evaluation metrics',
      'Unsupervised learning: clustering basics',
    ],
  },
  {
    module: 'Module 5',
    title: 'Deep Learning with PyTorch',
    weeks: 'Weeks 10–11',
    topics: [
      'Tensors & PyTorch fundamentals',
      'Building your first neural network',
      'Training loops, loss functions & optimizers',
      'Intro to CNNs for image data',
    ],
  },
  {
    module: 'Module 6',
    title: 'Capstone Project & Certification',
    weeks: 'Week 12',
    topics: [
      'End-to-end ML project from scratch',
      'Model deployment basics',
      'Project presentation & portfolio building',
      'Course certificate awarded',
    ],
  },
];

const roadmap = [
  { step: '01', title: 'Enroll & Onboard', desc: 'Join the batch, get access to live class links, resources & community.' },
  { step: '02', title: 'Learn Python Basics', desc: 'Build a rock-solid foundation in Python programming (Weeks 1–3).' },
  { step: '03', title: 'Master the Maths', desc: 'Understand the linear algebra, stats & calculus behind ML (Weeks 4–5).' },
  { step: '04', title: 'Handle Real Data', desc: 'Get hands-on with NumPy, Pandas & data visualization (Weeks 6–7).' },
  { step: '05', title: 'Build ML Models', desc: 'Train and evaluate models using Scikit-learn (Weeks 8–9).' },
  { step: '06', title: 'Go Deep with PyTorch', desc: 'Step into neural networks & deep learning (Weeks 10–11).' },
  { step: '07', title: 'Ship a Capstone Project', desc: 'Apply everything in a real project & earn your certificate (Week 12).' },
];

const whyChoose = [
  { icon: '👨‍🏫', title: 'Live, Not Recorded', desc: 'Every class is live with real-time doubt solving — not a pre-recorded video dump.' },
  { icon: '🎯', title: 'Built for School Students', desc: 'Paced and explained specifically for Class 7th–12th learners, no prior coding needed.' },
  { icon: '💸', title: 'Incredibly Affordable', desc: '₹299/month is a fraction of typical ed-tech pricing for the same depth of content.' },
  { icon: '🧩', title: 'Maths Made Intuitive', desc: 'We don\'t skip the maths — we make linear algebra & stats click before you need them.' },
  { icon: '🛠️', title: 'Industry-Standard Tools', desc: 'NumPy, Pandas, Scikit-learn & PyTorch — the same stack used in real ML jobs.' },
  { icon: '📜', title: 'Certificate + Project', desc: 'Walk away with a capstone ML project and a certificate to show for it.' },
  { icon: '👥', title: 'Small Batch Sizes', desc: 'Focused batches so every student actually gets attention and gets unstuck.' },
  { icon: '🚀', title: 'Early Advantage', desc: 'Start building AI skills years before most students even consider it.' },
];

const faqs = [
  { q: 'Do I need any prior coding experience?', a: 'No! This course starts from absolute zero — no programming background required.' },
  { q: 'What do I need to join classes?', a: 'A laptop/desktop with a stable internet connection. All software used is free and open-source.' },
  { q: 'Is the ₹299/month price for the full course?', a: 'Yes, ₹299/month billed for 3 months covers the entire curriculum, live classes, and the capstone project.' },
  { q: 'What if I miss a live class?', a: 'Every class is recorded and shared with enrolled students, so you can catch up anytime.' },
  { q: 'Will I get a certificate?', a: 'Yes, on completing the capstone project you receive a Vidvas AI course completion certificate.' },
  { q: 'Can college students join too?', a: 'This batch is designed for Class 7th–12th students. College students can join our upcoming advanced batches — join the waitlist on the Learn page.' },
];

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link to="/learn" className="text-sm text-ink-2 hover:text-ink transition-colors font-inter">
          ← Back to Learn
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-premium rounded-3xl p-6 sm:p-10 border border-intelligence-blue/30">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-intelligence text-white">
              🔥 Most Popular
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-signal-green/20 text-signal-green">
              Starts Aug 1, 2026
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-ink/[0.06] text-ink-2">
              Class 7th – 12th
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter mb-4">
            <span className="text-gradient-intelligence">Python + ML</span>{' '}
            <span className="text-ink">Zero to Hero</span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-2 font-inter max-w-3xl mb-8">
            A complete 3-month, live, mentor-led journey from your very first Python line
            to training real Machine Learning models with NumPy, Pandas, Scikit-learn & PyTorch.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Price', value: '₹299/mo' },
              { label: 'Duration', value: '3 Months' },
              { label: 'Schedule', value: '3 classes/week' },
              { label: 'Level', value: 'Beginner+' },
            ].map((stat, idx) => (
              <div key={idx} className="glass-premium rounded-xl p-4 border border-edge text-center">
                <div className="text-xl sm:text-2xl font-bold text-gradient-intelligence font-inter">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-ink-2 mt-1 font-inter uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-intelligence text-white px-8 py-4 rounded-xl font-bold text-base shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
            >
              Enroll Now — ₹299/month
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 rounded-xl font-bold text-base bg-ink/[0.06] text-ink hover:bg-ink/[0.12] border border-edge-2 transition-all duration-300 font-inter"
            >
              Talk to a Mentor
            </button>
          </div>
        </div>
      </div>

      {/* Eligibility & Pricing */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-premium rounded-2xl p-8 border border-edge">
          <h2 className="text-2xl font-bold text-ink mb-4 font-inter flex items-center gap-2">
            🎓 Eligibility
          </h2>
          <ul className="space-y-3">
            {[
              'Students currently in Class 7th to 12th',
              'No prior programming or maths background required',
              'Basic school-level maths (arithmetic, algebra) is enough to start',
              'A laptop/desktop with a stable internet connection',
              'Curiosity to learn and consistency to attend classes',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-ink-2 text-sm font-inter">
                <span className="text-signal-green mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-premium rounded-2xl p-8 border border-intelligence-blue/30">
          <h2 className="text-2xl font-bold text-ink mb-4 font-inter flex items-center gap-2">
            💰 Pricing &amp; Schedule
          </h2>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gradient-intelligence font-inter">₹299</span>
            <span className="text-ink-2 text-sm font-inter"> /month</span>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-ink-2 font-inter">
              <span className="text-cyber-aqua mt-0.5">📅</span>
              <span>Billed monthly for 3 months (total course duration)</span>
            </li>
            <li className="flex items-start gap-2 text-ink-2 font-inter">
              <span className="text-cyber-aqua mt-0.5">🚀</span>
              <span>Course starts <strong className="text-ink">August 1, 2026</strong></span>
            </li>
            <li className="flex items-start gap-2 text-ink-2 font-inter">
              <span className="text-cyber-aqua mt-0.5">🗓️</span>
              <span><strong className="text-ink">3 live classes per week</strong> (approx. 1 hour each)</span>
            </li>
            <li className="flex items-start gap-2 text-ink-2 font-inter">
              <span className="text-cyber-aqua mt-0.5">🔁</span>
              <span>Class recordings provided for revision / missed sessions</span>
            </li>
            <li className="flex items-start gap-2 text-ink-2 font-inter">
              <span className="text-cyber-aqua mt-0.5">🔒</span>
              <span>Cancel anytime — no long-term lock-in</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Why Choose This Course */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl font-bold text-center mb-4 font-inter">
          <span className="text-gradient-intelligence">Why Choose</span>{' '}
          <span className="text-ink">This Course</span>
        </h2>
        <p className="text-center text-ink-2 font-inter max-w-2xl mx-auto mb-12">
          There are hundreds of Python courses online. Here's what makes this one different.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="glass-premium rounded-xl p-6 border border-edge hover-lift">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-base font-bold text-ink mb-2 font-inter">{item.title}</h3>
              <p className="text-ink-2 text-xs font-inter">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl font-bold text-center mb-4 font-inter">
          <span className="text-gradient-intelligence">Your Learning</span>{' '}
          <span className="text-ink">Roadmap</span>
        </h2>
        <p className="text-center text-ink-2 font-inter max-w-2xl mx-auto mb-12">
          A clear, week-by-week path from zero to your first Machine Learning project.
        </p>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-intelligence-blue via-cyber-aqua to-signal-green hidden sm:block" />
          <div className="space-y-6">
            {roadmap.map((item, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-6 items-start relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-intelligence flex items-center justify-center text-white font-bold text-sm font-inter z-10 shadow-glow-blue">
                  {item.step}
                </div>
                <div className="glass-premium rounded-xl p-5 border border-edge flex-grow">
                  <h3 className="text-lg font-bold text-ink mb-1 font-inter">{item.title}</h3>
                  <p className="text-ink-2 text-sm font-inter">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl font-bold text-center mb-4 font-inter">
          <span className="text-gradient-intelligence">Full Curriculum</span>{' '}
          <span className="text-ink">/ Syllabus</span>
        </h2>
        <p className="text-center text-ink-2 font-inter max-w-2xl mx-auto mb-12">
          From Python basics all the way to PyTorch — a 12-week, 6-module syllabus.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {curriculum.map((mod, idx) => (
            <div key={idx} className="glass-premium rounded-2xl p-6 border border-edge hover:border-intelligence-blue/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyber-aqua font-inter uppercase tracking-wide">{mod.module}</span>
                <span className="text-xs text-ink-2 font-inter">{mod.weeks}</span>
              </div>
              <h3 className="text-xl font-bold text-ink mb-4 font-inter">{mod.title}</h3>
              <ul className="space-y-2">
                {mod.topics.map((topic, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2 text-sm text-ink-2 font-inter">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-intelligence-blue/20 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-intelligence-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-4xl font-bold text-center mb-12 font-inter">
          <span className="text-gradient-intelligence">Frequently Asked</span>{' '}
          <span className="text-ink">Questions</span>
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-premium rounded-xl p-6 border border-edge">
              <h3 className="text-lg font-bold text-ink mb-2 font-inter">{faq.q}</h3>
              <p className="text-ink-2 font-inter text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-premium rounded-2xl p-12 border border-intelligence-blue/30">
          <h2 className="text-4xl font-bold mb-6 font-inter">
            <span className="text-gradient-intelligence">Seats Are Limited</span>{' '}
            <span className="text-ink">for the August Batch</span>
          </h2>
          <p className="text-xl text-ink-2 mb-8 font-inter">
            ₹299/month · 3 months · Starts Aug 1, 2026 · 3 classes/week
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-intelligence text-white px-12 py-4 rounded-xl font-bold text-lg shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
          >
            Reserve Your Seat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
