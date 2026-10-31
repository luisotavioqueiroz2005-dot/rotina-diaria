import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, sendCoachChatMessage } from '../services/geminiService';
import { Bot, Send, User, Sparkles, Zap, MessageSquare, Loader2, Lightbulb } from 'lucide-react';

export const CoachChatSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Olá! Eu sou o seu Coach Dopamínico TDAH 🧠⚡. Estou aqui para te ajudar a destravar a paralisia inicial, negociar metas com estratégias de 2 minutos e equilibrar suas recompensas na Loja. Em que posso te motivar ou destravar agora?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'Como vencer a paralisia de início nos próximos 2 minutos?',
    'Me dê uma dica para começar um estudo pesado sem sofrer.',
    'Vale a pena comprar o passeio na Loja de Recompensas hoje?',
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendCoachChatMessage(messages, messageText.trim());
      const modelMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Desculpe, tive uma oscilação de conexão. Mas lembre-se: divida sua tarefa atual em apenas 120 segundos sem pensar no resultado!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 pb-28 animate-in fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-gray-900 border border-indigo-500/30 rounded-3xl p-5 shadow-xl shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              IA Multi-Turn Gemini
            </div>
            <h2 className="text-xl font-black text-white">Coach Dopamínico TDAH</h2>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-xl font-bold">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Online & Pronto para Atuar
        </div>
      </div>

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-3 bg-gray-900/80 border border-gray-800 rounded-3xl p-4 shadow-inner">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                  : 'bg-gray-800 text-gray-100 border border-gray-700/80 rounded-tl-none space-y-2'
              }`}
            >
              {msg.text.split('\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-800 border border-gray-700/80 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none text-xs font-bold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Coach Dopamínico está formulando sua resposta...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="shrink-0 space-y-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase block px-1">Perguntas Rápidas:</span>
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="bg-gray-800/90 hover:bg-indigo-950/80 hover:border-indigo-500/50 text-gray-300 hover:text-indigo-200 border border-gray-700 px-3 py-1.5 rounded-xl shrink-0 transition-all text-left font-medium"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="shrink-0 flex items-center gap-2 bg-gray-800 border border-gray-700/80 p-2 rounded-2xl shadow-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Fale com o Coach Dopamínico TDAH..."
          className="flex-1 bg-transparent px-3 py-2 text-white text-sm focus:outline-none placeholder-gray-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className={`p-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
            isLoading || !input.trim()
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-indigo-600/30'
          }`}
          title="Enviar Mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
