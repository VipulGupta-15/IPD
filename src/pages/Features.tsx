
import React, { useEffect } from 'react';
import { 
  FileUp, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  Shield, 
  ArrowRight,
  Zap,
  Database,
  BarChart4,
  Brain,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/ui/ParticleBackground';
import FeatureCard from '../components/home/FeatureCard';

const Features: React.FC = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-deep-blue text-white overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-white/10 backdrop-blur-md text-light-teal px-4 py-1 rounded-full text-sm font-medium mb-4">
              Platform Features
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful tools for <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">modern education</span>
            </h1>
            <p className="text-white/70 text-lg">
              Our AI-powered platform helps educators create better assessments and provides students with engaging learning experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
          
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-white/10 backdrop-blur-md text-light-teal px-4 py-1 rounded-full text-sm font-medium mb-4">
                Advanced Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                AI-Powered <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">Innovations</span>
              </h2>
              <p className="text-white/70 text-lg">
                Discover the cutting-edge technology that powers our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <Brain size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">Natural Language Processing</h3>
                <p className="text-white/70 mb-6">
                  Our advanced NLP algorithms understand context and nuance, ensuring that generated questions are relevant and accurate.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Context-aware question generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Semantic understanding of complex topics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Multiple languages support</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <Zap size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">Learning Algorithms</h3>
                <p className="text-white/70 mb-6">
                  Our platform continuously adapts to student performance, creating personalized learning experiences.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Adaptive difficulty based on performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Personalized question selection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Reinforcement learning for continuous improvement</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <Database size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">Question Bank Management</h3>
                <p className="text-white/70 mb-6">
                  Build and organize your question library for future use, with powerful categorization and search features.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Hierarchical categorization of questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Advanced search and filtering capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Version control and question history</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-card p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <BarChart4 size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">Analytics Dashboard</h3>
                <p className="text-white/70 mb-6">
                  Gain valuable insights into student performance with comprehensive analytics and visualizations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Real-time performance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Customizable reports and exports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <ArrowRight size={14} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Trend analysis and predictive insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:space-x-12">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">For Educators</h3>
                <p className="text-white/70 mb-6">
                  Our platform empowers teachers to create high-quality assessments in minutes, not hours. 
                  Focus on teaching while we handle the tedious work of creating and grading tests.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Save up to 90% of the time spent creating assessments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Generate questions at various difficulty levels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Receive detailed analytics on student performance</span>
                  </li>
                </ul>
              </div>
              
              <div className="md:w-1/2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-light-teal to-deep-blue flex items-center justify-center mb-4">
                  <Users size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">For Students</h3>
                <p className="text-white/70 mb-6">
                  Students benefit from personalized learning experiences that adapt to their needs.
                  Get instant feedback and track your progress over time.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Practice with targeted questions that match your level</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Receive immediate feedback and explanations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-light-teal/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                      <CheckCircle2 size={16} className="text-light-teal" />
                    </span>
                    <span className="text-white/80">Track your progress and identify areas for improvement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Features;
