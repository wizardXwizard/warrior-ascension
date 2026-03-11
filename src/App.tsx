import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './components/HomeView';
import { PanicMode } from './components/PanicMode';
import { storage, getTodayStr } from './storage';
import { AppState, getRank, RANKS, WarriorLog, cn } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, AlertTriangle, CheckCircle2, X, ChevronRight, Map as MapIcon } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

export default function App() {
  const [state, setState] = useState<AppState>(storage.load());
  const [activeTab, setActiveTab] = useState('home');
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [showRankModal, setShowRankModal] = useState<typeof RANKS[0] | null>(null);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    storage.save(state);
  }, [state]);

  const handleCheckIn = () => {
    const today = getTodayStr();
    if (state.history[today]) return;

    const newStreak = state.streak + 1;
    const newLongest = Math.max(state.longestStreak, newStreak);
    
    // Check for rank unlock
    const oldRank = getRank(state.streak);
    const newRank = getRank(newStreak);
    
    if (newRank.minDays > oldRank.minDays) {
      setShowRankModal(newRank);
    }

    setState(prev => ({
      ...prev,
      streak: newStreak,
      longestStreak: newLongest,
      history: { ...prev.history, [today]: 'success' },
      lastCheckIn: today,
      startDate: prev.startDate || today,
    }));

    setShowLogModal(true);
  };

  const handleUrgeBeat = () => {
    setState(prev => ({
      ...prev,
      urgesDefeated: prev.urgesDefeated + 1
    }));
  };

  const handleRelapse = () => {
    setShowRelapseModal(true);
  };

  const confirmRelapse = () => {
    const today = getTodayStr();
    setState(prev => ({
      ...prev,
      streak: 0,
      relapseCount: prev.relapseCount + 1,
      history: { ...prev.history, [today]: 'relapse' },
      lastCheckIn: today,
    }));
    setShowRelapseModal(false);
  };

  const handleSaveLog = (log: WarriorLog) => {
    const today = getTodayStr();
    setState(prev => ({
      ...prev,
      logs: { ...prev.logs, [today]: log }
    }));
    setShowLogModal(false);
  };

  const handleReset = () => {
    if (window.confirm("ARE YOU SURE? ALL PROGRESS WILL BE LOST. THIS IS THE ULTIMATE DEFEAT.")) {
      const newState = storage.reset();
      setState(newState);
      setActiveTab('home');
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} onPanic={() => setIsPanicOpen(true)}>
        {activeTab === 'home' && (
          <HomeView 
            state={state} 
            onCheckIn={handleCheckIn} 
            onUrgeBeat={handleUrgeBeat} 
            onRelapse={handleRelapse} 
          />
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-l-4 border-accent-red pl-3">Tactical Report</h2>
            <div className="grid grid-cols-1 gap-4">
              <StatCard label="Longest Streak" value={`${state.longestStreak} Days`} />
              <StatCard label="Total Battles Won" value={state.urgesDefeated} />
              <StatCard label="Relapse Frequency" value={state.relapseCount} />
              <StatCard label="Completion" value={`${Math.floor((state.streak / 100) * 100)}%`} />
            </div>
            
            <div className="panel-border p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-orbitron text-gray-500">Weekly Performance</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {[...Array(7)].map((_, i) => {
                  const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
                  const status = state.history[date];
                  const height = status === 'success' ? '100%' : status === 'relapse' ? '20%' : '5%';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={cn(
                          "w-full rounded-t-sm transition-all duration-500",
                          status === 'success' ? "bg-accent-red shadow-[0_0_10px_rgba(193,18,31,0.4)]" : 
                          status === 'relapse' ? "bg-gray-700" : "bg-white/5"
                        )}
                        style={{ height }}
                      />
                      <span className="text-[8px] font-orbitron text-gray-600">
                        {format(subDays(new Date(), 6 - i), 'EEE')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-accent-red pl-3">Mission History</h2>
            <div className="space-y-2">
              {Object.entries(state.history).sort((a, b) => b[0].localeCompare(a[0])).map(([date, status]) => (
                <div key={date} className="panel-border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-orbitron">{format(parseISO(date), 'MMMM dd, yyyy')}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {status === 'success' ? 'Mission Success' : 'Mission Failed'}
                    </p>
                  </div>
                  {status === 'success' ? (
                    <CheckCircle2 className="text-accent-red" size={20} />
                  ) : (
                    <AlertTriangle className="text-gray-600" size={20} />
                  )}
                </div>
              ))}
              {Object.keys(state.history).length === 0 && (
                <div className="text-center py-12 text-gray-600 italic">No history recorded.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-l-4 border-accent-red pl-3">Warrior Path</h2>
            <div className="grid grid-cols-10 gap-1.5">
              {[...Array(100)].map((_, i) => {
                const day = i + 1;
                const isCompleted = day <= state.streak;
                const isCurrent = day === state.streak + 1;
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-sm border transition-all duration-500 flex items-center justify-center text-[8px] font-orbitron",
                      isCompleted ? "bg-accent-red border-accent-red shadow-[0_0_8px_rgba(193,18,31,0.5)] text-white" :
                      isCurrent ? "border-accent-red animate-pulse text-accent-red" :
                      "bg-white/5 border-white/10 text-gray-700"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-orbitron text-gray-500 uppercase tracking-widest pt-2">
              <span>Start</span>
              <span>Ascension</span>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-accent-red pl-3">Warrior Logs</h2>
            <div className="space-y-4">
              {(Object.entries(state.logs) as [string, WarriorLog][]).sort((a, b) => b[0].localeCompare(a[0])).map(([date, log]) => (
                <div key={date} className="panel-border p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-orbitron text-accent-red">{format(parseISO(date), 'MMM dd')}</span>
                    <div className="flex gap-4">
                      <span className="text-[10px] text-gray-500 uppercase">Mood: <span className="text-white">{log.mood}</span></span>
                      <span className="text-[10px] text-gray-500 uppercase">Energy: <span className="text-white">{log.energy}</span></span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic">"{log.reflection}"</p>
                </div>
              ))}
              {Object.keys(state.logs).length === 0 && (
                <div className="text-center py-12 text-gray-600 italic">No logs recorded.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold border-l-4 border-accent-red pl-3">System Config</h2>
            
            <div className="space-y-4">
              <div className="panel-border p-4 rounded-lg space-y-4">
                <h3 className="text-sm font-orbitron uppercase tracking-widest">Data Management</h3>
                <button onClick={handleReset} className="w-full btn-danger py-3 text-xs">
                  RESET CHALLENGE
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `warrior-ascension-backup-${getTodayStr()}.json`;
                    a.click();
                  }}
                  className="w-full btn-secondary py-3 text-xs"
                >
                  EXPORT DATA
                </button>
              </div>

              <div className="panel-border p-4 rounded-lg space-y-2">
                <h3 className="text-sm font-orbitron uppercase tracking-widest">App Info</h3>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Version</span>
                  <span>2.0.0-TACTICAL</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Platform</span>
                  <span>PWA / Mobile</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>

      <PanicMode isOpen={isPanicOpen} onClose={() => setIsPanicOpen(false)} />

      {/* Rank Unlock Modal */}
      <AnimatePresence>
        {showRankModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-6 max-w-xs"
            >
              <Trophy size={64} className="text-accent-red mx-auto drop-shadow-[0_0_15px_rgba(193,18,31,0.8)]" />
              <div className="space-y-2">
                <p className="text-[10px] font-orbitron text-gray-500 tracking-[0.3em] uppercase">Rank Unlocked</p>
                <h2 className="text-4xl font-black text-accent-red tracking-widest text-glow-red">{showRankModal.name}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                {showRankModal.description}
              </p>
              <button onClick={() => setShowRankModal(null)} className="w-full btn-primary py-4 mt-4">
                CONTINUE ASCENSION
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Relapse Modal */}
      <AnimatePresence>
        {showRelapseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-6 max-w-xs"
            >
              <AlertTriangle size={64} className="text-gray-600 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">RELAPSE DETECTED</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest">The streak will be reset to zero.</p>
              </div>
              
              <div className="panel-border p-4 rounded-lg text-left space-y-3">
                <p className="text-[10px] font-orbitron text-accent-red uppercase">Analysis & Recovery</p>
                <p className="text-xs text-gray-400">Common causes: Stress, boredom, late night scrolling.</p>
                <p className="text-xs text-gray-400">Action: Sleep earlier, exercise, avoid phone after 10pm.</p>
              </div>

              <div className="space-y-3 pt-4">
                <button onClick={confirmRelapse} className="w-full btn-danger py-4">
                  CONFIRM DEFEAT
                </button>
                <button onClick={() => setShowRelapseModal(false)} className="w-full btn-secondary py-3 text-xs">
                  CANCEL (I MISCLICKED)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="panel-border p-6 rounded-xl w-full max-w-xs space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Warrior Log</h2>
                <button onClick={() => setShowLogModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveLog({
                  mood: formData.get('mood') as string,
                  energy: formData.get('energy') as string,
                  reflection: formData.get('reflection') as string,
                });
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-orbitron text-gray-500 uppercase">Mood</label>
                  <select name="mood" className="w-full bg-panel border border-white/10 rounded p-2 text-sm outline-none focus:border-accent-red">
                    <option>Focused</option>
                    <option>Calm</option>
                    <option>Struggling</option>
                    <option>Powerful</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-orbitron text-gray-500 uppercase">Energy</label>
                  <select name="energy" className="w-full bg-panel border border-white/10 rounded p-2 text-sm outline-none focus:border-accent-red">
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                    <option>Depleted</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-orbitron text-gray-500 uppercase">Reflection</label>
                  <textarea 
                    name="reflection" 
                    required
                    placeholder="I controlled my impulses today..."
                    className="w-full bg-panel border border-white/10 rounded p-2 text-sm outline-none focus:border-accent-red h-24 resize-none"
                  />
                </div>
                <button type="submit" className="w-full btn-primary py-3">
                  SAVE LOG
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel-border p-4 rounded-lg flex justify-between items-center">
      <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-bold font-orbitron text-accent-red">{value}</span>
    </div>
  );
}
