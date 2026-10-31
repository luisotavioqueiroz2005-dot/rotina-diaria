import React, { useState } from 'react';
import { Task } from '../types';
import { judgeDeferralWithAI, JudgeVerdictResponse } from '../services/geminiService';
import { Gavel, Scale, AlertTriangle, ShieldAlert, X, ArrowRight, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface AIJudgeCourtModalProps {
  task: Task;
  onClose: () => void;
  onConfirmPenalty: (task: Task, finalFine: number, reason: string, verdict: JudgeVerdictResponse) => void;
}

export const AIJudgeCourtModal: React.FC<AIJudgeCourtModalProps> = ({
  task,
  onClose,
  onConfirmPenalty,
}) => {
  const [reasonText, setReasonText] = useState('');
  const [isJudging, setIsJudging] = useState(false);
  const [verdictResult, setVerdictResult] = useState<JudgeVerdictResponse | null>(null);

  const handleJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    setIsJudging(true);
    soundFx.playPenalty();

    try {
      const res = await judgeDeferralWithAI(task.title, task.penalty_virtual, reasonText);
      setVerdictResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsJudging(false);
    }
  };

  const handleAcceptSentence = () => {
    if (!verdictResult) return;
    onConfirmPenalty(task, verdictResult.calculated_fine, reasonText, verdictResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider">
            <Gavel className="w-4 h-4 text-rose-400" />
            Tribunal da IA — Juiz Severo de Adiamentos
          </div>
          <h3 className="text-xl font-black text-white">{task.title}</h3>
          <p className="text-xs text-gray-400">
            Você está tentando adiar uma tarefa. Digite seu motivo com honestidade para julgamento.
          </p>
        </div>

        {!verdictResult ? (
          /* Form Phase */
          <form onSubmit={handleJudge} className="space-y-4 text-xs">
            <div className="bg-gray-800/80 p-3.5 rounded-2xl border border-gray-700/80 space-y-1">
              <span className="text-gray-400 font-bold block">Punição Base da Tarefa:</span>
              <span className="text-rose-400 font-black text-lg">-R$ {task.penalty_virtual.toFixed(2)}</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300 uppercase block">
                Por que você quer adiar essa tarefa agora?
              </label>
              <textarea
                required
                rows={4}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Ex: 'Não estou no clima para estudar', 'Estou no hospital com febre 39C', 'Preferi assistir série'..."
                className="w-full bg-gray-950 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 resize-none leading-relaxed text-sm"
              />
            </div>

            <div className="bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl text-rose-300 text-[11px] leading-relaxed">
              <strong>Aviso da Lei de Disciplina:</strong> Se for desculpa ou preguiça, a multa será multiplicada severamente (até 4x). Se for força maior real, a pena será mitigada, mas <strong>nunca será zerada</strong>.
            </div>

            <button
              type="submit"
              disabled={isJudging || !reasonText.trim()}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                isJudging || !reasonText.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-rose-600/30 active:scale-95'
              }`}
            >
              {isJudging ? (
                <>
                  <Gavel className="w-4 h-4 animate-spin text-rose-300" />
                  O Tribunal está julgando...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  Submeter Ao Tribunal da IA
                </>
              )}
            </button>
          </form>
        ) : (
          /* Verdict Phase */
          <div className="space-y-4 animate-in fade-in">
            <div className={`p-5 rounded-3xl border space-y-3 ${
              verdictResult.verdict === 'DESCULPA_ESFARRAPADA'
                ? 'bg-rose-950/80 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : 'bg-amber-950/80 border-amber-500/60'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/40 text-gray-200 border border-white/10">
                    Veredito Solene do Juiz
                  </span>
                  <h4 className="text-lg font-black text-white mt-1">{verdictResult.verdict_title}</h4>
                </div>

                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  verdictResult.verdict === 'DESCULPA_ESFARRAPADA'
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {verdictResult.multiplier}x Multa
                </span>
              </div>

              {/* Judge Feedback Quote */}
              <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center gap-1">
                  <Gavel className="w-3 h-3 text-rose-400" /> Sentença do Magistrado:
                </span>
                <p className="text-xs font-medium text-gray-100 italic leading-relaxed">
                  "{verdictResult.judge_feedback}"
                </p>
              </div>

              {/* Fine Breakdown */}
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl text-xs font-bold text-white">
                <span>Multa Calculada:</span>
                <span className="text-rose-400 text-xl font-black">-R$ {verdictResult.calculated_fine.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAcceptSentence}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-all active:scale-95"
            >
              Aceitar Sentença e Descontar R$ {verdictResult.calculated_fine.toFixed(2)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
