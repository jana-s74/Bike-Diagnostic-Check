
import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';

interface AnalysisCardProps {
  result: AnalysisResult;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ result }) => {
  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' };
      case RiskLevel.MEDIUM: return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' };
      case RiskLevel.HIGH: return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', glow: 'shadow-rose-500/10' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', glow: 'shadow-slate-500/10' };
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-500';
  };

  const styles = getRiskStyles(result.riskLevel);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="bg-slate-900/40 border border-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Diagnostic Dashboard Header */}
        <div className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="px-4 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Report Generated</div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Diagnostic ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Analysis Results</h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className={`px-5 py-2 rounded-2xl text-xs font-black border uppercase tracking-widest ${styles.bg} ${styles.color} ${styles.border} ${styles.glow}`}>
                  {result.riskLevel} Risk Level
                </div>
                <div className="px-5 py-2 bg-slate-800/50 border border-white/5 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-widest">
                  Est. Cost: {result.estimatedCostRange}
                </div>
              </div>
            </div>

            {/* Health Score Circular Visualization */}
            <div className="relative w-40 h-40 group">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                 <circle 
                   cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                   strokeDasharray={440} 
                   strokeDashoffset={440 - (440 * result.healthScore) / 100} 
                   className={`${getHealthColor(result.healthScore)} transition-all duration-1000 ease-out`}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className={`text-4xl font-black tracking-tighter ${getHealthColor(result.healthScore)}`}>{result.healthScore}</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Health</span>
               </div>
               <div className="absolute -inset-4 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Content Modules */}
        <div className="p-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Notes Section */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">AI Mechanic Assessment</h3>
               </div>
               <div className="relative">
                 <div className="absolute -top-4 -left-4 text-blue-500/10 scale-150">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8H6v-8h4zm16 0v8h-4v-8h4zm-16 10v6H6v-6h4zm16 0v6h-4v-6h4z" /></svg>
                 </div>
                 <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                   <p className="text-slate-300 text-lg font-medium leading-relaxed italic relative z-10">
                     "{result.summary}"
                   </p>
                 </div>
               </div>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Mandatory Service Path</h3>
               </div>
               <div className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 group hover:border-amber-500/40 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 shadow-lg shadow-amber-950/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-wider mb-2">Next Step Recommendation</h4>
                      <p className="text-amber-200/80 leading-relaxed font-semibold text-lg">
                        {result.nextServiceRecommendation}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Checklist Footer */}
          <div className="pt-10 border-t border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Checklist / Tips</h3>
                   <div className="grid grid-cols-1 gap-3">
                     {result.preventiveTips.map((tip, idx) => (
                       <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                         <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                         <span className="text-slate-300 font-medium text-sm">{tip}</span>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="bg-slate-800/20 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Risk Evaluation</p>
                   <div className={`text-6xl font-black ${styles.color} tracking-tighter mb-2`}>{result.riskLevel}</div>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Maintain Immediate Caution</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
