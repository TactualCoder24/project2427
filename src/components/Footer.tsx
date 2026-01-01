import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'GitHub', icon: '⚡', href: '#' },
    { name: 'Discord', icon: '💬', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <img
                src="/removed_bglogo.png"
                alt="Vidvas AI"
                className="h-10 w-auto mb-4 group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-gray-400 text-base max-w-md leading-relaxed font-inter">
              Pioneering the future of artificial intelligence with cutting-edge agentic solutions.
              Transform your business with intelligent automation and AI-powered innovation.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-12 h-12 glass-premium rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-electric-blue/20 hover:to-vercel-blue/20 transition-all duration-300 hover:scale-110 transform border border-white/5 hover:border-electric-blue/30"
                  aria-label={social.name}
                >
                  <span className="text-2xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6 font-inter text-gradient-cyber">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gradient-cyber transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  → About Us
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-gray-400 hover:text-gradient-cyber transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  → Our Agents
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gradient-cyber transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  → Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-gradient-cyber transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  → Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-gradient-cyber transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  → Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6 font-inter text-gradient">Contact</h3>
            <div className="space-y-4">
              <div className="glass-premium p-4 rounded-xl border border-white/5">
                <p className="text-sm text-gray-400 mb-1 font-inter">Email</p>
                <p className="text-white font-semibold font-inter">contact@vidvasai.com</p>
              </div>
              <div className="glass-premium p-4 rounded-xl border border-white/5">
                <p className="text-sm text-gray-400 mb-1 font-inter">Location</p>
                <p className="text-white font-semibold font-inter flex items-center gap-2">
                  Delhi, India
                  🇮🇳
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-inter">
            © 2025 VIDVAS.AI. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0 font-inter">
            Built with ❤️ in 🇮🇳 India for the World
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

