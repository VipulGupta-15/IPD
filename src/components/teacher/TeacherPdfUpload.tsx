import React from 'react';
import { FileUp, FileText, MoreVertical } from 'lucide-react';

const TeacherPdfUpload: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Upload PDF Document</h2>
        <p className="text-white/70 mb-6">
          Upload your PDF document to generate multiple-choice questions. Our AI will analyze the
          content and create relevant questions.
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-light-teal transition-colors mb-6 group cursor-pointer relative overflow-hidden animate-pulse-glow">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf"
          />
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-light-teal/20 to-light-teal/10 flex items-center justify-center mb-4">
              <FileUp size={24} className="text-light-teal" />
            </div>
            <h3 className="text-lg font-medium mb-2 group-hover:text-light-teal transition-colors">
              Drag & Drop your PDF here
            </h3>
            <p className="text-white/70 mb-4">or click to browse your files</p>
            <button className="btn-primary">Browse Files</button>
          </div>
        </div>

        <div className="text-white/70 text-sm">
          <p>Supported file: PDF only (Max size: 10MB)</p>
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4">Recent Uploads</h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center flex-1 mb-3 sm:mb-0">
              <FileText size={20} className="text-light-teal mr-3" />
              <div>
                <h4 className="font-medium">Physics Chapter 1.pdf</h4>
                <p className="text-white/70 text-sm">2.4 MB • Uploaded today</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-primary text-sm py-2 px-4">Generate MCQs</button>
              <button className="text-white/70 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center flex-1 mb-3 sm:mb-0">
              <FileText size={20} className="text-light-teal mr-3" />
              <div>
                <h4 className="font-medium">Chemistry Unit 3.pdf</h4>
                <p className="text-white/70 text-sm">1.8 MB • Uploaded yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="border border-light-teal text-light-teal rounded-lg text-sm py-1.5 px-3 hover:bg-light-teal/10 transition-colors">
                View MCQs
              </button>
              <button className="text-white/70 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
            <div className="flex items-center flex-1 mb-3 sm:mb-0">
              <FileText size={20} className="text-light-teal mr-3" />
              <div>
                <h4 className="font-medium">Biology Chapter 5.pdf</h4>
                <p className="text-white/70 text-sm">3.2 MB • Uploaded 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-blue-400 text-sm flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
              <button className="text-white/70 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPdfUpload;