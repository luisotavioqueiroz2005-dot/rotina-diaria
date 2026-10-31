export type FrictionLevel = 'ALTO' | 'MÉDIO' | 'BAIXO';

export type UrgencyLevel = 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA';

export type TaskStatus = 'pending' | 'completed' | 'failed_laziness' | 'deferred_valid';

export interface Task {
  id: string;
  title: string;
  category: string;
  friction_level: FrictionLevel;
  urgency_level?: UrgencyLevel;
  estimated_minutes: number;
  actual_minutes?: number;
  reward_virtual: number;
  penalty_virtual: number;
  overtime_bonus_calculated?: number;
  is_mandatory: boolean;
  is_routine?: boolean;
  status: TaskStatus;
  target_date: 'hoje' | 'amanhã' | 'segunda' | 'terça' | 'quarta' | 'quinta' | 'sexta' | 'sábado' | 'domingo' | string;
  adhd_tip?: string;
  created_at: string;
  completed_at?: string;
}

export interface RoutineCheckin {
  id: string;
  title: string;
  base_reward: number;
  base_penalty: number;
  is_mandatory: boolean;
  category: string;
  completed_dates: string[]; // YYYY-MM-DD
}

export interface StoreItem {
  id: string;
  title: string;
  price: number;
  icon: string;
  type: 'hour_rest' | 'day_off' | 'snack' | 'custom';
  blocks_mandatory: boolean;
  description: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'REWARD_TASK' | 'PENALTY_LAZINESS' | 'BONUS_OVERTIME' | 'STORE_PURCHASE' | 'ROUTINE_CHECKIN';
  description: string;
  timestamp: string;
}

export interface UserStats {
  balance: number;
  total_earned: number;
  total_penalties: number;
  total_overtime_bonus: number;
  streak_days: number;
}
