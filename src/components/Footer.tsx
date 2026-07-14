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
    <footer className="bg-gradient-to-b from-surface to-surface-2 border-t border-edge">
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
            <p className="text-ink-2 text-base max-w-md leading-relaxed font-inter">
              India's AI lab — building intelligent agents, custom AI systems,
              automation, and enterprise integrations, all in one place.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-12 h-12 glass-premium rounded-xl flex items-center justify-center text-ink-2 hover:text-ink hover:bg-gradient-to-br hover:from-cyber-aqua/20 hover:to-intelligence-blue/20 transition-all duration-300 hover:scale-110 transform border border-edge hover:border-cyber-aqua/30"
                  aria-label={social.name}
                >
                  <span className="text-2xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-ink font-bold text-xl mb-6 font-inter text-gradient-intelligence">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/demo" className="text-ink-2 hover:text-gradient-intelligence transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  📅 Schedule a Demo
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-ink-2 hover:text-gradient-intelligence transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  💬 Live Chat Support
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-ink-2 hover:text-gradient-intelligence transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  📚 Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-2 hover:text-gradient-intelligence transition-colors text-base font-inter hover:translate-x-1 inline-block transform duration-200">
                  ❓ FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-ink font-bold text-xl mb-6 font-inter text-gradient">Contact</h3>
            <div className="space-y-4">
              <div className="glass-premium p-4 rounded-xl border border-edge">
                <p className="text-sm text-ink-2 mb-1 font-inter">Email</p>
                <p className="text-ink font-semibold font-inter">contact@vidvasai.com</p>
              </div>
              <div className="glass-premium p-4 rounded-xl border border-edge">
                <p className="text-sm text-ink-2 mb-1 font-inter">Location</p>
                <p className="text-ink font-semibold font-inter flex items-center gap-2">
                  Delhi, India
                  🇮🇳
                </p>
              </div>
              <div className="glass-premium p-4 rounded-xl border border-edge">
                <p className="text-sm text-ink-2 mb-1 font-inter">Phone</p>
                <p className="text-ink font-semibold font-inter">+91 98765 43210</p>
                <p className="text-xs text-ink-3 font-inter mt-1">Mon-Fri, 9AM-6PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-edge mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-ink-2 text-sm font-inter">
            © 2026 VIDVAS.AI. All rights reserved.
          </p>
          <p className="text-ink-3 text-sm mt-4 md:mt-0 font-inter">
            Built with ❤️ in 🇮🇳 India for the World
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
