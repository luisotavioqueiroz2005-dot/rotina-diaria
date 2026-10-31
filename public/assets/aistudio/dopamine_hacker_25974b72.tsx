import React, { useState, useEffect } from 'react';

// --- MOCK DATA & CONFIG ---
const INITIAL_TASKS = [
  { id: 't1', title: 'Rotina: Tomar remédio', reward: 5, penalty: 10, status: 'pending', is_mandatory: true },
  { id: 't2', title: 'Rotina: Arrumar a cama', reward: 5, penalty: 10, status: 'pending', is_mandatory: false },
];

const STORE_ITEMS = [
  { id: 's1', title: '1 Hora de Videogame', price: 50, blocks_mandatory: false, icon: '🎮' },
  { id: 's2', title: 'Ifood (Junk Food)', price: 100, blocks_mandatory: false, icon: '🍔' },
  { id: 's3', title: 'Dia de Folga Total', price: 300, blocks_mandatory: true, icon: '🛌' },
];

export default function DopamineHacker() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [balance, setBalance] = useState(0);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // States para a Inbox
  const [dumpText, setDumpText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data de Hoje formatada em Português
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  }).format(new Date());

  // --- CORE MECHANICS ---

  // Completar Tarefa
  const completeTask = (task) => {
    setBalance(prev => prev + task.reward);
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
  };

  // Falhar Tarefa (Preguiça/Sem justificativa)
  const failTask = (task) => {
    setBalance(prev => prev - task.penalty);
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'failed' } : t));
  };

  // Comprar na Loja
  const buyItem = (item) => {
    if (balance >= item.price) {
      setBalance(prev => prev - item.price);
      alert(`Compra efetuada: ${item.title}. Aproveite sua recompensa!`);
    }
  };

  // Verificar Trava de Segurança (Smart Lock)
  const hasMandatoryPendingTasks = tasks.some(t => t.is_mandatory && t.status === 'pending');

  // --- MOCK DA IA (Processamento de Linguagem Natural) ---
  const processBrainDump = () => {
    if (!dumpText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulando delay de rede/IA
    setTimeout(() => {
      // Separando por vírgula, " e " ou quebras de linha
      const rawTasks = dumpText.split(/,|\n|\se\s/i).map(t => t.trim()).filter(t => t);
      
      const newTasks = rawTasks.map((title, index) => {
        const lowerTitle = title.toLowerCase();
        
        // Lógica Heurística (Mock da IA)
        let reward = 10;
        let is_mandatory = false;
        let difficulty = 'Fácil';

        // Identificando tarefas de alto atrito/obrigatórias
        if (lowerTitle.includes('estudar') || lowerTitle.includes('trabalhar') || lowerTitle.includes('projeto') || lowerTitle.includes('prova')) {
          reward = 50;
          is_mandatory = true;
          difficulty = 'Difícil';
        } else if (lowerTitle.includes('ligar') || lowerTitle.includes('pagar') || lowerTitle.includes('médico')) {
          reward = 30;
          is_mandatory = true;
          difficulty = 'Média';
        } else if (lowerTitle.includes('limpar') || lowerTitle.includes('arrumar') || lowerTitle.includes('louça')) {
          reward = 15;
          difficulty = 'Chato';
        }

        return {
          id: `ai_${Date.now()}_${index}`,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          reward: reward,
          penalty: reward * 2, // Punição severa: o dobro da recompensa
          status: 'pending',
          is_mandatory: is_mandatory,
          difficulty: difficulty,
          date: todayFormatted
        };
      });

      setTasks([...tasks, ...newTasks]);
      setDumpText('');
      setIsProcessing(false);
      setActiveTab('dashboard'); // Redireciona para o front de batalha
    }, 1500);
  };

  // --- RENDERERS DAS ABAS ---

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (dumpText.trim() && !isProcessing) {
        processBrainDump();
      }
    }
  };

  const renderInbox = () => (
    <div className="flex flex-col h-full p-4 space-y-4 animate-in fade-in">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-white">Descarregar Mente</h2>
        <p className="text-gray-400 text-sm">Jogue tudo que está na cabeça. A IA organiza para hoje.</p>
      </div>
      
      <textarea
        className="flex-1 bg-gray-800 border-2 border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
        placeholder="Ex: estudar hidrologia, cotar preços no mercado e lavar a louça... (Pressione Enter para processar)"
        value={dumpText}
        onChange={(e) => setDumpText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      <button 
        onClick={processBrainDump}
        disabled={isProcessing || !dumpText.trim()}
        className={`py-4 rounded-xl font-bold text-lg transition-all ${
          isProcessing || !dumpText.trim() 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-[0_0_15px_rgba(79,70,229,0.5)]'
        }`}
      >
        {isProcessing ? 'Processando Mágica...' : 'Mapear Tarefas'}
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex flex-col h-full p-4 space-y-6 animate-in fade-in pb-24">
      
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-300 capitalize">{todayFormatted}</h2>
      </div>

      {/* HUD - O Banco */}
      <div className="bg-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center border border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91 2.84.7 4.18 1.7 4.18 3.67 0 1.9-1.4 2.97-3.12 3.4z"/></svg>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">Seu Saldo</p>
        <h1 className={`text-5xl font-black ${balance >= 0 ? 'text-green-400' : 'text-red-500'} tracking-tighter drop-shadow-md`}>
          R$ {balance.toFixed(2)}
        </h1>
      </div>

      {/* Lista de Tarefas */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Nenhuma tarefa hoje. Vá para a Entrada!
          </div>
        )}

        {tasks.map(task => {
          if (task.status !== 'pending') return null; // Só mostra pendentes
          
          return (
            <div key={task.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <h3 className="text-white font-bold text-lg leading-tight">{task.title}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-md font-semibold">
                      +{task.reward} R$
                    </span>
                    {task.is_mandatory && (
                      <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded-md font-semibold border border-red-800/50">
                        Obrigatória
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações Viscerais */}
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => completeTask(task)}
                  className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <CheckIcon /> Feito (+R${task.reward})
                </button>
                <button 
                  onClick={() => failTask(task)}
                  className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <XIcon /> Adiar (-R${task.penalty})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStore = () => (
    <div className="flex flex-col h-full p-4 space-y-6 animate-in fade-in pb-24">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-white">Mercado Negro</h2>
        <p className="text-gray-400 text-sm">Compre recompensas com seu suor.</p>
        <div className="inline-block mt-3 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
          <span className="text-gray-400 text-sm font-bold">Saldo: </span>
          <span className="text-green-400 font-bold">R$ {balance.toFixed(2)}</span>
        </div>
      </div>

      {hasMandatoryPendingTasks && (
        <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-xl text-center">
          <p className="text-red-400 text-sm font-bold flex items-center justify-center gap-2">
            <AlertTriangleIcon />
            Trava de Segurança Ativa!
          </p>
          <p className="text-red-200 text-xs mt-1">
            Você tem tarefas OBRIGATÓRIAS pendentes. Itens de "Folga" estão bloqueados.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {STORE_ITEMS.map(item => {
          const isAffordable = balance >= item.price;
          const isLocked = item.blocks_mandatory && hasMandatoryPendingTasks;
          const isDisabled = !isAffordable || isLocked;

          return (
            <div key={item.id} className={`bg-gray-800 rounded-2xl p-5 border ${isLocked ? 'border-red-900/50 opacity-70' : 'border-gray-700'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className="text-4xl bg-gray-700 w-14 h-14 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className={`${isAffordable ? 'text-green-400' : 'text-gray-500'} font-black text-sm`}>
                    R$ {item.price}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => buyItem(item)}
                disabled={isDisabled}
                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                  isDisabled 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-900 hover:bg-gray-200 active:scale-90 shadow-lg'
                }`}
              >
                {isLocked ? 'Bloqueado' : 'Comprar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 font-sans selection:bg-indigo-500/30 flex justify-center">
      {/* Mobile Wrapper Container */}
      <div className="w-full max-w-md bg-gray-900 min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Top Spacer for mobile status bar */}
        <div className="h-6"></div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'inbox' && renderInbox()}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'store' && renderStore()}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-gray-900 border-t border-gray-800 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <NavButton 
            icon={<InboxIcon />} 
            label="Entrada" 
            isActive={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')} 
          />
          <NavButton 
            icon={<TargetIcon />} 
            label="Hoje" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavButton 
            icon={<ShoppingBagIcon />} 
            label="Loja" 
            isActive={activeTab === 'store'} 
            onClick={() => setActiveTab('store')} 
          />
        </div>

      </div>
    </div>
  );
}

// --- ICONS & MINI COMPONENTS ---

const NavButton = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-16 transition-all ${
      isActive ? 'text-indigo-400 scale-110' : 'text-gray-500 hover:text-gray-400'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

// SVG Icons Inline for zero dependencies
const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);