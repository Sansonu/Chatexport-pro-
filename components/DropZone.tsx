import React, { useCallback, useState } from 'react';
import { UploadCloud, FileJson, FileCode, Loader2, AlertCircle, Link as LinkIcon, ArrowRight } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onUrlSelect: (url: string) => void;
  isProcessing: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, onUrlSelect, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcess(file);
    }
  }, [isProcessing]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcess(file);
    }
  }, []);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!urlInput.trim()) return;

    // Basic validation for Claude/ChatGPT links
    if (!urlInput.includes('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    onUrlSelect(urlInput);
    setUrlInput('');
  };

  const validateAndProcess = (file: File) => {
    const validTypes = ['.json', '.txt', '.html', '.zip'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (validTypes.includes(extension)) {
      onFileSelect(file);
    } else {
      setError(`Unsupported file type. Please upload ${validTypes.join(', ')}`);
    }
  };

  return (
    <div className="w-full">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center group
          ${isProcessing ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' : 
            isDragOver ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
        `}
      >
        {/* File Input Overlay */}
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" 
          onChange={handleFileInput}
          disabled={isProcessing}
          accept=".json,.txt,.html,.zip"
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none relative z-20">
          {isProcessing ? (
            <div className="flex flex-col items-center animate-pulse">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-lg font-medium text-slate-700">Processing Content...</p>
              <p className="text-sm text-slate-500">Generating PDF & DOCX</p>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-colors ${isDragOver ? 'bg-blue-200' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
                <UploadCloud className={`h-8 w-8 ${isDragOver ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-700">
                  Drop your chat export here
                </p>
                <p className="text-sm text-slate-500">
                  Supports JSON, ZIP, HTML
                </p>
              </div>
              <div className="flex gap-2 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1"><FileJson size={12}/> JSON</span>
                <span className="flex items-center gap-1"><FileCode size={12}/> HTML</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* URL Import Section */}
      <div className="mt-6">
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Or import from link</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleUrlSubmit} className="mt-2 flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isProcessing}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
              placeholder="https://claude.ai/share/..."
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !urlInput.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Import
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-500">
          Supports shared links from Claude.ai and ChatGPT.com
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fade-in">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};