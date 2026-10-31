import React, { useState, useEffect } from 'react';
import { Task, RoutineCheckin, Transaction } from '../types';
import { DashboardStats } from './DashboardStats';
import { DailyStreakTracker } from './DailyStreakTracker';
import { CheckCircle2, XCircle, Clock, ShieldAlert, Sparkles, Plus, Check, Zap, AlertTriangle, Calendar, BarChart3, Bell, BellRing } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import {
  requestNotificationPermission,
  isNotificationSupportedAndGranted,
  notifyPendingMandatoryTasks,
  notifyRoutineCheckinReminder,
  sendWebNotification,
} from '../services/notificationService';

interface DashboardSectionProps {
  tasks: Task[];
  routines: RoutineCheckin[];
  balance: number;
  transactions: Transaction[];
  streakDays?: number;
  onCompleteTaskClick: (task: Task) => void;
  onFailTaskClick: (task: Task) => void;
  onToggleRoutine: (routineId: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenDailyReportModal?: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  tasks,
  routines,
  balance,
  transactions,
  streakDays = 3,
  onCompleteTaskClick,
  onFailTaskClick,
  onToggleRoutine,
  onOpenNewTaskModal,
  onOpenDailyReportModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<'hoje' | 'amanhã'>('hoje');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed' | 'all'>('pending');
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA'>('ALL');
  const [showStatsChart, setShowStatsChart] = useState<boolean>(true);

  const todayIso = new Date().toISOString().split('T')[0];

  const urgencyWeight = { CRÍTICA: 4, ALTA: 3, MÉDIA: 2, BAIXA: 1 };

  const filteredTasks = tasks
    .filter((t) => {
      if (t.target_date !== selectedDay) return false;
      if (filterStatus === 'pending' && t.status !== 'pending') return false;
      if (filterStatus === 'completed' && t.status !== 'completed') return false;
      if (filterUrgency !== 'ALL' && (t.urgency_level || 'ALTA') !== filterUrgency) return false;
      return true;
    })
    .sort((a, b) => {
      const uA = urgencyWeight[a.urgency_level || 'ALTA'];
      const uB = urgencyWeight[b.urgency_level || 'ALTA'];
      return uB - uA; // Higher urgency first
    });

  const mandatoryPendingCount = tasks.filter(
    (t) => t.target_date === 'hoje' && t.is_mandatory && t.status === 'pending'
  ).length;

  const [hasNotifyPermission, setHasNotifyPermission] = useState<boolean>(() => isNotificationSupportedAndGranted());

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setHasNotifyPermission(granted);
    if (granted) {
      sendWebNotification('🔔 Notificações TDAH Ativadas!', {
        body: 'Você receberá alertas dinâmicos sobre tarefas obrigatórias e check-ins pendentes.',
      });
    } else {
      alert('Permissão de Notificação negada pelo navegador. Ative as notificações nas configurações do seu site.');
    }
  };

