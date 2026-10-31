import React, { useState } from 'react';
import { Task } from '../types';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, XCircle, ArrowRightLeft, Sparkles, ShieldAlert, Zap, Sun, Coffee } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface CalendarSectionProps {
  tasks: Task[];
  onCompleteTaskClick: (task: Task) => void;
  onFailTaskClick: (task: Task) => void;
  onMoveTaskDate: (taskId: string, newDate: string) => void;
  onOpenNewTaskModalForDate: (date: string) => void;
}

const DAYS_OF_WEEK = [
  { id: 'hoje', label: 'Hoje', icon: '🔥', isWeekend: false },
  { id: 'amanhã', label: 'Amanhã', icon: '⚡', isWeekend: false },
  { id: 'sábado', label: 'Sábado', icon: '⭐', isWeekend: true },
  { id: 'domingo', label: 'Domingo', icon: '🛋️', isWeekend: true },
  { id: 'segunda', label: 'Segunda', icon: '📅', isWeekend: false },
  { id: 'terça', label: 'Terça', icon: '📅', isWeekend: false },
  { id: 'quarta', label: 'Quarta', icon: '📅', isWeekend: false },
  { id: 'quinta', label: 'Quinta', icon: '📅', isWeekend: false },
  { id: 'sexta', label: 'Sexta', icon: '🎉', isWeekend: false },
];

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  tasks,
  onCompleteTaskClick,
  onFailTaskClick,
  onMoveTaskDate,
  onOpenNewTaskModalForDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('sábado');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed' | 'all'>('pending');

  const selectedDayInfo = DAYS_OF_WEEK.find((d) => d.id === selectedDay) || DAYS_OF_WEEK[2];

  // Filter tasks for selected day
  const dayTasks = tasks.filter((t) => {
    const target = t.target_date.toLowerCase();
    if (selectedDay === 'hoje') return target === 'hoje';
    if (selectedDay === 'amanhã') return target === 'amanhã';
    return target === selectedDay;
  });

  const filteredTasks = dayTasks.filter((t) => {
    if (filterStatus === 'pending') return t.status === 'pending';
    if (filterStatus === 'completed') return t.status === 'completed';
    return true;
  });

  const totalMinutes = dayTasks.reduce((acc, t) => acc + (t.estimated_minutes || 0), 0);
  const totalPotentialReward = dayTasks.reduce((acc, t) => acc + (t.reward_virtual || 0), 0);
  const mandatoryCount = dayTasks.filter((t) => t.is_mandatory && t.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-indigo-950/60 to-gray-900 border border-amber-500/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
            Calendário & Planner Semanal TDAH
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Atividades da Semana & Fim de Semana
          </h2>
          <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
            Organize suas tarefas por dia da semana sem acúmulos estressantes. Veja o que está programado para o <strong className="text-amber-300">Sábado</strong>, <strong className="text-amber-300">Domingo</strong> ou dias de semana com previsões de tempo e recompensa em R$ virtuais.
          </p>
        </div>
      </div>

      {/* Day Selector Ribbon */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-3 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {DAYS_OF_WEEK.map((day) => {
            const count = tasks.filter((t) => t.target_date.toLowerCase() === day.id && t.status === 'pending').length;
            const isSelected = selectedDay === day.id;

            return (
              <button
                key={day.id}
                onClick={() => {
                  soundFx.playReward();
                  setSelectedDay(day.id);
                }}
                className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl border text-left transition-all shrink-0 relative ${
                  isSelected
                    ? day.isWeekend
                      ? 'bg-amber-950/90 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105'
                      : 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-105'
                    : day.isWeekend
                    ? 'bg-amber-950/30 border-amber-800/50 text-amber-300/80 hover:bg-amber-950/60'
                    : 'bg-gray-800/60 border-gray-700/60 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-black flex items-center gap-1">
                    <span>{day.icon}</span>
                    <span>{day.label}</span>
                  </span>

                  {count > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-gray-950' : 'bg-gray-700 text-amber-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </div>
                <div className="text-[10px] opacity-80 mt-1 font-semibold">
                  {day.isWeekend ? 'Fim de Semana' : 'Dia Útil'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Overview Bar */}
      <div className={`border rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        selectedDayInfo.isWeekend
          ? 'bg-gradient-to-r from-amber-950/70 via-gray-900 to-amber-950/40 border-amber-500/50'
          : 'bg-gray-900/90 border-gray-800'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white capitalize flex items-center gap-2">
              <span>{selectedDayInfo.icon}</span>
              <span>Atividades de {selectedDayInfo.label}</span>
            </span>
            {selectedDayInfo.isWeekend && (
              <span className="bg-amber-500 text-gray-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Zona Fim de Semana VIP ⭐
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {dayTasks.length === 0
              ? `Nenhuma atividade agendada para ${selectedDayInfo.label}. Adicione uma ação!`
              : `${dayTasks.length} tarefa(s) cadastrada(s) para este dia.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="grid grid-cols-2 gap-2 bg-gray-950/80 p-2.5 rounded-2xl border border-gray-800 text-xs font-bold flex-1 sm:flex-none">
            <div className="text-center px-2">
              <span className="text-gray-400 text-[10px] block uppercase">Tempo Est.</span>
              <span className="text-indigo-300 font-black">{totalMinutes} min</span>
            </div>
            <div className="text-center px-2 border-l border-gray-800">
              <span className="text-gray-400 text-[10px] block uppercase">Premiação</span>
              <span className="text-emerald-400 font-black">+R$ {totalPotentialReward.toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenNewTaskModalForDate(selectedDay)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar em {selectedDayInfo.label}</span>
            <span className="sm:hidden">+ Tarefa</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between text-xs font-bold bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
        <div className="flex gap-1">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'pending' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'completed' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Concluídas
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Todas
          </button>
        </div>

        {mandatoryCount > 0 && (
          <span className="text-rose-400 text-[11px] font-black flex items-center gap-1 bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-800/60 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            {mandatoryCount} obrigatória(s)
          </span>
        )}
      </div>

      {/* Task List for Selected Day */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-gray-900/60 border border-dashed border-gray-800 rounded-3xl p-10 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-amber-500/50 mx-auto" />
            <p className="text-gray-400 font-medium text-sm">
              Nenhuma tarefa {filterStatus === 'pending' ? 'pendente' : ''} em <strong className="text-white capitalize">{selectedDay}</strong>.
            </p>
            <button
              onClick={() => onOpenNewTaskModalForDate(selectedDay)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Criar Tarefa para {selectedDayInfo.label}
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isFailed = task.status === 'failed_laziness';

            return (
              <div
                key={task.id}
                className={`bg-gray-800/90 border rounded-2xl p-5 space-y-4 shadow-lg transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-gray-800/40 opacity-75'
                    : isFailed
                    ? 'border-rose-500/40 bg-gray-800/40 opacity-60'
                    : selectedDayInfo.isWeekend
                    ? 'border-amber-500/50 hover:border-amber-400 bg-gray-800/95'
                    : 'border-gray-700 hover:border-indigo-500/60'
                }`}
              >
                {/* Header Info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
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

                {/* Values & Reschedule Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-900/80 p-3 rounded-xl border border-gray-800 text-xs font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Recompensa:</span>
                    <span className="text-emerald-400">+R$ {task.reward_virtual.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-gray-800 pt-1 sm:pt-0 sm:pl-2">
                    <span className="text-gray-400">Punição:</span>
                    <span className="text-rose-400">-R$ {task.penalty_virtual.toFixed(2)}</span>
                  </div>
                </div>

                {/* Quick Reschedule Selector */}
                {!isCompleted && !isFailed && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-700/60 overflow-x-auto text-[11px]">
                    <span className="text-gray-400 font-bold uppercase text-[10px] shrink-0 flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3 text-indigo-400" /> Move para:
                    </span>
                    {DAYS_OF_WEEK.filter((d) => d.id !== selectedDay).map((day) => (
                      <button
                        key={day.id}
                        onClick={() => {
                          soundFx.playReward();
                          onMoveTaskDate(task.id, day.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-indigo-900/60 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white transition-all shrink-0 font-bold"
                        title={`Reagendar para ${day.label}`}
                      >
                        {day.icon} {day.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
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
                      Tribunal / Falhar (-R$ {task.penalty_virtual})
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-center py-1">
                    {isCompleted && (
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Concluído com sucesso
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-rose-400 flex items-center justify-center gap-1">
                        <XCircle className="w-4 h-4" /> Falhou / Penalizado
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
