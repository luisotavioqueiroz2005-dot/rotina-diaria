import React from 'react';
import { Flame, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

interface DailyStreakTrackerProps {
  streakDays: number;
  mandatoryPendingCount: number;
  isCompact?: boolean;
}

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({
  streakDays,
  mandatoryPendingCount,
  isCompact = false,
}) => {
  const isAtRisk = mandatoryPendingCount > 0;
  const isHighStreak = streakDays >= 3;

  if (isCompact) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black transition-all ${
          isAtRisk
            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]'
            : isHighStreak
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}
        title={
          isAtRisk
            ? `Sequência em Risco! Você tem ${mandatoryPendingCount} obrigação(ões) pendente(s) hoje.`
            : `Sequência de ${streakDays} dias cumprindo todas as tarefas obrigatórias!`
        }
      >
        {isAtRisk ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
        ) : (
          <Flame
            className={`w-3.5 h-3.5 fill-amber-400 text-amber-400 ${
              isHighStreak ? 'animate-bounce drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'animate-pulse'
            }`}
          />
        )}

        <span>{streakDays}d</span>

        {isAtRisk && <span className="text-[10px] uppercase font-black tracking-tighter hidden sm:inline">Risco</span>}
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-3xl border flex items-center justify-between gap-3 transition-all ${
        isAtRisk
          ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
          : isHighStreak
          ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
          : 'bg-gray-900 border-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            isAtRisk
              ? 'bg-rose-900/80 border-rose-500 text-rose-300'
              : isHighStreak
              ? 'bg-amber-900/80 border-amber-400 text-amber-300'
              : 'bg-gray-800 border-gray-700 text-amber-400'
          }`}
        >
          {isAtRisk ? (
            <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
          ) : (
            <Flame
              className={`w-7 h-7 fill-amber-400 text-amber-400 ${
                isHighStreak ? 'animate-bounce drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]' : 'animate-pulse'
              }`}
            />
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-base">
              Sequência Diária ({streakDays} {streakDays === 1 ? 'Dia' : 'Dias'})
            </span>
            {isHighStreak && !isAtRisk && (
              <span className="text-[10px] bg-amber-500 text-gray-950 font-black uppercase px-2 py-0.5 rounded-full shadow">
                Fogo Alto 🔥
              </span>
            )}
            {isAtRisk && (
              <span className="text-[10px] bg-rose-600 text-white font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                Em Risco!
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {isAtRisk
              ? `Você tem ${mandatoryPendingCount} tarefa(s) obrigatória(s) pendente(s) hoje. Conclua para manter a sequência!`
              : `Você concluiu todas as tarefas obrigatórias por ${streakDays} dias seguidos.`}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-2xl font-black text-amber-400 tracking-tight">{streakDays}d</span>
      </div>
    </div>
  );
};
