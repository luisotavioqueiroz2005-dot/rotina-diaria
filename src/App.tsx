import React, { useState, useEffect } from 'react';
import { Task, RoutineCheckin, StoreItem, Transaction, UserStats } from './types';
import {
  INITIAL_TASKS,
  INITIAL_ROUTINES,
  INITIAL_STORE_ITEMS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_STATS,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { BrainDumpSection } from './components/BrainDumpSection';
import { DashboardSection } from './components/DashboardSection';
import { StoreSection } from './components/StoreSection';
import { LedgerSection } from './components/LedgerSection';
import { PRDDocSection } from './components/PRDDocSection';
import { MapsLocationSection } from './components/MapsLocationSection';
import { OvertimeTimerModal } from './components/OvertimeTimerModal';
import { TaskModal } from './components/TaskModal';
import { CoachChatSection } from './components/CoachChatSection';
import { CalendarSection } from './components/CalendarSection';
import { DailyReportModal } from './components/DailyReportModal';
import { soundFx } from './utils/audioEffects';
import { MapPin } from 'lucide-react';
import { UserProfile, getCurrentUser, setCurrentUser } from './services/authService';
import { AuthModal } from './components/AuthModal';

import { AIJudgeCourtModal } from './components/AIJudgeCourtModal';
import { JudgeVerdictResponse } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [currentUser, setCurrentUserProfile] = useState<UserProfile>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [courtModalTask, setCourtModalTask] = useState<Task | null>(null);

  // Persistence per User
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`dh_user_${currentUser.id}_tasks`);
    if (saved) return JSON.parse(saved);
    return currentUser.id === 'usr_demo' ? INITIAL_TASKS : [];
  });

  const [routines, setRoutines] = useState<RoutineCheckin[]>(() => {
    const saved = localStorage.getItem(`dh_user_${currentUser.id}_routines`);
    if (saved) return JSON.parse(saved);
    return INITIAL_ROUTINES;
  });

  const [storeItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`dh_user_${currentUser.id}_transactions`);
    if (saved) return JSON.parse(saved);
    return currentUser.id === 'usr_demo' ? INITIAL_TRANSACTIONS : [];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(`dh_user_${currentUser.id}_stats`);
    if (saved) return JSON.parse(saved);
    return currentUser.id === 'usr_demo' ? INITIAL_USER_STATS : {
      balance: 0.00,
      total_earned: 0.00,
      total_penalties: 0.00,
      total_overtime_bonus: 0.00,
      streak_days: 0,
    };
  });

  const [overtimeModalTask, setOvertimeModalTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);
  const [isDailyReportModalOpen, setIsDailyReportModalOpen] = useState<boolean>(false);

  // Handler: Move Task Target Date (Reagendar sem multa no Relatório ou Calendário)
  const handleMoveTaskDate = (taskId: string, newDate: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, target_date: newDate } : t))
    );
  };

  // Switch User Profile and reload individual state
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user.id);
    setCurrentUserProfile(user);

    const savedTasks = localStorage.getItem(`dh_user_${user.id}_tasks`);
    setTasks(savedTasks ? JSON.parse(savedTasks) : user.id === 'usr_demo' ? INITIAL_TASKS : []);

    const savedRoutines = localStorage.getItem(`dh_user_${user.id}_routines`);
    setRoutines(savedRoutines ? JSON.parse(savedRoutines) : INITIAL_ROUTINES);

    const savedTxs = localStorage.getItem(`dh_user_${user.id}_transactions`);
    setTransactions(savedTxs ? JSON.parse(savedTxs) : user.id === 'usr_demo' ? INITIAL_TRANSACTIONS : []);

    const savedStats = localStorage.getItem(`dh_user_${user.id}_stats`);
    setStats(savedStats ? JSON.parse(savedStats) : user.id === 'usr_demo' ? INITIAL_USER_STATS : {
      balance: 0.00,
      total_earned: 0.00,
      total_penalties: 0.00,
      total_overtime_bonus: 0.00,
      streak_days: 0,
    });

    setIsAuthModalOpen(false);
  };

  // Sync state to current user storage key
  useEffect(() => {
    localStorage.setItem(`dh_user_${currentUser.id}_tasks`, JSON.stringify(tasks));
  }, [tasks, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`dh_user_${currentUser.id}_routines`, JSON.stringify(routines));
  }, [routines, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`dh_user_${currentUser.id}_transactions`, JSON.stringify(transactions));
  }, [transactions, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(`dh_user_${currentUser.id}_stats`, JSON.stringify(stats));
  }, [stats, currentUser.id]);

  // Handler: Add Tasks (from AI Brain Dump or Manual)
  const handleAddTasks = (newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
  };

  const handleSingleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  // Handler: Initiate Completion (Opens Overtime Modal)
  const handleOpenCompleteModal = (task: Task) => {
    setOvertimeModalTask(task);
  };

  // Handler: Confirm Completion with Overtime Bonus
  const handleConfirmComplete = (task: Task, actualMinutes: number, overtimeBonus: number) => {
    const totalCredit = task.reward_virtual + overtimeBonus;
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: 'completed',
              actual_minutes: actualMinutes,
              overtime_bonus_calculated: overtimeBonus,
              completed_at: nowIso,
            }
          : t
      )
    );

    setStats((prev) => ({
      ...prev,
      balance: prev.balance + totalCredit,
      total_earned: prev.total_earned + totalCredit,
      total_overtime_bonus: prev.total_overtime_bonus + overtimeBonus,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      amount: totalCredit,
      type: overtimeBonus > 0 ? 'BONUS_OVERTIME' : 'REWARD_TASK',
      description: `Concluiu: ${task.title}${overtimeBonus > 0 ? ` (+R$ ${overtimeBonus} Bônus Foco)` : ''}`,
      timestamp: nowIso,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setOvertimeModalTask(null);

    if (overtimeBonus > 0) {
      soundFx.playBonus();
    } else {
      soundFx.playReward();
    }
  };

  // Handler: Open Tribunal da IA Court Modal for Deferral
  const handleFailTask = (task: Task) => {
    setCourtModalTask(task);
  };

  // Handler: Confirm AI Court Penalty Execution
  const handleConfirmCourtPenalty = (
    task: Task,
    finalFine: number,
    reason: string,
    verdict: JudgeVerdictResponse
  ) => {
    const nowIso = new Date().toISOString();

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: 'failed_laziness' } : t))
    );

    setStats((prev) => ({
      ...prev,
      balance: prev.balance - finalFine,
      total_penalties: prev.total_penalties + finalFine,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      amount: -finalFine,
      type: 'PENALTY_LAZINESS',
      description: `Tribunal IA (${verdict.verdict_title}): ${task.title} — "${verdict.judge_feedback}"`,
      timestamp: nowIso,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setCourtModalTask(null);
  };

  // Handler: Toggle Routine Check-in
  const handleToggleRoutine = (routineId: string) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;

        const isCompleted = r.completed_dates.includes(todayIso);
        if (isCompleted) {
          // Uncheck
          return {
            ...r,
            completed_dates: r.completed_dates.filter((d) => d !== todayIso),
          };
        } else {
          // Check & Credit reward
          setStats((s) => ({
            ...s,
            balance: s.balance + r.base_reward,
            total_earned: s.total_earned + r.base_reward,
          }));

          setTransactions((txs) => [
            {
              id: `tx_${Date.now()}`,
              amount: r.base_reward,
              type: 'ROUTINE_CHECKIN',
              description: `Check-in de Rotina: ${r.title}`,
              timestamp: nowIso,
            },
            ...txs,
          ]);

          return {
            ...r,
            completed_dates: [...r.completed_dates, todayIso],
          };
        }
      })
    );
  };

  // Handler: Purchase Item in Store
  const handlePurchaseItem = (item: StoreItem) => {
    const nowIso = new Date().toISOString();

    setStats((prev) => ({
      ...prev,
      balance: prev.balance - item.price,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      amount: -item.price,
      type: 'STORE_PURCHASE',
      description: `Compra na Loja: ${item.title}`,
      timestamp: nowIso,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Calculate mandatory pending count for today
  const mandatoryPendingCount = tasks.filter(
    (t) => t.target_date === 'hoje' && t.is_mandatory && t.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Top Header & HUD Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        currentUser={currentUser}
        mandatoryPendingCount={mandatoryPendingCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Tab Views */}
      <main className="container mx-auto">
        {activeTab === 'inbox' && (
          <BrainDumpSection
            onAddTasks={handleAddTasks}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardSection
            tasks={tasks}
            routines={routines}
            balance={stats.balance}
            transactions={transactions}
            streakDays={stats.streak_days}
            onCompleteTaskClick={handleOpenCompleteModal}
            onFailTaskClick={handleFailTask}
            onToggleRoutine={handleToggleRoutine}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onOpenDailyReportModal={() => setIsDailyReportModalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarSection
            tasks={tasks}
            onCompleteTaskClick={handleOpenCompleteModal}
            onFailTaskClick={handleFailTask}
            onMoveTaskDate={handleMoveTaskDate}
            onOpenNewTaskModalForDate={(date) => {
              setIsNewTaskModalOpen(true);
            }}
          />
        )}

        {activeTab === 'coach' && <CoachChatSection />}

        {activeTab === 'store' && (
          <StoreSection
            balance={stats.balance}
            items={storeItems}
            tasks={tasks}
            onPurchaseItem={handlePurchaseItem}
          />
        )}

        {activeTab === 'ledger' && <LedgerSection transactions={transactions} stats={stats} />}

        {activeTab === 'prd' && <PRDDocSection />}

        {activeTab === 'maps' && (
          <MapsLocationSection
            onAddTask={handleSingleAddTask}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Quick Access Floating Button for Google Maps */}
      <button
        onClick={() => setActiveTab('maps')}
        className={`fixed bottom-20 right-4 z-40 p-3 rounded-full shadow-2xl border transition-all flex items-center gap-2 font-bold text-xs ${
          activeTab === 'maps'
            ? 'bg-teal-600 text-white border-teal-400 scale-105'
            : 'bg-gray-800 text-teal-300 border-gray-700 hover:border-teal-500'
        }`}
        title="Google Maps: Rotas e Tempo de Deslocamento"
      >
        <MapPin className="w-4 h-4 text-teal-400" />
        <span className="hidden sm:inline">Google Maps Rotas</span>
      </button>

      {/* Overtime / Focus Bonus Modal */}
      {overtimeModalTask && (
        <OvertimeTimerModal
          task={overtimeModalTask}
          onClose={() => setOvertimeModalTask(null)}
          onConfirmComplete={handleConfirmComplete}
        />
      )}

      {/* Manual Task Modal */}
      {isNewTaskModalOpen && (
        <TaskModal
          onClose={() => setIsNewTaskModalOpen(false)}
          onAddTask={handleSingleAddTask}
        />
      )}

      {/* Auth / Profile Switcher Modal */}
      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Tribunal da IA Court Modal */}
      {courtModalTask && (
        <AIJudgeCourtModal
          task={courtModalTask}
          onClose={() => setCourtModalTask(null)}
          onConfirmPenalty={handleConfirmCourtPenalty}
        />
      )}

      {/* Daily Report & End-of-Day Reschedule Modal */}
      {isDailyReportModalOpen && (
        <DailyReportModal
          tasks={tasks}
          transactions={transactions}
          balance={stats.balance}
          streakDays={stats.streak_days}
          onClose={() => setIsDailyReportModalOpen(false)}
          onMoveTaskDate={handleMoveTaskDate}
          onFailTaskClick={handleFailTask}
        />
      )}
    </div>
  );
}
