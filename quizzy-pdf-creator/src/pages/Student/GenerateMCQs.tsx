import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, List, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import FuturisticCard from '@/components/FuturisticCard';
import FuturisticButton from '@/components/FuturisticButton';
import FuturisticInput from '@/components/FuturisticInput';
import FileUpload from '@/components/FileUpload';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadPDF, generateMCQs, MCQ } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const generateSchema = z.object({
  testName: z.string().min(3, 'Test name must be at least 3 characters'),
  numQuestions: z.coerce.number().min(1).max(20),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

const GenerateMCQs: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPath, setPdfPath] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMCQs, setGeneratedMCQs] = useState<MCQ[]>([]);
  const [step, setStep] = useState<'upload' | 'generate' | 'results'>('upload');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      numQuestions: 5,
      difficulty: 'medium',
    },
  });

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      const userRole = localStorage.getItem('userRole') as 'student' | 'teacher' | null;

      if (!userRole || (userRole !== 'student' && userRole !== 'teacher')) {
        toast.error('User role is missing or invalid');
        return;
      }

      const response = await uploadPDF(pdfFile, userRole);
      setPdfPath(response.pdf_path);
      setStep('generate');
      toast.success('PDF uploaded successfully');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: GenerateFormValues) => {
    if (!pdfPath || !pdfFile) {
      toast.error('Please upload a PDF file first');
      return;
    }

    try {
      setIsGenerating(true);
      const userRole = localStorage.getItem('userRole') as 'student' | 'teacher' | null;

      if (!userRole || (userRole !== 'student' && userRole !== 'teacher')) {
        toast.error('User role is missing or invalid');
        return;
      }

      const response = await generateMCQs(
        pdfPath,
        pdfFile.name,
        data.numQuestions,
        data.difficulty,
        data.testName,
        userRole
      );
      console.log('Generate MCQs response:', response);

      if (userRole === 'student') {
        // Redirect students to TakeTest
        toast.success('MCQs generated! Starting your practice test...');
        navigate(`/student/take-test/${data.testName}`);
      } else {
        // Show results to teachers
        setGeneratedMCQs(response.mcqs);
        setStep('results');
        toast.success('MCQs generated successfully');
      }

      if (response.warning) {
        toast.warning(response.warning);
      }
    } catch (error) {
      console.error('Error generating MCQs:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate MCQs');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FuturisticCard className="mb-6">
              <h3 className="text-xl font-bold text-softWhite mb-6">Upload PDF</h3>
              <div className="mb-6">
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
              <div className="flex justify-end">
                <FuturisticButton
                  onClick={handleUpload}
                  isLoading={isUploading}
                  icon={<FileUp size={18} />}
                  disabled={!pdfFile}
                >
                  Upload PDF
                </FuturisticButton>
              </div>
            </FuturisticCard>
          </motion.div>
        );

      case 'generate':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FuturisticCard className="mb-6">
              <h3 className="text-xl font-bold text-softWhite mb-6">Generate MCQs</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center mb-6 p-3 rounded-lg bg-neonCyan/10 border border-neonCyan/20">
                  <CheckCircle size={20} className="text-neonCyan mr-3" />
                  <div className="flex-1">
                    <p className="text-softWhite">PDF uploaded successfully</p>
                    <p className="text-sm text-softWhite/60">{pdfFile?.name}</p>
                  </div>
                </div>
                <FuturisticInput
                  label="Test Name"
                  placeholder="Enter a name for this test"
                  error={errors.testName?.message}
                  {...register('testName')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FuturisticInput
                    label="Number of Questions"
                    type="number"
                    placeholder="Enter number of questions"
                    min={1}
                    max={20}
                    error={errors.numQuestions?.message}
                    {...register('numQuestions')}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-softWhite/80 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      className="futuristic-input w-full"
                      {...register('difficulty')}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {errors.difficulty?.message && (
                      <p className="text-neonPink text-sm mt-1">{errors.difficulty.message}</p>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-deepBlue border border-neonCyan/10">
                  <div className="flex items-start">
                    <AlertCircle size={20} className="text-neonCyan mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-softWhite mb-1">Important Notes</p>
                      <ul className="text-sm text-softWhite/70 space-y-1 list-disc pl-5">
                        <li>Generation may take 30-60 seconds depending on PDF size</li>
                        <li>Questions are filtered for relevance (score {'>'} 0.7)</li>
                        <li>Maximum of 20 questions can be generated at once</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <FuturisticButton
                    type="button"
                    variant="outline"
                    onClick={() => setStep('upload')}
                  >
                    Back
                  </FuturisticButton>
                  <FuturisticButton
                    type="submit"
                    isLoading={isGenerating}
                    icon={<List size={18} />}
                  >
                    {localStorage.getItem('userRole') === 'student' ? 'Generate and Start Test' : 'Generate MCQs'}
                  </FuturisticButton>
                </div>
              </form>
            </FuturisticCard>
          </motion.div>
        );

      case 'results':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FuturisticCard className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-softWhite">Generated MCQs</h3>
                <div className="flex items-center text-sm text-softWhite/70">
                  <Clock size={16} className="mr-1" />
                  <span>Generated {new Date().toLocaleString()}</span>
                </div>
              </div>
              <div className="mb-6 p-4 rounded-lg bg-deepBlue border border-neonCyan/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-softWhite/50">PDF Name</p>
                    <p className="text-sm text-softWhite truncate">{pdfFile?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-softWhite/50">Questions</p>
                    <p className="text-sm text-softWhite">{generatedMCQs.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-softWhite/50">Relevance Score</p>
                    <p className="text-sm text-softWhite">
                      {generatedMCQs.length > 0
                        ? `${Math.round(
                            generatedMCQs.reduce((sum, mcq) => sum + mcq.relevance_score, 0) /
                              generatedMCQs.length * 100
                          )}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-softWhite/50">Difficulty</p>
                    <p className="text-sm text-softWhite capitalize">
                      {generatedMCQs.length > 0 ? generatedMCQs[0].difficulty : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {generatedMCQs.map((mcq, qIndex) => (
                  <div
                    key={qIndex}
                    className="p-4 rounded-lg bg-deepBlue/50 border border-neonCyan/10"
                  >
                    <div className="flex justify-between mb-3">
                      <span className="text-neonCyan font-medium">Question {qIndex + 1}</span>
                      <div className="flex items-center">
                        <span className="text-xs bg-neonCyan/10 text-neonCyan rounded-full px-2 py-0.5 mr-2">
                          {mcq.type}
                        </span>
                        <span className="text-xs bg-neonCyan/10 text-neonCyan rounded-full px-2 py-0.5">
                          Relevance: {(mcq.relevance_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-softWhite mb-4">{mcq.question}</p>
                    <div className="space-y-2">
                      {mcq.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-center p-2 rounded-md ${
                            option === mcq.correct_answer
                              ? 'bg-neonCyan/10 border border-neonCyan/30'
                              : 'bg-deepBlue/30 border border-softWhite/10'
                          }`}
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-deepBlue border border-softWhite/30 flex items-center justify-center mr-3">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span
                            className={
                              option === mcq.correct_answer ? 'text-neonCyan' : 'text-softWhite/80'
                            }
                          >
                            {option}
                          </span>
                          {option === mcq.correct_answer && (
                            <CheckCircle size={16} className="ml-auto text-neonCyan" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t border-neonCyan/10">
                <FuturisticButton
                  variant="outline"
                  onClick={() => {
                    setStep('upload');
                    setPdfFile(null);
                    setPdfPath('');
                    setGeneratedMCQs([]);
                  }}
                >
                  Generate New MCQs
                </FuturisticButton>
              </div>
            </FuturisticCard>
          </motion.div>
        );
    }
  };

  return (
    <DashboardLayout title="Generate MCQs">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-softWhite">Generate MCQs</h2>
          <div className="flex space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                step === 'upload' ? 'bg-neonCyan text-deepBlue' : 'bg-neonCyan/20 text-neonCyan'
              }`}
            >
              <span className="mr-1">1</span>
              <span>Upload</span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                step === 'generate' ? 'bg-neonCyan text-deepBlue' : 'bg-neonCyan/20 text-neonCyan'
              }`}
            >
              <span className="mr-1">2</span>
              <span>Configure</span>
            </div>
            {localStorage.getItem('userRole') === 'teacher' && (
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                  step === 'results' ? 'bg-neonCyan text-deepBlue' : 'bg-neonCyan/20 text-neonCyan'
                }`}
              >
                <span className="mr-1">3</span>
                <span>Results</span>
              </div>
            )}
          </div>
        </div>
        {renderStepContent()}
      </div>
    </DashboardLayout>
  );
};

export default GenerateMCQs;