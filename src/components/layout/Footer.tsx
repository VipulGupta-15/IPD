
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-blue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-white font-semibold text-xl">
              <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">MCQ Generator</span>
            </Link>
            <p className="mt-4 text-white/70">
              Transform your PDFs into interactive multiple-choice questions with our AI-powered platform.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-white/70 hover:text-light-teal transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-light-teal transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-light-teal transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-light-teal transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-light-teal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-white/70 hover:text-light-teal transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/70 hover:text-light-teal transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-light-teal transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-white/70 hover:text-light-teal transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white/70 hover:text-light-teal transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-light-teal transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-white/70 hover:text-light-teal transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-light-teal" />
                <a href="mailto:info@mcqgenerator.com" className="text-white/70 hover:text-light-teal transition-colors">
                  info@mcqgenerator.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-white/10 border border-white/30 rounded-l-md focus:outline-none focus:border-light-teal text-white"
                />
                <button className="bg-light-teal text-deep-blue px-4 py-2 rounded-r-md hover:bg-light-teal/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} MCQ Generator. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-white/70 hover:text-light-teal text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/70 hover:text-light-teal text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
