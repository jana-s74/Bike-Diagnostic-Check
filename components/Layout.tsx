
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative bg-slate-900 p-2.5 rounded-xl border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Bike Diagnostic <span className="text-blue-500">Check</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Next-Gen Maintenance</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-full">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25"></div>
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">AI Core Online</span>
          </div>
        </div>
      </header>

      {/* AI Assistant Intro Section */}
      <div className="max-w-6xl mx-auto px-4 w-full mt-8 mb-4">
        <div className="flex items-center gap-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl backdrop-blur-sm">
          <div className="relative shrink-0">
             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
               </svg>
             </div>
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-950 rounded-full"></div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Hey, I'm Gearhead.</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              I'm your virtual mechanic assistant. Tell me about your bike, and I'll run a full diagnostic to identify risks, estimate costs, and track health instantly.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-32">
        {children}
      </main>

      <footer className="py-8 border-t border-white/5 bg-slate-950/80 text-center">
        <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Bike Diagnostic Check . Made by jana
        </p>
      </footer>
    </div>
  );
};

export default Layout;
