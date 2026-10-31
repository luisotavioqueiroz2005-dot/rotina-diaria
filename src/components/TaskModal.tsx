import React, { useState } from 'react';
import { Task, FrictionLevel, UrgencyLevel } from '../types';
import { Plus, X, Sparkles, ShieldAlert, Clock, Flame } from 'lucide-react';

interface TaskModalProps {
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Estudos');
  const [frictionLevel, setFrictionLevel] = useState<FrictionLevel>('MÉDIO');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('ALTA');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [isMandatory, setIsMandatory] = useState(false);
  const [targetDate, setTargetDate] = useState<string>('hoje');

  // Automatic reward calculation based on friction
  const reward = frictionLevel === 'ALTO' ? 60 : frictionLevel === 'MÉDIO' ? 30 : 15;
  const penalty = reward * 2; // Severe loss aversion

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `manual_${Date.now()}`,
      title: title.trim(),
      category,
      friction_level: frictionLevel,
      urgency_level: urgencyLevel,
      estimated_minutes: estimatedMinutes,
      reward_virtual: reward,
      penalty_virtual: penalty,
      is_mandatory: isMandatory,
      status: 'pending',
      target_date: targetDate,
      adhd_tip: 'Divida o início em apenas 120 segundos sem pensar no resultado.',
      created_at: new Date().toISOString(),
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            Nova Tarefa Manual
          </h3>
          <p className="text-xs text-gray-400">
            Adicione uma missão e configure seu nível de atrito.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-300 uppercase block">Título da Ação</label>
            <input
              type="text"
              required
              placeholder="Ex: Estudar Hidrologia Módulo 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-300 uppercase block">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Estudos">Estudos</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Saúde">Saúde</option>
                <option value="Casa">Casa</option>
                <option value="Finanças">Finanças</option>
                <option value="Pessoal">Pessoal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300 uppercase block">Data Alvo</label>
              <select
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-bold"
              >
                <option value="hoje">Hoje</option>
                <option value="amanhã">Amanhã</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
                <option value="segunda">Segunda-feira</option>
                <option value="terça">Terça-feira</option>
                <option value="quarta">Quarta-feira</option>
                <option value="quinta">Quinta-feira</option>
                <option value="sexta">Sexta-feira</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-300 uppercase block">Nível de Atrito (Dificuldade)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['BAIXO', 'MÉDIO', 'ALTO'] as FrictionLevel[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setFrictionLevel(level)}
                  className={`py-2 rounded-xl border font-bold text-center transition-all ${
                    frictionLevel === level
                      ? level === 'ALTO'
                        ? 'bg-rose-900/80 border-rose-500 text-rose-300'
                        : level === 'MÉDIO'
                        ? 'bg-amber-900/80 border-amber-500 text-amber-300'
                        : 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-300 uppercase block">Urgência TDAH (Prioridade)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['CRÍTICA', 'ALTA', 'MÉDIA', 'BAIXA'] as UrgencyLevel[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setUrgencyLevel(level)}
                  className={`py-2 rounded-xl border font-bold text-xs text-center transition-all ${
                    urgencyLevel === level
                      ? level === 'CRÍTICA'
                        ? 'bg-red-600 border-red-400 text-white shadow-md shadow-red-600/30'
                        : level === 'ALTA'
                        ? 'bg-orange-600 border-orange-400 text-white shadow-md shadow-orange-600/30'
                        : level === 'MÉDIA'
                        ? 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-600/30'
                        : 'bg-slate-700 border-slate-500 text-gray-200'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-300 uppercase block">Previsão de Tempo (Minutos)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="300"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white font-bold"
              />
              <span className="text-gray-400 font-bold">min</span>
            </div>
          </div>

          {/* Checkbox Mandatory */}
          <div className="bg-gray-800/80 p-3 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Compromisso Obrigatório Inadiável?</span>
              <span className="text-[10px] text-gray-400">Ativa trava de segurança na loja se não concluído.</span>
            </div>
            <input
              type="checkbox"
              checked={isMandatory}
              onChange={(e) => setIsMandatory(e.target.checked)}
              className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          {/* Automatic Economy Preview */}
          <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex justify-between items-center font-bold">
            <span className="text-gray-400">Recompensa: <strong className="text-emerald-400">+R$ {reward}</strong></span>
            <span className="text-gray-400">Punição: <strong className="text-rose-400">-R$ {penalty}</strong></span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            Adicionar à Agenda
          </button>
        </form>
      </div>
    </div>
  );
};
