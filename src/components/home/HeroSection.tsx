
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center pt-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue to-deep-blue/40 z-[-1]"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left relative z-10">
          <span className="inline-block bg-white/10 backdrop-blur-md text-light-teal px-4 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
            PDF to MCQ Transformation
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in animate-delay-100">
            <span className="block">Transform Your </span>
            <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">
              Learning Materials
            </span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-lg animate-fade-in animate-delay-200">
            Instantly convert PDF documents into interactive multiple-choice questions. Save time and enhance learning with our AI-powered platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in animate-delay-300">
            <Link
              to="/signup"
              className="btn-primary group"
            >
              <span className="flex items-center justify-center">
                Get Started
                <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/features"
              className="btn-outline"
            >
              Learn More
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center md:justify-start space-x-8 animate-fade-in animate-delay-400">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white">2K+</h4>
              <p className="text-white/70 text-sm">Teachers</p>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white">50K+</h4>
              <p className="text-white/70 text-sm">Students</p>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white">100K+</h4>
              <p className="text-white/70 text-sm">MCQs Generated</p>
            </div>
          </div>
        </div>
        
        {/* Right Content - Animated Device Mock */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 relative z-10 animate-float">
          <div className="relative mx-auto max-w-md">
            {/* Mock Device Frame */}
            <div className="relative rounded-2xl overflow-hidden border-8 border-white/5 bg-deep-blue shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=700" 
                alt="MCQ Generator Interface" 
                className="w-full h-auto rounded-lg"
              />
              
              {/* Mock UI Elements */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-blue/90 flex flex-col justify-end p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-3">
                  <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
                  <div className="flex space-x-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-light-teal"></div>
                    <div className="h-3 flex-1 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-white/30"></div>
                    <div className="h-3 flex-1 bg-white/20 rounded"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-white/30"></div>
                    <div className="h-3 flex-1 bg-white/20 rounded"></div>
                  </div>
                </div>
                <div className="bg-gradient-primary rounded-lg p-2 w-full">
                  <div className="h-4 w-24 bg-white/30 rounded mx-auto"></div>
                </div>
              </div>
              
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-light-teal/0 via-light-teal/30 to-light-teal/0 opacity-30 animate-pulse"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-[-20px] right-[-30px] w-20 h-20 bg-gradient-to-br from-neon-pink to-deep-blue rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-15px] left-[-25px] w-16 h-16 bg-gradient-to-br from-light-teal to-deep-blue rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
