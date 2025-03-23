import React, { useState } from 'react';
import { FileUp, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { PdfUploadProps, MCQ } from '../../types';

const PdfUpload: React.FC<PdfUploadProps> = ({ onMcqsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [numQuestions, setNumQuestions] = useState('5');
  const [difficulty, setDifficulty] = useState('medium');
  const [testName, setTestName] = useState<string>(''); // Add testName state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setUploaded(false);
    setMcqs([]);
    setTestName(`Test_${selectedFile.name.replace('.pdf', '')}_${Date.now()}`); // Generate a unique test name
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to generate MCQs');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('num_questions', numQuestions);
      formData.append('difficulty', difficulty);
      formData.append('test_name', testName); // Include testName in the request

      const response = await axios.post(
        'http://localhost:5001/api/generate-mcqs',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // Include JWT token
          },
        }
      );

      const data = response.data;

      if (data.success && data.mcqs) {
        setMcqs(data.mcqs);
        setUploaded(true);
        toast.success(`Generated ${data.mcqs.length} MCQs from ${file.name}!`);
      } else {
        throw new Error(data.error || 'Failed to generate MCQs');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      toast.error(`Upload failed: ${errorMessage}`);
      setMcqs([]);
      setUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  const handleStartTest = () => {
    if (!uploaded || mcqs.length === 0) {
      toast.error('Please upload a PDF and generate MCQs first');
      return;
    }

    const generatedTestName = testName; // Use the testName sent to the backend
    onMcqsGenerated(mcqs, generatedTestName);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Upload PDF Document</h2>
        <p className="text-white/70 mb-6">
          Upload your study materials in PDF format to generate a personalized test. 
          Once generated, start the test directly to assess your knowledge.
        </p>

        <div className="mb-6 space-y-4">
          <div>
            <label className="text-white/70 mb-2 block">Number of Questions (1-20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)).toString())}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="text-white/70 mb-2 block">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white"
              disabled={uploading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="text-white/70 mb-2 block">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white"
              disabled={uploading}
              placeholder="Enter a name for this test"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-dashed border-white/20 rounded-lg p-8 mb-6 text-center">
          {uploaded ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-light-teal/20 flex items-center justify-center mb-4">
                <Check size={24} className="text-light-teal" />
              </div>
              <h3 className="text-lg font-medium mb-2">File Uploaded Successfully</h3>
              <p className="text-white/70 mb-4 max-w-md mx-auto">{file?.name}</p>
              <div className="flex gap-4">
                <button
                  className="btn-outline text-white/70 hover:text-white underline text-sm"
                  onClick={() => {
                    setFile(null);
                    setUploaded(false);
                    setMcqs([]);
                    setTestName('');
                  }}
                >
                  Upload a different file
                </button>
                <button
                  className="btn-primary"
                  onClick={handleStartTest}
                >
                  {`Start ${testName}`}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <FileUp size={28} className="text-white/70" />
              </div>
              <h3 className="text-lg font-medium mb-2">Drop your PDF file here</h3>
              <p className="text-white/70 mb-4 max-w-md mx-auto">
                Supported format: PDF only. Maximum file size: 10MB.
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <input
                  type="file"
                  id="pdfUpload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label
                  htmlFor="pdfUpload"
                  className="btn-outline cursor-pointer"
                >
                  Select File
                </label>

                {file && (
                  <button
                    className="btn-primary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Upload & Generate'
                    )}
                  </button>
                )}
              </div>

              {file && (
                <div className="mt-4 text-light-teal flex items-center justify-center">
                  <Check size={16} className="mr-2" />
                  {file.name}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {uploaded && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-medium mb-4">How it works</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0">
                <span className="text-light-teal">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Upload PDF</h4>
                <p className="text-white/70">Upload your study materials in PDF format.</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0">
                <span className="text-light-teal">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">AI Processing</h4>
                <p className="text-white/70">Our AI analyzes the content to create questions.</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0">
                <span className="text-light-teal">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Start Test</h4>
                <p className="text-white/70">Begin your timed test immediately.</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0">
                <span className="text-light-teal">4</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">Review & Results</h4>
                <p className="text-white/70">Review your answers and see your performance.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;