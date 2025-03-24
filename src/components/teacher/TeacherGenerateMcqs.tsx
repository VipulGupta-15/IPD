import React from 'react';
import {
  FileText,
  MoreVertical,
  Search,
  Filter,
  Edit,
  Trash2,
} from 'lucide-react';

const TeacherGenerateMcqs: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Generate MCQs</h2>
        <p className="text-white/70 mb-6">
          Select a PDF document to generate multiple-choice questions or edit previously generated
          questions.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
            />
            <input
              type="text"
              placeholder="Search documents"
              className="input-glow w-full pl-10"
            />
          </div>
          <button className="btn-outline flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        {/* PDF Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <FileText size={18} className="text-light-teal mr-2" />
                <span className="font-medium group-hover:text-light-teal transition-colors">
                  Physics Chapter 1.pdf
                </span>
              </div>
              <div>
                <button className="text-white/70 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Uploaded today</span>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                  Complete
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">42 MCQs generated</span>
                <button className="text-light-teal text-sm hover:text-white transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <FileText size={18} className="text-light-teal mr-2" />
                <span className="font-medium group-hover:text-light-teal transition-colors">
                  Chemistry Unit 3.pdf
                </span>
              </div>
              <div>
                <button className="text-white/70 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Uploaded yesterday</span>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                  Complete
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">35 MCQs generated</span>
                <button className="text-light-teal text-sm hover:text-white transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center">
                <FileText size={18} className="text-light-teal mr-2" />
                <span className="font-medium group-hover:text-light-teal transition-colors">
                  Biology Chapter 5.pdf
                </span>
              </div>
              <div>
                <button className="text-white/70 hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Uploaded 2 days ago</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                  Processing
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">In progress...</span>
                <button className="text-light-teal/50 text-sm cursor-not-allowed">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Questions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Recent Questions</h3>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <h4 className="text-lg font-medium mb-2">What is Newton's first law of motion?</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">
                  Objects at rest stay at rest unless acted upon by a force
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-green-500 bg-green-500/20 mr-3 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white">
                  Objects in motion stay in motion unless acted upon by a force
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">
                  For every action, there is an equal and opposite reaction
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">Force equals mass times acceleration</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">From: Physics Chapter 1.pdf</span>
              <div className="flex space-x-2">
                <button className="text-white/70 hover:text-white transition-colors">
                  <Edit size={16} />
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <h4 className="text-lg font-medium mb-2">What is the chemical formula for water?</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">H₂O₂</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-green-500 bg-green-500/20 mr-3 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white">H₂O</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">HO₂</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                <span className="text-white/70">OH</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">From: Chemistry Unit 3.pdf</span>
              <div className="flex space-x-2">
                <button className="text-white/70 hover:text-white transition-colors">
                  <Edit size={16} />
                </button>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="btn-outline">Load More Questions</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherGenerateMcqs;