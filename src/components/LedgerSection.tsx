import React from 'react';
import { Transaction, UserStats } from '../types';
import { History, ArrowUpRight, ArrowDownRight, Coins, Zap, ShieldAlert, Award, TrendingUp } from 'lucide-react';

interface LedgerSectionProps {
  transactions: Transaction[];
  stats: UserStats;
}

export const LedgerSection: React.FC<LedgerSectionProps> = ({ transactions, stats }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          Extrato Financeiro Dopaminérgico
        </div>
        <h2 className="text-2xl font-black text-white">Histórico de Recompensas & Punições</h2>
        <p className="text-gray-300 text-sm">
          Transparência total dos seus fluxos de dopamina: moedas creditadas por foco e descontos por procrastinação.
        </p>

        {/* Financial Summary KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-800 text-xs">
          <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800">
            <span className="text-gray-400 font-bold block text-[10px] uppercase">Ganho Total</span>
            <span className="text-emerald-400 font-black text-base flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> R$ {stats.total_earned.toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800">
            <span className="text-gray-400 font-bold block text-[10px] uppercase">Punições Totais</span>
            <span className="text-rose-400 font-black text-base flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" /> R$ {stats.total_penalties.toFixed(2)}
            </span>
          </div>

          <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 col-span-2 sm:col-span-1">
            <span className="text-gray-400 font-bold block text-[10px] uppercase">Bônus de Hiperfoco</span>
            <span className="text-amber-400 font-black text-base flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-400" /> R$ {stats.total_overtime_bonus.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-5 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <Coins className="w-4 h-4 text-indigo-400" />
          Registros de Transações Recentes
        </h3>

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-xs py-6 text-center">Nenhuma transação registrada ainda.</p>
          ) : (
            transactions.map((tx) => {
              const isPositive = tx.amount >= 0;

              return (
                <div
                  key={tx.id}
                  className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-gray-700 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'REWARD_TASK'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : tx.type === 'BONUS_OVERTIME'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : tx.type === 'ROUTINE_CHECKIN'
                        ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/30'
                        : tx.type === 'STORE_PURCHASE'
                        ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-sm">{tx.description}</div>
                      <div className="text-[10px] text-gray-500 font-semibold">
                        {new Date(tx.timestamp).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={`font-black text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}R$ {tx.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
