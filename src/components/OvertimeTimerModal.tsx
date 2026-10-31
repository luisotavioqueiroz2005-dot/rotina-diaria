import React, { useState } from 'react';
import { Task } from '../types';
import { Clock, Zap, CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface OvertimeTimerModalProps {
  task: Task;
  onClose: () => void;
  onConfirmComplete: (task: Task, actualMinutes: number, overtimeBonus: number) => void;
}

export const OvertimeTimerModal: React.FC<OvertimeTimerModalProps> = ({
  task,
  onClose,
  onConfirmComplete,
}) => {
  const [actualMinutes, setActualMinutes] = useState<number>(task.estimated_minutes);

  // Overtime bonus calculation
  // Base rule: If estimated is 60 mins and actual is 120 mins in deep focus,
  // Bonus = (actualMinutes - estimatedMinutes) * rate_per_minute based on friction
  const overtimeMinutes = Math.max(0, actualMinutes - task.estimated_minutes);
  const frictionFactor = task.friction_level === 'ALTO' ? 0.5 : task.friction_level === 'MÉDIO' ? 0.3 : 0.15;
  const overtimeBonus = Math.round(overtimeMinutes * frictionFactor);

  const totalReward = task.reward_virtual + overtimeBonus;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmComplete(task, actualMinutes, overtimeBonus);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Bônus de Hora Extra / Hiperfoco
          </div>
          <h3 className="text-xl font-black text-white">{task.title}</h3>
          <p className="text-xs text-gray-400">
            Quanto tempo você focou nesta tarefa? Se você estendeu o foco, ganha bônus financeiro!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700/80 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">Previsão Inicial da IA:</span>
              <span className="text-indigo-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {task.estimated_minutes} minutos
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase block">
                Tempo Real de Execução (Minutos)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white font-black text-lg focus:outline-none focus:border-indigo-500"
                />
                <span className="text-sm font-bold text-gray-400">min</span>
              </div>
            </div>

            {/* Quick time adjustment chips */}
            <div className="flex gap-2 flex-wrap text-xs">
              {[task.estimated_minutes, task.estimated_minutes + 30, task.estimated_minutes + 60, task.estimated_minutes + 120].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setActualMinutes(m)}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    actualMinutes === m
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Bonus Calculation Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-gray-900 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-300 font-medium">
              <span>Recompensa Base:</span>
              <span className="font-bold text-emerald-400">+R$ {task.reward_virtual.toFixed(2)}</span>
            </div>

            {overtimeBonus > 0 ? (
              <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" /> Bônus de Hiperfoco ({overtimeMinutes} min extras):
                </span>
                <span>+R$ {overtimeBonus.toFixed(2)}</span>
              </div>
            ) : (
              <div className="text-[11px] text-gray-500 italic">
                Sem bônus extra (executado dentro ou abaixo da estimativa).
              </div>
            )}

            <div className="border-t border-emerald-500/30 pt-2 flex justify-between items-center text-sm font-black text-white">
              <span>Total Creditado:</span>
              <span className="text-emerald-400 text-lg">+R$ {totalReward.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            Resgatar R$ {totalReward.toFixed(2)} e Concluir
          </button>
        </form>
      </div>
    </div>
  );
};
