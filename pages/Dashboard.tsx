import React, { useState, useEffect } from 'react';
import { DropZone } from '../components/DropZone';
import { RecentConversions } from '../components/RecentConversions';
import { ConversionDocument, ConversionStatus, UserProfile } from '../types';
import { ConversionService } from '../services/mockFirebase';
import { Sparkles, Zap, ShieldCheck, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [conversions, setConversions] = useState<ConversionDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<ConversionStatus | null>(null);

  // Gemini Integration for "Smart Analysis" (Bonus Feature)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadConversions();
  }, [user.uid]);

  const loadConversions = async () => {
    try {
      const data = await ConversionService.getConversions(user.uid);
      setConversions(data);
    } catch (error) {
      console.error("Failed to load conversions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus(ConversionStatus.UPLOADING);

    try {
      const newConversion = await ConversionService.uploadAndConvert(file, user.uid, (status) => {
        setProcessingStatus(status);
      });
      setConversions(prev => [newConversion, ...prev]);
    } catch (error) {
      console.error("Conversion failed", error);
    } finally {
      setIsProcessing(false);
      setProcessingStatus(null);
    }
  };

  const handleUrlSelect = async (url: string) => {
    setIsProcessing(true);
    setProcessingStatus(ConversionStatus.PROCESSING);

    try {
      const newConversion = await ConversionService.convertFromUrl(url, user.uid, (status) => {
        setProcessingStatus(status);
      });
      setConversions(prev => [newConversion, ...prev]);
    } catch (error) {
      console.error("URL Conversion failed", error);
    } finally {
      setIsProcessing(false);
      setProcessingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this conversion record?')) {
      await ConversionService.deleteConversion(id);
      setConversions(prev => prev.filter(c => c.conversionId !== id));
    }
  };

  const runGeminiAnalysis = async () => {
    if(!process.env.API_KEY) {
        setAiAnalysis("Demo Mode: API Key not configured in environment. In a real deployment, this would use Gemini 2.5 Flash to summarize your chat history.");
        return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      // Simulating analyzing the last converted file content
      const response = await ai.models.generateContent({
        model,
        contents: "Summarize the key topics from a hypothetical tech support chat log involving a user asking about React hooks and Firebase.",
      });
      setAiAnalysis(response.text);
    } catch (e) {
      setAiAnalysis("Failed to analyze. Please check API Key configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const downloadAnalysis = (format: 'pdf' | 'docx') => {
    if (!aiAnalysis) return;
    const blob = new Blob([`[MOCK ${format.toUpperCase()} ANALYSIS]\n\n${aiAnalysis}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_summary.${format === 'pdf' ? 'pdf' : 'docx'}`; // Note: This will download a text file named as pdf/docx for demo purposes
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Manage your chat exports and conversions</p>
        </div>
        <div className="flex gap-3">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-emerald-100">
                <ShieldCheck size={12} /> Secure Storage Active
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-blue-100">
                <Zap size={12} /> Cloud Functions Ready
            </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">New Conversion</h2>
        <DropZone 
          onFileSelect={handleFileSelect} 
          onUrlSelect={handleUrlSelect}
          isProcessing={isProcessing} 
        />
        {processingStatus && (
           <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
             <div 
               className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
               style={{ 
                 width: processingStatus === ConversionStatus.UPLOADING ? '30%' : 
                        processingStatus === ConversionStatus.PROCESSING ? '75%' : '100%' 
               }} 
             />
           </div>
        )}
      </div>

       {/* Gemini Feature Demo */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-300" size={20} />
                <h3 className="font-bold text-lg">AI Insight Analysis</h3>
             </div>
             <p className="text-indigo-100 text-sm max-w-xl">
               Use Google Gemini to generate an executive summary of your chat exports automatically.
             </p>
          </div>
          <button 
            onClick={runGeminiAnalysis}
            disabled={isAnalyzing}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-md whitespace-nowrap"
          >
            {isAnalyzing ? 'Analyzing...' : 'Test Analysis'}
          </button>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-900 opacity-20 rounded-full blur-2xl"></div>

        {aiAnalysis && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 text-sm animate-fade-in">
                <div className="flex justify-between items-start mb-2 pb-2 border-b border-white/10">
                    <p className="font-mono text-xs text-indigo-200 self-center">RESPONSE FROM GEMINI 2.5 FLASH:</p>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => downloadAnalysis('pdf')} 
                          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                          title="Download as PDF"
                        >
                          <Download size={12} /> PDF
                        </button>
                        <button 
                          onClick={() => downloadAnalysis('docx')} 
                          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                          title="Download as DOCX"
                        >
                          <Download size={12} /> DOCX
                        </button>
                    </div>
                </div>
                {aiAnalysis}
            </div>
        )}
      </div>

      {/* List Section */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
        </div>
      ) : (
        <RecentConversions conversions={conversions} onDelete={handleDelete} />
      )}

    </div>
  );
};