
import React, { useState } from 'react';
import { MaintenanceFormData, RidingType } from '../types';

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormData) => void;
  isLoading: boolean;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    bikeModel: '',
    mileage: 0,
    lastServiceDate: '',
    symptoms: '',
    ridingType: RidingType.MIXED,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mileage' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bikeModel || !formData.mileage) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
         </svg>
      </div>

      <div className="space-y-2 relative z-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-sm">1</span>
          New Diagnosis
        </h2>
        <p className="text-slate-400 text-sm font-medium">Enter your bike details for an instant AI analysis.</p>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Bike Model</label>
          <input
            required
            type="text"
            name="bikeModel"
            value={formData.bikeModel}
            onChange={handleChange}
            placeholder="e.g. Royal Enfield Classic 350"
            className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Current Mileage (km)</label>
            <input
              required
              type="number"
              name="mileage"
              value={formData.mileage || ''}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Last Service</label>
            <input
              required
              type="date"
              name="lastServiceDate"
              value={formData.lastServiceDate}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white font-medium color-scheme-dark"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Riding Style</label>
          <select
            name="ridingType"
            value={formData.ridingType}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white font-medium appearance-none cursor-pointer"
          >
            <option value={RidingType.CITY}>City Commuting</option>
            <option value={RidingType.HIGHWAY}>Highway Cruising</option>
            <option value={RidingType.MIXED}>Mixed Usage</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Symptoms / Issues</label>
          <textarea
            name="symptoms"
            rows={4}
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe any noises, vibrations, or performance issues..."
            className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 font-medium resize-none"
          ></textarea>
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={`w-full group relative py-5 px-8 rounded-2xl font-black text-white transition-all overflow-hidden ${
          isLoading ? 'bg-slate-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-950 hover:-translate-y-0.5'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="uppercase tracking-[0.2em] text-sm">Processing Data...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="uppercase tracking-[0.2em] text-sm">Run Diagnostic</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default MaintenanceForm;
