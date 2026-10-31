import React from 'react';
import { UserStats } from '../types';
import { UserProfile } from '../services/authService';
import { DailyStreakTracker } from './DailyStreakTracker';
import { Brain, Coins, Store, History, BookOpen, CalendarCheck, Calendar, User, LogIn, Bot } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: UserStats;
  currentUser: UserProfile;
  mandatoryPendingCount?: number;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  currentUser,
  mandatoryPendingCount = 0,
  onOpenAuthModal,
}) => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              Dopamine<span className="text-indigo-400">Hacker</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Gestão de Rotina & TDAH</p>
          </div>
        </div>

        {/* HUD Display (User + Streak Tracker + Balance Virtual) */}
        <div className="flex items-center gap-2">
          {/* User Account Switcher Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-200 transition-all"
            title="Alternar / Cadastrar Perfil"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
            <LogIn className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          </button>

          {/* Daily Streak Visual Tracker */}
          <DailyStreakTracker
            streakDays={stats.streak_days}
            mandatoryPendingCount={mandatoryPendingCount}
            isCompact
          />

          {/* Balance Virtual */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-sm transition-all ${
            stats.balance >= 0 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
          }`}>
            <Coins className="w-4 h-4" />
            <span>R$ {stats.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Primary Tab Bar */}
      <nav className="max-w-4xl mx-auto flex items-center justify-around mt-3 border-t border-gray-800/80 pt-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'inbox'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Entrada IA</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Hoje</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'calendar'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendário</span>
        </button>

        <button
          onClick={() => setActiveTab('coach')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'coach'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Coach IA</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'store'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Loja</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'ledger'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Extrato</span>
        </button>

        <button
          onClick={() => setActiveTab('prd')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
            activeTab === 'prd'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>PRD & DB</span>
        </button>
      </nav>
    </header>
  );
};
