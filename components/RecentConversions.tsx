import React from 'react';
import { ConversionDocument, ConversionStatus, Platform } from '../types';
import { FileText, File, Download, Trash2, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface RecentConversionsProps {
  conversions: ConversionDocument[];
  onDelete: (id: string) => void;
}

export const RecentConversions: React.FC<RecentConversionsProps> = ({ conversions, onDelete }) => {
  const formatCreatedAt = (isoDate: string) => {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }

    // Use fixed locale + timezone to keep SSR/client output consistent.
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };
  
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.CHATGPT: return <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">GPT</div>;
      case Platform.CLAUDE: return <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">CL</div>;
      case Platform.GROK: return <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">X</div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><File size={14} /></div>;
    }
  };

  const getStatusBadge = (status: ConversionStatus) => {
    switch (status) {
      case ConversionStatus.COMPLETED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={10} /> Ready</span>;
      case ConversionStatus.PROCESSING:
      case ConversionStatus.UPLOADING:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><RefreshCw size={10} className="animate-spin" /> Processing</span>;
      case ConversionStatus.FAILED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle size={10} /> Failed</span>;
    }
  };

  if (conversions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Clock className="text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">No audits yet</h3>
        <p className="mt-1 text-sm text-slate-500">Upload a legacy code package to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Recent Code Audits</h2>
        <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-200">
          {conversions.length} Files
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {conversions.map((conv) => (
          <li key={conv.conversionId} className="p-4 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {getPlatformIcon(conv.platform)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate" title={conv.originalFilename}>
                      {conv.originalFilename}
                    </p>
                    {getStatusBadge(conv.status)}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>{formatCreatedAt(conv.createdAt)}</span>
                    {conv.metadata && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{conv.metadata.messageCount} msgs</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{((conv.metadata.wordCount)/1000).toFixed(1)}k words</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {conv.status === ConversionStatus.COMPLETED && conv.outputFiles && (
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {conv.outputFiles.pdf && (
                      <a 
                        href={conv.outputFiles.pdf}
                        target="_blank"
                        rel="noreferrer"
                        download={`export-${conv.conversionId}.pdf`}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium decoration-0 cursor-pointer" 
                        title="Download PDF"
                      >
                        <FileText size={16} /> PDF
                      </a>
                    )}
                    {conv.outputFiles.docx && (
                      <a 
                        href={conv.outputFiles.docx}
                        target="_blank"
                        rel="noreferrer"
                        download={`export-${conv.conversionId}.docx`}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium decoration-0 cursor-pointer" 
                        title="Download Word Doc"
                      >
                        <File size={16} /> DOCX
                      </a>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={() => onDelete(conv.conversionId)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  title="Delete Record"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