  const handleSendTestNotification = () => {
    if (mandatoryPendingCount > 0) {
      notifyPendingMandatoryTasks(mandatoryPendingCount);
    } else {
      sendWebNotification('⚡ Lembrete Dopaminérgico TDAH', {
        body: 'Sua agenda está em dia! Que tal descarregar novos projetos na Entrada IA?',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* HUD Balance Hero Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 border border-gray-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-2">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Saldo Atual na Conta Dopaminérgica
        </span>

        <div className={`text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md ${
          balance >= 0 ? 'text-emerald-400' : 'text-rose-500'
        }`}>
          R$ {balance.toFixed(2)}
        </div>

        {mandatoryPendingCount > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            {mandatoryPendingCount} {mandatoryPendingCount === 1 ? 'obrigação pendente' : 'obrigações pendentes'} (Trava da Loja Ativa)
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Sem obrigações pendentes. Loja Liberada!
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {onOpenDailyReportModal && (
            <button
              onClick={onOpenDailyReportModal}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 bg-amber-950/80 border border-amber-700/50 px-3 py-1.5 rounded-xl transition-all shadow-sm"
              title="Abrir Fechamento e Relatório do Dia"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              Relatório do Dia
            </button>
          )}

          <button
            onClick={() => setShowStatsChart(!showStatsChart)}
            className="text-xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 bg-indigo-950/80 border border-indigo-700/50 px-3 py-1.5 rounded-xl transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {showStatsChart ? 'Ocultar Gráficos' : 'Gráficos de Tendência'}
          </button>

          {!hasNotifyPermission ? (
            <button
              onClick={handleEnableNotifications}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 bg-amber-950/80 border border-amber-700/50 px-3 py-1.5 rounded-xl transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Ativar Notificações Web
            </button>
          ) : (
            <button
              onClick={handleSendTestNotification}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/50 px-3 py-1.5 rounded-xl transition-all"
              title="Disparar Lembrete de Notificação Web"
            >
              <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              Notificações Ativas (Disparar Alerta)
            </button>
          )}
        </div>
      </div>

      {/* Daily Streak Detailed Card */}
      <DailyStreakTracker
        streakDays={streakDays}
        mandatoryPendingCount={mandatoryPendingCount}
      />

      {/* Recharts Dashboard Stats Component */}
      {showStatsChart && (
        <DashboardStats
          transactions={transactions}
          stats={{
            balance,
            total_earned: transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0),
            total_penalties: transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0),
            total_overtime_bonus: transactions.filter(t => t.type === 'BONUS_OVERTIME').reduce((acc, t) => acc + t.amount, 0),
            streak_days: streakDays,
          }}
        />
      )}

      {/* Routine Check-ins Bar */}
      <div className="bg-gray-800/90 border border-gray-700/90 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            Check-ins Diários de Rotina Fixo
          </h3>
          <span className="text-[11px] text-gray-400 font-semibold">Paga valor base ao marcar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {routines.map((routine) => {
            const isCompleted = routine.completed_dates.includes(todayIso);

            return (
              <button
                key={routine.id}
                onClick={() => {
                  soundFx.playReward();
                  onToggleRoutine(routine.id);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-gray-900/80 border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="font-bold text-xs leading-snug line-clamp-1">{routine.title}</div>
                  <div className="text-[10px] text-emerald-400 font-black">+R$ {routine.base_reward}</div>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isCompleted ? 'bg-emerald-500 text-gray-950' : 'border border-gray-600 bg-gray-800 text-transparent'
                }`}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls: Day Selector & Filters & Add Button */}
      <div className="space-y-2 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/60">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Day Selector */}
          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-xs font-bold">
            <button
              onClick={() => setSelectedDay('hoje')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all ${
                selectedDay === 'hoje'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Agenda de Hoje
            </button>
            <button
              onClick={() => setSelectedDay('amanhã')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all ${
                selectedDay === 'amanhã'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Agenda de Amanhã
            </button>
          </div>

          {/* Filter Status */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 font-bold">
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'pending' ? 'bg-gray-700 text-white' : 'text-gray-400'
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'completed' ? 'bg-gray-700 text-white' : 'text-gray-400'
                }`}
              >
                Concluídas
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400'
                }`}
              >
                Todas
              </button>
            </div>

            <button
              onClick={onOpenNewTaskModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95"
              title="Adicionar Tarefa Manual"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Urgency Filter Selector (Adhd Focus Filter) */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-700/60 overflow-x-auto text-[11px] font-bold">
          <span className="text-gray-400 uppercase text-[10px] shrink-0">Filtrar Urgência:</span>
          {(['ALL', 'CRÍTICA', 'ALTA', 'MÉDIA', 'BAIXA'] as const).map((urg) => (
            <button
              key={urg}
              onClick={() => setFilterUrgency(urg)}
              className={`px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                filterUrgency === urg
                  ? urg === 'CRÍTICA'
                    ? 'bg-red-600 border-red-400 text-white shadow'
                    : urg === 'ALTA'
                    ? 'bg-orange-600 border-orange-400 text-white shadow'
                    : urg === 'MÉDIA'
                    ? 'bg-amber-600 border-amber-400 text-white shadow'
                    : urg === 'BAIXA'
                    ? 'bg-slate-700 border-slate-500 text-white shadow'
                    : 'bg-indigo-600 border-indigo-400 text-white shadow'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              {urg === 'ALL' ? 'Todas Urgências' : urg}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-gray-800/40 border border-dashed border-gray-700 rounded-3xl p-10 text-center space-y-3">
            <Calendar className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-gray-400 font-medium text-sm">
              Nenhuma tarefa {filterStatus === 'pending' ? 'pendente' : ''} marcada para {selectedDay} com os filtros selecionados.
            </p>
            <button
              onClick={onOpenNewTaskModal}
              className="inline-flex items-center gap-2 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" /> Criar Tarefa para {selectedDay}
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isFailed = task.status === 'failed_laziness';
            const urgency = task.urgency_level || 'ALTA';

            return (
              <div
                key={task.id}
                className={`bg-gray-800/90 border rounded-2xl p-5 space-y-4 shadow-lg transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-gray-800/40 opacity-75'
                    : isFailed
                    ? 'border-rose-500/40 bg-gray-800/40 opacity-60'
                    : urgency === 'CRÍTICA'
                    ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-gray-700 hover:border-indigo-500/60'
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Urgency Badge */}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow ${
                        urgency === 'CRÍTICA'
                          ? 'bg-red-600 text-white animate-pulse'
                          : urgency === 'ALTA'
                          ? 'bg-orange-600 text-white'
                          : urgency === 'MÉDIA'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-gray-300'
                      }`}>
                        Urgência: {urgency}
                      </span>

                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                        {task.category}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        task.friction_level === 'ALTO'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                          : task.friction_level === 'MÉDIO'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                      }`}>
                        Atrito {task.friction_level}
                      </span>
                      {task.is_mandatory && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/50 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-red-400" /> Obrigatória
                        </span>
                      )}
                    </div>
                    <h4 className={`text-base font-bold leading-tight ${
                      isCompleted ? 'text-gray-400 line-through' : isFailed ? 'text-rose-400 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-gray-400 block font-semibold">Estimado</span>
                    <span className="text-indigo-300 font-bold text-xs flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" /> {task.estimated_minutes} min
                    </span>
                  </div>
                </div>

                {/* Values Bar */}
                <div className="grid grid-cols-2 gap-2 bg-gray-900/70 p-3 rounded-xl border border-gray-800 text-xs font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Recompensa:</span>
                    <span className="text-emerald-400">+R$ {task.reward_virtual.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-l border-gray-800 pl-2">
                    <span className="text-gray-400">Punição (Loss):</span>
                    <span className="text-rose-400">-R$ {task.penalty_virtual.toFixed(2)}</span>
                  </div>
                </div>

                {/* ADHD Micro-Tip */}
                {!isCompleted && !isFailed && task.adhd_tip && (
                  <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-2.5 text-xs text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-300">Hack de Paralisia (2 min): </strong>
                      {task.adhd_tip}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Contraste Extremo Neon */}
                {!isCompleted && !isFailed ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onCompleteTaskClick(task)}
                      className="btn-neon-green flex-1 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gray-950 stroke-[3]" />
                      Concluir (+R$ {task.reward_virtual})
                    </button>

                    <button
                      onClick={() => onFailTaskClick(task)}
                      className="btn-blood-red flex-1 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-white stroke-[2.5]" />
                      Adiar / Preguiça (-R$ {task.penalty_virtual})
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-center py-1">
                    {isCompleted && (
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Concluído com sucesso
                        {task.overtime_bonus_calculated ? ` (+R$ ${task.overtime_bonus_calculated} Bônus extra)` : ''}
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-rose-400 flex items-center justify-center gap-1">
                        <XCircle className="w-4 h-4" /> Adiado por preguiça (-R$ {task.penalty_virtual} descontados)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
