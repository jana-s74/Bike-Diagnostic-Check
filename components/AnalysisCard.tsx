
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
      <div className="bg-slate-900/40 border border-white/10 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Header Dashboard Area */}
        <div className="p-8 border-b border-white/5 flex flex-wrap gap-8 items-center justify-between bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm">2</span>
              Analysis Results
            </h2>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest ${styles.bg} ${styles.color} ${styles.border} ${styles.glow}`}>
                {result.riskLevel} Risk
              </span>
              <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Diagnostic Complete</span>
            </div>
          </div>
          
          <div className="flex gap-10">
            <div className="text-center">
               <div className={`text-5xl font-black tracking-tighter ${getHealthColor(result.healthScore)}`}>
                 {result.healthScore}<span className="text-lg font-bold text-slate-500">/100</span>
               </div>
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Health Score</div>
               <div className="mt-2 w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
                 <div className={`h-full rounded-full transition-all duration-1000 ${getHealthColor(result.healthScore).replace('text-', 'bg-')}`} style={{ width: `${result.healthScore}%` }}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Main Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Mechanic's Notes</h3>
               </div>
               <div className="bg-slate-950/40 p-6 rounded-3xl border border-white/5 relative">
                 <div className="absolute top-4 left-4 text-blue-500/20">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8v8H6v-8h4zm16 0v8h-4v-8h4zm-16 10v6H6v-6h4zm16 0v6h-4v-6h4z" opacity=".2"/></svg>
                 </div>
                 <p className="text-slate-300 text-lg font-medium leading-relaxed italic relative z-10">
                   "{result.summary}"
                 </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recommended Action</h3>
               </div>
               <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/20 group hover:border-amber-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm uppercase tracking-wider mb-2">Next Service</h4>
                      <p className="text-amber-200/80 leading-relaxed font-medium">
                        {result.nextServiceRecommendation}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
             <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Estimated Service Cost</h3>
               <div className="text-4xl font-black text-white tracking-tight">
                 {result.estimatedCostRange}
               </div>
               <p className="text-xs text-slate-500 font-medium">Based on current market estimates for {result.riskLevel} risk levels.</p>
             </div>

             <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Maintenance Checklist</h3>
               <div className="space-y-2">
                 {result.preventiveTips.map((tip, idx) => (
                   <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 text-sm text-slate-300 font-medium">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                     {tip}
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
