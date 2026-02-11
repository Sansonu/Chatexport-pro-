import React from 'react';
import { Lock, Layout, Zap, Check, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 AI-Powered Legacy Code Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Turn legacy code into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Readable Documentation</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Upload spaghetti codebases and get human-readable architecture docs, inline explanations, and refactoring suggestions your team can actually use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
              >
                Start Documenting <ArrowRight size={20} />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all">
                View Sample Audit
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Layout className="text-blue-600" size={32} />}
              title="Code-to-Context Mapping"
              description="We break down tangled modules into clear components, ownership notes, and dependency relationships."
            />
            <FeatureCard 
              icon={<Lock className="text-emerald-600" size={32} />}
              title="Enterprise Security"
              description="Built for agency workflows with secure uploads, access controls, and auditable processing pipelines."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-600" size={32} />}
              title="Refactor Suggestions"
              description="Generate prioritized improvements with risk notes, effort estimates, and modernization opportunities."
            />
          </div>
        </div>
      </div>

      {/* Pricing / CTA */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to untangle legacy systems?</h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Help your clients move faster with clearer code intelligence, migration roadmaps, and documentation that survives handoffs.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-slate-300 text-sm font-medium mb-10">
              <span className="flex items-center gap-2"><Check className="text-green-400" size={16} /> SOC-ready workflow</span>
              <span className="flex items-center gap-2"><Check className="text-green-400" size={16} /> Multi-repo support</span>
              <span className="flex items-center gap-2"><Check className="text-green-400" size={16} /> Secure & Private</span>
            </div>
            <button 
              onClick={onStart}
              className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors"
            >
              Start Free Legacy Audit
            </button>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
    <div className="p-3 bg-white rounded-xl shadow-sm mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);
