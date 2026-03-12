// import React from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Home, BarChart2, History, Map, BookOpen, Settings, ShieldAlert, X } from 'lucide-react';
// import { cn } from '../types';

// interface NavItemProps {
//   icon: React.ElementType;
//   label: string;
//   active: boolean;
//   onClick: () => void;
// }

// const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
//   <button
//     onClick={onClick}
//     className={cn(
//       "flex flex-col items-center justify-center py-2 px-1 transition-all relative",
//       active ? "text-accent-red" : "text-gray-500 hover:text-gray-300"
//     )}
//   >
//     <Icon size={20} className={cn(active && "drop-shadow-[0_0_8px_rgba(193,18,31,0.8)]")} />
//     <span className="text-[10px] uppercase font-orbitron mt-1 tracking-tighter">{label}</span>
//     {active && (
//       <motion.div
//         layoutId="nav-active"
//         className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-red shadow-[0_0_10px_rgba(193,18,31,0.8)]"
//       />
//     )}
//   </button>
// );

// interface LayoutProps {
//   children: React.ReactNode;
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
//   onPanic: () => void;
// }

// export const Layout = ({ children, activeTab, setActiveTab, onPanic }: LayoutProps) => {
//   return (
//     <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">
//       {/* Header */}
//       <header className="p-4 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-md z-10">
//         <h1 className="text-lg font-black text-glow-red italic">Warrior Ascension</h1>
//         <button
//           onClick={onPanic}
//           className="p-2 rounded-full bg-accent-red/10 border border-accent-red/30 text-accent-red hover:bg-accent-red/20 transition-colors"
//         >
//           <ShieldAlert size={20} />
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//           >
//             {children}
//           </motion.div>
//         </AnimatePresence>
//       </main>

//       {/* Navigation */}
//       <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md grid grid-cols-6 border-t border-white/5 bg-panel/90 backdrop-blur-lg px-2 pb-safe">
//         <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
//         <NavItem icon={BarChart2} label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
//         <NavItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
//         <NavItem icon={Map} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
//         <NavItem icon={BookOpen} label="Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
//         <NavItem icon={Settings} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
//       </nav>
//     </div>
//   );
// };










import React, { useState, useEffect } from 'react';             
import { motion, AnimatePresence } from 'motion/react';
import { Home, BarChart2, History, Map, BookOpen, Settings, ShieldAlert, X } from 'lucide-react';
import { cn } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center py-2 px-1 transition-all relative",
      active ? "text-accent-red" : "text-gray-500 hover:text-gray-300"
    )}
  >
    <Icon size={20} className={cn(active && "drop-shadow-[0_0_8px_rgba(193,18,31,0.8)]")} />
    <span className="text-[10px] uppercase font-orbitron mt-1 tracking-tighter">{label}</span>
    {active && (
      <motion.div
        layoutId="nav-active"
        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-red shadow-[0_0_10px_rgba(193,18,31,0.8)]"
      />
    )}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPanic: () => void;
}

export const Layout = ({ children, activeTab, setActiveTab, onPanic }: LayoutProps) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);   // ← NEW

  useEffect(() => {                                                  // ← NEW
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">

      {/* Offline Bar */}                                           {/* ← NEW */}
      {isOffline && (
        <div className="w-full text-center text-[10px] font-orbitron py-1.5 bg-deep-red/20 border-b border-deep-red/30 text-accent-red uppercase tracking-widest z-20">
          ⚔ Offline — Data saved locally
        </div>
      )}

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-md z-10">
        <h1 className="text-lg font-black text-glow-red italic">Warrior Ascension</h1>
        <button
          onClick={onPanic}
          className="p-2 rounded-full bg-accent-red/10 border border-accent-red/30 text-accent-red hover:bg-accent-red/20 transition-colors"
        >
          <ShieldAlert size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md grid grid-cols-6 border-t border-white/5 bg-panel/90 backdrop-blur-lg px-2 pb-safe">
        <NavItem icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={BarChart2} label="Stats" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
        <NavItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <NavItem icon={Map} label="Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
        <NavItem icon={BookOpen} label="Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        <NavItem icon={Settings} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>
    </div>
  );
};
