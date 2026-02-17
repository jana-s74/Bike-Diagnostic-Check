
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MaintenanceForm from './components/MaintenanceForm';
import AnalysisCard from './components/AnalysisCard';
import HistoryList from './components/HistoryList';
import { MaintenanceFormData, AnalysisResult, HistoryItem } from './types';
import { analyzeBikeMaintenance } from './services/geminiService';

const HISTORY_KEY = 'bike_diagnostic_history';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY) || localStorage.getItem('gobuddy_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleSubmit = async (data: MaintenanceFormData) => {
    setLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await analyzeBikeMaintenance(data);
      setCurrentResult(result);

      const newHistoryItem: HistoryItem = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        analysis: result,
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

    } catch (err: any) {
      setError("AI diagnosis failed. Please check your connection or API key and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      localStorage.removeItem('gobuddy_history');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentResult(item.analysis);
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="space-y-10">
        <div className="flex gap-2 p-1.5 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-2xl w-fit mx-auto lg:mx-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === 'new' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Service Log
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
               <MaintenanceForm onSubmit={handleSubmit} isLoading={loading} />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {error && (
                <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-rose-400 text-sm flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-2 bg-rose-500/20 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              {loading && !currentResult && (
                <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[2rem]">
                   <div className="relative">
                      <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
                      <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      </div>
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-widest">Running Simulation</h3>
                     <p className="text-slate-500 text-sm font-bold uppercase mt-2 tracking-[0.2em]">Engaging AI Mechanic...</p>
                   </div>
                </div>
              )}

              {currentResult && !loading ? (
                <AnalysisCard result={currentResult} />
              ) : (
                !loading && !error && (
                  <div className="hidden lg:flex flex-col items-center justify-center h-full min-h-[500px] text-center p-12 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[2rem] space-y-4">
                     <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-black text-slate-600 uppercase tracking-widest">Waiting for Data</h3>
                        <p className="text-slate-500 text-sm font-medium">Complete the form to start your instant diagnostic report.</p>
                     </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full">
            <HistoryList
              history={history}
              onSelectItem={handleSelectHistory}
              onClear={clearHistory}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
