import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { parseBrainDumpWithAI, transcribeAudioWithGemini } from '../services/geminiService';
import { Sparkles, ArrowRight, Zap, CheckCircle2, ShieldAlert, Clock, Plus, Trash2, Edit2, AlertCircle, Mic, Square, Loader2 } from 'lucide-react';

interface BrainDumpSectionProps {
  onAddTasks: (tasks: Task[]) => void;
  onNavigateToDashboard: () => void;
}

export const BrainDumpSection: React.FC<BrainDumpSectionProps> = ({ onAddTasks, onNavigateToDashboard }) => {
  const [dumpText, setDumpText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<Task[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const samplePrompts = [
    'estudar hidrologia, arrumar quarto, cotar preços no mercado',
    'ligar para o médico, pagar fatura do cartão, terminar apresentação amanhã',
    'lavar a louça acumulada, fazer treino de perna, ler 10 páginas do livro',
  ];

  const handleStartRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setIsTranscribing(true);
        try {
          const text = await transcribeAudioWithGemini(audioBlob);
          if (text) {
            setDumpText((prev) => (prev ? `${prev}\n${text}` : text));
          } else {
            setErrorMessage('Nenhum texto detectado na gravação.');
          }
        } catch (err: any) {
          setErrorMessage('Erro ao transcrever áudio com Gemini 3.5 Transcribe: ' + String(err?.message || err));
        } finally {
          setIsTranscribing(false);
          // Stop media tracks
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: any) {
      setErrorMessage('Permissão de microfone não concedida ou dispositivo não encontrado.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcess = async () => {
    if (!dumpText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const results = await parseBrainDumpWithAI(dumpText);
      setParsedPreview(results);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao comunicar com a IA');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleProcess();
    }
  };

  const handleApproveAll = () => {
    if (parsedPreview.length === 0) return;
    onAddTasks(parsedPreview);
    setParsedPreview([]);
    setDumpText('');
    onNavigateToDashboard();
  };

  const handleRemoveTaskFromPreview = (index: number) => {
    setParsedPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-24 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-gray-900 border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Mecanismo IA de Interpretação
          </div>
          <h2 className="text-2xl font-black text-white">Descarregar Mente (Brain Dump)</h2>
          <p className="text-gray-300 text-sm max-w-xl">
            Jogue qualquer texto solto, áudio ou frases desconectadas. A IA do aplicativo interpreta o nível de atrito, calcula a precificação em R$ virtuais, define punições e monta sua agenda.
          </p>
        </div>
      </div>

      {/* Input Box - Zona da IA (Azul Meia-Noite / Roxo Profundo) */}
      <div className="zone-ai rounded-3xl p-5 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Caixa de Entrada TDAH — Zona de Interpretação IA
        </label>
        
        <textarea
          value={dumpText}
          onChange={(e) => setDumpText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ex: "estudar hidrologia para a prova, arrumar quarto, cotar preços no mercado e pagar luz amanhã"'
          rows={4}
          className="w-full bg-gray-900/90 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all text-sm leading-relaxed"
        />

        {/* Quick Sample Prompt Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-gray-400 font-semibold">Exemplos rápidos de clique único:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDumpText(prompt)}
                className="text-xs bg-gray-700/60 hover:bg-indigo-900/50 hover:text-indigo-200 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-600/50 hover:border-indigo-500/50 transition-all text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2">
          {/* Mic Recording Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              disabled={isTranscribing || isProcessing}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                isTranscribing
                  ? 'bg-purple-950 border-purple-500/50 text-purple-300'
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-indigo-300'
              }`}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  Transcrevendo com Gemini 3.5...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-indigo-400" />
                  Gravar Áudio de Brain Dump
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white animate-pulse border border-rose-400 shadow-lg shadow-rose-600/30"
            >
              <Square className="w-4 h-4 fill-white" />
              Parar Gravação (Gravando...)
            </button>
          )}

          <button
            onClick={handleProcess}
            disabled={isProcessing || isTranscribing || !dumpText.trim()}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isProcessing || isTranscribing || !dumpText.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-indigo-300" />
                Interpretando com IA...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                Mapear Agenda & Precificar R$
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-500/50 p-4 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI Processed Preview Cards */}
      {parsedPreview.length > 0 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Tarefas Estruturadas pela IA ({parsedPreview.length})
            </h3>
            <button
              onClick={handleApproveAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              Confirmar e Adicionar à Agenda
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-3">
            {parsedPreview.map((task, idx) => (
              <div
                key={task.id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3 shadow-md hover:border-indigo-500/50 transition-all"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
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
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-900/60 text-red-400 border border-red-700/50 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Obrigatória
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base">{task.title}</h4>
                  </div>

                  <button
                    onClick={() => handleRemoveTaskFromPreview(idx)}
                    className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-gray-700/50 transition-all"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Values & Time */}
                <div className="grid grid-cols-3 gap-2 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Recompensa</span>
                    <span className="text-emerald-400 font-black">+R$ {task.reward_virtual.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Punição</span>
                    <span className="text-rose-400 font-black">-R$ {task.penalty_virtual.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block font-semibold uppercase">Est. Tempo</span>
                    <span className="text-indigo-300 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.estimated_minutes} min
                    </span>
                  </div>
                </div>

                {/* ADHD Micro-Tip */}
                {task.adhd_tip && (
                  <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-2.5 text-xs text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-300">Hack de Paralisia (2 min): </strong>
                      {task.adhd_tip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleApproveAll}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Todas e Ir para Agenda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
