import React, { useState } from 'react';
import { FileUp, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const TeacherPdfUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [numQuestions, setNumQuestions] = useState('5');
  const [difficulty, setDifficulty] = useState('medium');
  const [testName, setTestName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf' || selectedFile.size > 10 * 1024 * 1024) {
      toast.error('Upload a valid PDF under 10MB');
      return;
    }
    setFile(selectedFile);
    setUploaded(false);
    setTestName(`Test_${selectedFile.name.replace('.pdf', '')}_${Date.now()}`);
  };

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('token');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('num_questions', numQuestions);
      formData.append('difficulty', difficulty);
      formData.append('test_name', testName);

      const response = await axios.post('http://localhost:5001/api/generate-mcqs', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUploaded(true);
        toast.success(`Generated ${response.data.mcqs.length} MCQs`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-light-teal mb-4">Upload PDF</h2>
        <p className="text-white/80 mb-6">Generate MCQs from your PDF documents</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-white/80 mb-1 block">Number of Questions</label>
            <input
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)).toString())}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="text-white/80 mb-1 block">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
              disabled={uploading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="text-white/80 mb-1 block">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
              disabled={uploading}
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center relative">
          {uploaded ? (
            <div className="flex flex-col items-center">
              <Check size={32} className="text-light-teal mb-4" />
              <p className="text-white/80 mb-4">{file?.name} uploaded</p>
              <button
                className="bg-deep-blue/70 text-white py-2 px-4 rounded-lg hover:bg-deep-blue/50 transition-colors"
                onClick={() => { setFile(null); setUploaded(false); setTestName(''); }}
              >
                Upload Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <FileUp size={32} className="text-light-teal mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Drag & Drop PDF</h3>
              <p className="text-white/80 mb-4">or click to browse</p>
              {file && (
                <button
                  className="bg-light-teal text-deep-blue font-semibold py-2 px-4 rounded-lg hover:bg-light-teal/80 transition-colors"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 size={20} className="animate-spin mr-2 inline" /> : 'Generate MCQs'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPdfUpload;