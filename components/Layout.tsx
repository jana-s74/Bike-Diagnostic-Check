
import React, { useState, useEffect } from 'react';
import { User, Notification } from '../types';
import { db } from '../services/dbService';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      const load = async () => {
        const data = await db.getNotifications(user.id);
        setNotifications(data);
      };
      load();
      const interval = setInterval(load, 10000); // Polling simulation
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifs = async () => {
    setShowNotifs(!showNotifs);
    if (user && !showNotifs) {
      await db.markNotifsAsRead(user.id);
      const data = await db.getNotifications(user.id);
      setNotifications(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative bg-slate-900 p-2.5 rounded-xl border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">GoBuddy <span className="text-blue-500">AI</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {user && (
               <>
                <div className="relative">
                  <button 
                    onClick={handleOpenNotifs}
                    className="p-3 hover:bg-white/5 rounded-xl transition-colors relative"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-950 text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div className="absolute top-16 right-0 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">System Notifications</h4>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">No Alerts</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}>
                              <p className="text-xs font-black text-white mb-1">{n.title}</p>
                              <p className="text-[10px] text-slate-400 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:block text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.name}</p>
                    <button onClick={onLogout} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase">Sign Out</button>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 p-0.5 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=3b82f6`} alt="Avatar" />
                </div>
               </>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pb-32">
        {children}
      </main>

      <footer className="py-12 border-t border-white/5 bg-slate-950/40 text-center">
        <p className="text-slate-600 text-[10px] font-black tracking-[0.4em] uppercase">GoBuddy AI &bull; Smart Maintenance Ecosystem</p>
      </footer>
    </div>
  );
};

export default Layout;
