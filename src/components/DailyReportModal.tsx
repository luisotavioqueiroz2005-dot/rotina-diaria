import React, { useState } from 'react';
import { Task, Transaction } from '../types';
import { BarChart3, CheckCircle2, Clock, Calendar, ArrowRight, Sparkles, X, AlertTriangle, ShieldCheck, Zap, Sun } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface DailyReportModalProps {
  tasks: Task[];
  transactions: Transaction[];
  balance: number;
  streakDays: number;
  onClose: () => void;
  onMoveTaskDate: (taskId: string, newDate: string) => void;
  onFailTaskClick: (task: Task) => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  tasks,
  transactions,
  balance,
  streakDays,
  onClose,
  onMoveTaskDate,
  onFailTaskClick,
}) => {
  // Pending tasks for today
  const todayPendingTasks = tasks.filter((t) => t.target_date === 'hoje' && t.status === 'pending');
  const todayCompletedTasks = tasks.filter((t) => t.target_date === 'hoje' && t.status === 'completed');

  // Estimate total earnings and time spent today
  const todayEarned = todayCompletedTasks.reduce((acc, t) => acc + t.reward_virtual + (t.overtime_bonus_calculated || 0), 0);
  const totalMinutesDone = todayCompletedTasks.reduce((acc, t) => acc + (t.actual_minutes || t.estimated_minutes), 0);

  const [rescheduledIds, setRescheduledIds] = useState<string[]>([]);

  const handleReschedule = (taskId: string, newDate: string) => {
    soundFx.playReward();
    onMoveTaskDate(taskId, newDate);
    setRescheduledIds((prev) => [...prev, taskId]);
  };

  const remainingPending = todayPendingTasks.filter((t) => !rescheduledIds.includes(t.id));

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            Fechamento & Análise de Desempenho
          </div>
          <h2 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <span>Relatório do Dia</span>
            <span className="text-indigo-400">Dopaminérgico</span>
          </h2>
          <p className="text-xs text-gray-400">
            Confira suas conquistas de hoje e organize pendências sem culpa ou sobrecarga TDAH.
          </p>
        </div>

        {/* Daily Metrics Hero Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800 text-center space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-black block">Concluídas</span>
            <span className="text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {todayCompletedTasks.length}
            </span>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800 text-center space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-black block">Ganho Hoje</span>
            <span className="text-xl font-black text-emerald-300">
              +R$ {todayEarned.toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800 text-center space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-black block">Tempo em Foco</span>
            <span className="text-xl font-black text-indigo-300 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" /> {totalMinutesDone} min
            </span>
          </div>

          <div className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800 text-center space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-black block">Sequência</span>
            <span className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              🔥 {streakDays}d
            </span>
          </div>
        </div>

        {/* Unfinished Tasks Re-scheduling Prompt Section */}
        {remainingPending.length > 0 ? (
          <div className="bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-gray-900 border border-indigo-500/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-white text-sm">Não deu tempo de fazer tudo hoje?</h3>
                <p className="text-xs text-indigo-200">
                  O cérebro TDAH precisa de alívio. Reagende abaixo para o <strong>Sábado</strong>, <strong>Amanhã</strong> ou outro dia livre sem culpa!
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {remainingPending.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-900/90 border border-indigo-800/60 rounded-xl p-4 space-y-3 shadow-md"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300">
                        {task.category}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-1">{task.title}</h4>
                    </div>
                    <span className="text-indigo-300 text-xs font-bold shrink-0">
                      ⏱️ {task.estimated_minutes} min
                    </span>
                  </div>

                  {/* Question & Interactive Scheduling Buttons */}
                  <div className="space-y-2 pt-1 border-t border-gray-800">
                    <span className="text-xs font-bold text-amber-300 block">
                      ❓ Para qual dia você prefere agendar esta tarefa?
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                      <button
                        onClick={() => handleReschedule(task.id, 'sábado')}
                        className="p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/60 text-amber-300 hover:text-white transition-all text-center flex items-center justify-center gap-1"
                      >
                        ⭐ Atividades do Sábado
                      </button>

                      <button
                        onClick={() => handleReschedule(task.id, 'domingo')}
                        className="p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500/60 text-amber-300 hover:text-white transition-all text-center flex items-center justify-center gap-1"
                      >
                        🛋️ Domingo
                      </button>

                      <button
                        onClick={() => handleReschedule(task.id, 'amanhã')}
                        className="p-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/60 text-indigo-300 hover:text-white transition-all text-center flex items-center justify-center gap-1"
                      >
                        ⚡ Amanhã
                      </button>

                      <button
                        onClick={() => handleReschedule(task.id, 'segunda')}
                        className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-all text-center flex items-center justify-center gap-1"
                      >
                        📅 Segunda-feira
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-400/40">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-emerald-300">
              Agenda Zerada para Hoje! 🎉
            </h3>
            <p className="text-xs text-emerald-200 max-w-md mx-auto">
              Todas as pendências de hoje foram concluídas ou reagendadas com sucesso. Seu cérebro está livre e pronto para descansar!
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            Concluir Fechamento do Dia
          </button>
        </div>
      </div>
    </div>
  );
};
