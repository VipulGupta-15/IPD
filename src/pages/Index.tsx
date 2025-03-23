
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileUp, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  Shield, 
  ChevronRight 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/ui/ParticleBackground';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-deep-blue text-white overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 relative" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-white/10 backdrop-blur-md text-light-teal px-4 py-1 rounded-full text-sm font-medium mb-4">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform the way you create and manage <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">assessments</span>
            </h2>
            <p className="text-white/70 text-lg">
              Our platform offers a seamless experience for both teachers and students with powerful features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={FileUp}
              title="Upload PDF"
              description="Simply upload your PDF documents and let our AI analyze the content."
              details={[
                "Supports multiple file formats including PDF, DOCX, and TXT",
                "Secure file storage with encryption",
                "Instant text extraction with OCR capability",
                "Unlimited storage for premium users"
              ]}
              delay={100}
            />
            <FeatureCard 
              icon={FileText}
              title="Generate MCQs"
              description="Instantly transform the content into high-quality multiple-choice questions."
              details={[
                "AI-powered question generation based on content",
                "Customizable difficulty levels",
                "Question categorization by topics and subtopics",
                "Manual editing options for fine-tuning"
              ]}
              delay={200}
            />
            <FeatureCard 
              icon={Users}
              title="Student Management"
              description="Easily manage student accounts and track their performance."
              details={[
                "Create and manage student groups",
                "Bulk import students via CSV",
                "Detailed performance analytics",
                "Progress tracking across multiple assessments"
              ]}
              delay={300}
            />
            <FeatureCard 
              icon={Clock}
              title="Schedule Tests"
              description="Set up timed assessments and distribute them to your students."
              details={[
                "Flexible scheduling options",
                "Automatic reminders for students",
                "Time-restricted test access",
                "Randomized question order options"
              ]}
              delay={400}
            />
            <FeatureCard 
              icon={CheckCircle2}
              title="Automatic Grading"
              description="Tests are graded instantly, saving you hours of manual work."
              details={[
                "Real-time grading as students complete tests",
                "Detailed score breakdowns by categories",
                "Customizable grading scales",
                "Export results in multiple formats"
              ]}
              delay={500}
            />
            <FeatureCard 
              icon={Shield}
              title="Secure Platform"
              description="Your data is encrypted and protected with enterprise-grade security."
              details={[
                "End-to-end encryption for all data",
                "GDPR and FERPA compliance",
                "Regular security audits",
                "Advanced anti-cheating measures for tests"
              ]}
              delay={600}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-blue via-deep-blue/90 to-deep-blue z-[-1]"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-white/10 backdrop-blur-md text-light-teal px-4 py-1 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-white/70 text-lg">
              Our platform is designed to make the assessment creation process as simple as possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-light-teal via-white to-neon-pink transform -translate-y-1/2 z-0"></div>
            
            {/* Step 1 */}
            <div className="glass-card p-8 text-center relative z-10 opacity-0 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Upload Content</h3>
              <p className="text-white/70">
                Upload your PDF document to our secure platform
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="glass-card p-8 text-center relative z-10 opacity-0 animate-fade-in animate-delay-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-light-teal flex items-center justify-center mb-4 mx-auto">
                <span className="text-deep-blue font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Generate Questions</h3>
              <p className="text-white/70">
                Our AI analyzes the content and creates tailored MCQs
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="glass-card p-8 text-center relative z-10 opacity-0 animate-fade-in animate-delay-400">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-pink to-deep-blue flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">Distribute & Assess</h3>
              <p className="text-white/70">
                Share with students and get instant results
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-light-teal/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Ready to transform your assessments?</h2>
                <p className="text-white/70 text-lg mb-6 md:mb-0 max-w-xl">
                  Join thousands of educators who are saving time and improving learning outcomes with our platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="btn-primary group"
                >
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
