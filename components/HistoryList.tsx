
import React from 'react';
import { HistoryItem, RiskLevel } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelectItem, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-slate-900/20 rounded-[2rem] border-2 border-dashed border-white/5 p-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black text-slate-600 uppercase tracking-widest">No Log Data Found</p>
          <p className="text-sm text-slate-500 font-medium">Your diagnostic history will automatically be archived here.</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case RiskLevel.MEDIUM: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case RiskLevel.HIGH: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in fade-in duration-500">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xl font-black text-white uppercase tracking-widest">Diagnostic Logs</h3>
        <button
          onClick={onClear}
          className="text-xs font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-[0.2em] px-4 py-2 hover:bg-rose-500/10 rounded-lg"
        >
          Purge History
        </button>
      </div>
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
        {history.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item)}
            className="w-full text-left p-6 hover:bg-white/[0.03] transition-all flex items-center justify-between group"
          >
            <div className="space-y-1.5">
              <div className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">
                {item.bikeModel}
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  {item.mileage.toLocaleString()} KM
                </span>
                <span>•</span>
                <span>{new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskColor(item.analysis.riskLevel)}`}>
                {item.analysis.riskLevel}
              </div>
              <div className="text-2xl font-black text-slate-700 group-hover:text-blue-500/50 transition-colors tabular-nums">
                {item.analysis.healthScore}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
