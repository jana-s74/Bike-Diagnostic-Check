
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/dbService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'google' | 'phone'>('google');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'number' | 'otp'>('number');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Secure Access Gateway');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatus('Contacting Google Auth...');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));
    
    setStatus('Database Synchronization...');
    const userData = await db.syncUser({
      id: 'goog_1029384756', // Fixed for demo
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      method: 'google'
    });

    setStatus(`Welcome, ${userData.name}`);
    setTimeout(() => onLogin(userData), 800);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setStatus('Requesting OTP...');
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      setStatus('Validation Required');
    }, 1000);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    setStatus('Verifying Token...');

    await new Promise(r => setTimeout(r, 1000));
    setStatus('Retrieving System Profile...');
    
    const userData = await db.syncUser({
      id: `phn_${phone}`,
      name: `Rider ${phone.slice(-4)}`,
      phone: phone,
      method: 'phone'
    });

    setStatus('Identity Confirmed');
    setTimeout(() => onLogin(userData), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
          <div className="text-center space-y-4 mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 transform rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">
              GoBuddy <span className="text-blue-500">AI</span>
            </h1>
            <p className={`text-xs font-bold uppercase tracking-[0.3em] transition-all ${loading ? 'text-blue-400' : 'text-slate-500'}`}>
              {status}
            </p>
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl mb-8 border border-white/5">
            <button 
              disabled={loading}
              onClick={() => { setMethod('google'); setStep('number'); }}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'google' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Google
            </button>
            <button 
              disabled={loading}
              onClick={() => setMethod('phone')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Phone
            </button>
          </div>

          {method === 'google' ? (
            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full group relative py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.54-3.54C18.11 1.48 15.3 0 12 0 7.31 0 3.25 2.69 1.28 6.59l4.13 3.21c.96-2.88 3.66-4.76 6.59-4.76z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.85-.07-1.68-.21-2.48H12v4.69h6.44c-.28 1.49-1.12 2.76-2.38 3.6l4.12 3.19c2.41-2.22 3.81-5.49 3.81-9z"/>
                      <path fill="#FBBC05" d="M5.41 14.79c-.25-.76-.39-1.57-.39-2.41s.14-1.65.39-2.41L1.28 6.59C.46 8.21 0 10.04 0 12s.46 3.79 1.28 5.41l4.13-3.21z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-4.12-3.19c-1.07.72-2.44 1.14-3.82 1.14-2.93 0-5.42-1.98-6.31-4.66l-4.13 3.21C3.25 21.31 7.31 24 12 24z"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {step === 'number' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mobile</label>
                    <input
                      required
                      disabled={loading}
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl outline-none text-white font-black tracking-widest placeholder:text-slate-600"
                      placeholder="00000 00000"
                    />
                  </div>
                  <button
                    disabled={phone.length < 10 || loading}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-500 transition-all disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Code</label>
                    <input
                      required
                      autoFocus
                      disabled={loading}
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full py-5 bg-slate-800/50 border border-white/10 rounded-2xl outline-none text-white text-3xl font-black tracking-[1em] text-center"
                      placeholder="0000"
                    />
                  </div>
                  <button
                    disabled={otp.length < 4 || loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500"
                  >
                    Verify & Login
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
