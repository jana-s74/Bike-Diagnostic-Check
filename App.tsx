
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MaintenanceForm from './components/MaintenanceForm';
import AnalysisCard from './components/AnalysisCard';
import HistoryList from './components/HistoryList';
import LoginPage from './components/LoginPage';
import VehicleOnboarding from './components/VehicleOnboarding';
import { MaintenanceFormData, AnalysisResult, HistoryItem, User, SystemSnapshot, Vehicle } from './types';
import { analyzeBikeMaintenance } from './services/geminiService';
import { db } from './services/dbService';

const AUTH_KEY = 'gobuddy_auth_session';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'monitor'>('new');
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        const parsedUser = JSON.parse(savedAuth);
        setUser(parsedUser);
        loadUserData(parsedUser.id);
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setAuthLoading(false);
  }, []);

  const loadUserData = async (userId: string) => {
    const userHistory = await db.getUserHistory(userId);
    setHistory(userHistory);
    setSnapshot(db.getSystemSnapshot());
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    loadUserData(newUser.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    setHistory([]);
    setActiveTab('new');
  };

  const handleVehicleSetup = async (vehicle: Vehicle) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await db.updateVehicle(user.id, vehicle);
      setUser(updatedUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      
      await db.addNotification(user.id, {
        title: 'Vehicle Sync Successful',
        message: `Your ${vehicle.model} has been successfully registered. Gearhead AI is now monitoring your maintenance cycle.`,
        type: 'success'
      });
    } catch (e) {
      setError("Failed to sync vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: MaintenanceFormData) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeBikeMaintenance(data);
      setCurrentResult(result);

      const newHistoryItem: HistoryItem = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        timestamp: Date.now(),
        analysis: result,
      };

      await db.saveDiagnostic(newHistoryItem);
      
      if (result.healthScore < 50) {
        await db.addNotification(user.id, {
          title: 'Critical Health Alert',
          message: `Diagnostic for ${data.bikeModel} shows a health score of ${result.healthScore}. Please review the recommended actions.`,
          type: 'warning'
        });
      }

      const updatedHistory = await db.getUserHistory(user.id);
      setHistory(updatedHistory);
      setSnapshot(db.getSystemSnapshot());

    } catch (err: any) {
      setError("AI diagnosis failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;
  if (!user) return <LoginPage onLogin={handleLogin} />;
  
  // Show Onboarding if no vehicle is configured
  if (!user.vehicle) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <VehicleOnboarding user={user} onComplete={handleVehicleSetup} />
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-10">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-2xl w-fit mx-auto lg:mx-0">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'new' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Logs ({history.length})
          </button>
          {user.isAdmin && (
            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'monitor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Monitor
            </button>
          )}
        </div>

        {activeTab === 'monitor' && snapshot && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
            {[
              { label: 'Registered Riders', val: snapshot.totalUsers },
              { label: 'Global Analyses', val: snapshot.totalDiagnostics },
              { label: 'Active (24h)', val: snapshot.activeUsers24h }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                <p className="text-4xl font-black text-white">{stat.val}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2">
               <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-3xl mb-6">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Vehicle</p>
                 <h4 className="text-xl font-black text-white">{user.vehicle.model} ({user.vehicle.year})</h4>
                 <p className="text-xs text-slate-400 font-medium">Synced Profile: {user.vehicle.engineCC}CC | ~{user.vehicle.avgDailyKm}km daily</p>
               </div>
               <MaintenanceForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              {loading && (
                <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-6 bg-slate-900/20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                   <h3 className="text-xl font-black text-white uppercase tracking-widest">Saving to Cloud DB...</h3>
                </div>
              )}
              {currentResult && !loading && <AnalysisCard result={currentResult} />}
              {!currentResult && !loading && (
                <div className="h-[500px] flex items-center justify-center text-center p-12 bg-slate-900/10 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Ready for System Scan</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryList
            history={history}
            onSelectItem={(item) => { setCurrentResult(item.analysis); setActiveTab('new'); }}
            onClear={() => {}}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
