
import React, { useState, useEffect } from 'react';
import { Vehicle, User } from '../types';

interface OnboardingProps {
  user: User;
  onComplete: (vehicle: Vehicle) => void;
}

const VehicleOnboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [typing, setTyping] = useState(true);
  const [formData, setFormData] = useState<Vehicle>({
    model: '',
    year: '2023',
    engineCC: '',
    avgDailyKm: 10,
  });

  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 1200);
    return () => clearTimeout(timer);
  }, [step]);

  const handleNext = () => setStep(s => s + 1);

  const steps = [
    {
      q: `High-five, ${user.name.split(' ')[0]}! Let's get your profile synced. What beast are you currently riding?`,
      field: (
        <input
          autoFocus
          className="w-full bg-slate-800 border-b-2 border-blue-500 py-4 px-2 text-2xl font-black text-white outline-none placeholder:text-slate-700"
          placeholder="e.g. Yamaha R1, Honda CB350"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && formData.model && handleNext()}
        />
      ),
      valid: !!formData.model
    },
    {
      q: "Solid choice! What year did this machine roll off the assembly line?",
      field: (
        <select
          autoFocus
          className="w-full bg-slate-800 border-b-2 border-blue-500 py-4 px-2 text-2xl font-black text-white outline-none"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        >
          {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      ),
      valid: true
    },
    {
      q: "And how many kilometers do you usually clock in a day?",
      field: (
        <div className="space-y-4">
           <input
            autoFocus
            type="range"
            min="1"
            max="200"
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            value={formData.avgDailyKm}
            onChange={(e) => setFormData({ ...formData, avgDailyKm: parseInt(e.target.value) })}
          />
          <div className="text-4xl font-black text-blue-400 text-center">{formData.avgDailyKm} KM</div>
        </div>
      ),
      valid: true
    },
    {
      q: "Last one—what's the engine displacement (CC)?",
      field: (
        <input
          autoFocus
          className="w-full bg-slate-800 border-b-2 border-blue-500 py-4 px-2 text-2xl font-black text-white outline-none placeholder:text-slate-700"
          placeholder="e.g. 150, 350, 1000"
          value={formData.engineCC}
          onChange={(e) => setFormData({ ...formData, engineCC: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && formData.engineCC && onComplete(formData)}
        />
      ),
      valid: !!formData.engineCC
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-500" style={{ width: `${(step / steps.length) * 100}%` }}></div>

        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Gearhead AI Agent</p>
              <h3 className="text-white font-bold">Smart Onboarding</h3>
            </div>
          </div>

          <div className="min-h-[120px]">
            {typing ? (
              <div className="flex gap-2 p-4 bg-slate-800/50 rounded-2xl w-fit animate-pulse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full delay-75"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full delay-150"></div>
              </div>
            ) : (
              <h2 className="text-3xl font-black text-white leading-tight animate-in fade-in slide-in-from-left-4">
                {currentStep.q}
              </h2>
            )}
          </div>

          {!typing && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              {currentStep.field}
              
              <button
                disabled={!currentStep.valid}
                onClick={() => step === steps.length ? onComplete(formData) : handleNext()}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 shadow-xl shadow-blue-900/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {step === steps.length ? 'Finalize Profile' : 'Next Step'}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleOnboarding;
