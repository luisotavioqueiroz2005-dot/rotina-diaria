import React, { useMemo } from 'react';
import { Transaction, UserStats } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Zap, Award, BarChart3, Coins } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
  stats: UserStats;
}

interface DayData {
  dayName: string;
  earned: number;
  penalties: number;
  net: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ transactions, stats }) => {
  // Generate last 7 days data aggregated from transactions
  const weeklyData = useMemo(() => {
    const days: DayData[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });

      // Aggregate transactions for this day
      const dayTxs = transactions.filter(
        (tx) => tx.timestamp.split('T')[0] === dateStr
      );

      let earned = 0;
      let penalties = 0;

      dayTxs.forEach((tx) => {
        if (tx.amount > 0) {
          earned += tx.amount;
        } else {
          penalties += Math.abs(tx.amount);
        }
      });

      // If no transactions exist for that day in sample, provide realistic baseline mock data for demonstration
      if (dayTxs.length === 0) {
        // baseline mock for past days
        const baselines = [
          { e: 65, p: 20 },
          { e: 80, p: 0 },
          { e: 40, p: 40 },
          { e: 90, p: 15 },
          { e: 110, p: 10 },
          { e: 50, p: 30 },
          { e: 75, p: 10 },
        ];
        const base = baselines[6 - i];
        earned = base.e;
        penalties = base.p;
      }

      days.push({
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        earned,
        penalties,
        net: earned - penalties,
      });
    }

    return days;
  }, [transactions]);

  // Category breakdown for Pie Chart
  const categoryData = useMemo(() => {
    return [
      { name: 'Estudos & Trabalho', value: 180, color: '#10b981' },
      { name: 'Saúde & Hábitos', value: 65, color: '#6366f1' },
      { name: 'Casa & Organização', value: 45, color: '#f59e0b' },
      { name: 'Punições (Adiados)', value: 85, color: '#f43f5e' },
    ];
  }, []);

  // Compute peak penalty day
  const peakPenaltyDay = useMemo(() => {
    let maxP = -1;
    let maxDay = '';
    weeklyData.forEach((d) => {
      if (d.penalties > maxP) {
        maxP = d.penalties;
        maxDay = d.dayName;
      }
    });
    return maxDay || 'Quinta-feira';
  }, [weeklyData]);

  const totalEarnedWeek = weeklyData.reduce((acc, d) => acc + d.earned, 0);
  const totalPenaltiesWeek = weeklyData.reduce((acc, d) => acc + d.penalties, 0);
  const efficiencyRatio =
    totalEarnedWeek + totalPenaltiesWeek > 0
      ? Math.round((totalEarnedWeek / (totalEarnedWeek + totalPenaltiesWeek)) * 100)
      : 100;

  return (
    <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 space-y-6 shadow-xl my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-700 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            Análise de Tendência Semanal
          </div>
          <h3 className="text-xl font-black text-white mt-1">Ganhos vs. Punições por Procrastinação</h3>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-2xl border border-gray-700 text-xs font-bold">
          <span className="text-gray-400">Eficiência Dopaminérgica:</span>
          <span className={`text-sm font-black ${efficiencyRatio >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {efficiencyRatio}%
          </span>
        </div>
      </div>

      {/* Recharts Weekly Income vs Penalty Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="dayName" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              formatter={(value: any, name: any) => [
                `R$ ${Number(value).toFixed(2)}`,
                name === 'earned'
                  ? 'Ganhos (+R$)'
                  : name === 'penalties'
                  ? 'Punições (-R$)'
                  : 'Saldo Líquido',
              ]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
              formatter={(value) => (
                <span className="text-gray-300 font-bold uppercase">
                  {value === 'earned'
                    ? 'Ganhos'
                    : value === 'penalties'
                    ? 'Punições'
                    : 'Saldo Líquido'}
                </span>
              )}
            />
            <Bar dataKey="earned" fill="#10b981" radius={[6, 6, 0, 0]} name="earned" />
            <Bar dataKey="penalties" fill="#f43f5e" radius={[6, 6, 0, 0]} name="penalties" />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 4, fill: '#fbbf24' }}
              name="net"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ADHD Unproductive Pattern Alert Box */}
      <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl space-y-2 text-xs">
        <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          Padrão TDAH Detectado pela IA:
        </div>
        <p className="text-amber-100 leading-relaxed">
          Sua maior taxa de punições concentrou-se em <strong className="text-amber-300 uppercase">{peakPenaltyDay}</strong>. O principal fator identificado foi a <em>paralisia de início em tarefas com estimativa acima de 45 minutos</em>.
        </p>
        <div className="bg-gray-900/80 p-3 rounded-xl border border-amber-500/30 flex items-start gap-2 text-gray-200">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Recomendação Anti-Procrastinação: </strong>
            Divida tarefas de alto atrito em blocos máximos de 20 minutos usando a Entrada IA para evitar a dor de perda em {peakPenaltyDay}.
          </div>
        </div>
      </div>
    </div>
  );
};
