import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Zap, Trophy, Flame, Target } from 'lucide-react';
import { AppState, getRank, calculateMentalPower, cn } from '../types';
import { getTodayStr } from '../storage';

interface HomeProps {
  state: AppState;
  onCheckIn: () => void;
  onUrgeBeat: () => void;
  onRelapse: () => void;
}

export const HomeView = ({ state, onCheckIn, onUrgeBeat, onRelapse }: HomeProps) => {
  const today = getTodayStr();
  const isCheckedIn = state.history[today] === 'success';
  const rank = getRank(state.streak);
  const mentalPower = calculateMentalPower(state);
  const progress = Math.min(100, (state.streak / 100) * 100);

  return (
    <div className="space-y-6">
      {/* Rank Display */}
      <div className="text-center space-y-1">
        <p className="text-[10px] font-orbitron text-gray-500 tracking-[0.3em] uppercase">Current Rank</p>
        <h2 className="text-3xl font-black text-accent-red tracking-widest text-glow-red">{rank.name}</h2>
      </div>

      {/* Progress Ring */}
      <div className="relative flex justify-center items-center py-4">
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/5"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="552.92"
            initial={{ strokeDashoffset: 552.92 }}
            animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
            className="text-accent-red drop-shadow-[0_0_8px_rgba(193,18,31,0.6)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">Day</span>
          <span className="text-5xl font-black font-orbitron">{state.streak}</span>
          <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-widest">/ 100</span>
        </div>
      </div>

      {/* Mental Power Meter */}
      <div className="panel-border p-4 rounded-lg space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-orbitron uppercase tracking-widest flex items-center gap-1">
            <Zap size={12} className="text-yellow-500" /> Mental Power
          </span>
          <span className="text-xs font-orbitron text-accent-red">{mentalPower}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mentalPower}%` }}
            className="h-full bg-gradient-to-r from-deep-red to-accent-red shadow-[0_0_10px_rgba(193,18,31,0.4)]"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="panel-border p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
          <Target size={16} className="text-gray-500" />
          <span className="text-[10px] font-orbitron text-gray-500 uppercase">Urges Defeated</span>
          <span className="text-xl font-bold">{state.urgesDefeated}</span>
        </div>
        <div className="panel-border p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
          <ShieldAlert size={16} className="text-gray-500" />
          <span className="text-[10px] font-orbitron text-gray-500 uppercase tracking-tighter">Relapses</span>
          <span className="text-xl font-bold">{state.relapseCount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onCheckIn}
          disabled={isCheckedIn}
          className={cn(
            "w-full btn-primary py-5 text-lg",
            isCheckedIn && "bg-gray-800 text-gray-500 border-none shadow-none"
          )}
        >
          {isCheckedIn ? "DISCIPLINE CONFIRMED" : "I STAYED DISCIPLINED TODAY"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onUrgeBeat} className="btn-secondary py-4">
            I BEAT AN URGE
          </button>
          <button onClick={onRelapse} className="btn-danger py-4">
            I BROKE STREAK
          </button>
        </div>
      </div>
    </div>
  );
};
