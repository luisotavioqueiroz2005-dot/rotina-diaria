import React, { useState } from 'react';
import { BookOpen, Database, Brain, Layout, CheckCircle2, ShieldAlert, Zap, ArrowRight, Code } from 'lucide-react';

export const PRDDocSection: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'prd' | 'database' | 'nlp_logic' | 'ux_flow'>('prd');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Documentação de Engenharia de Software
        </div>
        <h2 className="text-2xl font-black text-white">Especificação do Sistema & PRD TDAH</h2>
        <p className="text-gray-300 text-sm">
          Arquitetura técnica, modelo de banco de dados, motor de PLN e requisitos do Dopamine Hacker.
        </p>

        {/* Subtab Navigation */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('prd')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'prd'
                ? 'bg-purple-600 border-purple-400 text-white shadow'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 1. PRD do Sistema
          </button>

          <button
            onClick={() => setActiveSubTab('database')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'database'
                ? 'bg-purple-600 border-purple-400 text-white shadow'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> 2. Banco de Dados Schema
          </button>

          <button
            onClick={() => setActiveSubTab('nlp_logic')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'nlp_logic'
                ? 'bg-purple-600 border-purple-400 text-white shadow'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" /> 3. Lógica NLP & Aprendizado IA
          </button>

          <button
            onClick={() => setActiveSubTab('ux_flow')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeSubTab === 'ux_flow'
                ? 'bg-purple-600 border-purple-400 text-white shadow'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> 4. Fluxo de Telas UX
          </button>
        </div>
      </div>

      {/* Subtab 1: PRD */}
      {activeSubTab === 'prd' && (
        <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 space-y-6 text-gray-200 text-sm leading-relaxed shadow-xl">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-xl font-black text-white">Documento de Requisitos do Sistema (PRD)</h3>
            <p className="text-xs text-indigo-300 font-semibold mt-1">Dopamine Hacker v1.0 — Módulo Gamificado TDAH</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Visão Geral do Produto
            </h4>
            <p className="text-gray-300">
              O <strong>Dopamine Hacker</strong> é um aplicativo de gestão de rotina focado no transtorno de déficit de atenção e hiperatividade (TDAH). Em vez de tentar usar força de vontade ou listas estáticas (que o cérebro TDAH ignora por falta de dopamina), o sistema utiliza <strong>Mecanismos Viscerais de Economia Dinâmica</strong>, <strong>Aversão à Perda (Loss Aversion)</strong> e <strong>Interpretação Semântica por IA</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
                <h5 className="font-bold text-indigo-300">1. Caixa de Entrada Inteligente (Brain Dump)</h5>
                <p className="text-xs text-gray-400">
                  O usuário descarrega frases soltas em texto ou voz. O modelo LLM (Gemini 3.8 Flash) segmenta ações, extrai verbos, infere o nível de atrito e gera o preço em R$ virtuais.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
                <h5 className="font-bold text-emerald-300">2. Precificação por Atrito Emocional</h5>
                <p className="text-xs text-gray-400">
                  Tarefas chatas ou pesadas (alto atrito) pagam bônus altos (R$ 50 - 100). Tarefas simples (baixo atrito) pagam valores base (R$ 5 - 15).
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
                <h5 className="font-bold text-rose-300">3. Punição por Procrastinação (Loss Aversion)</h5>
                <p className="text-xs text-gray-400">
                  Adiar tarefas por preguiça desconta valor dobrado do saldo virtual. A dor da perda financeira instantânea desativa a paralisia do TDAH.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
                <h5 className="font-bold text-amber-300">4. Bônus de Hiperfoco & Hora Extra</h5>
                <p className="text-xs text-gray-400">
                  Se a previsão era 1h e o usuário estendeu o trabalho em foco por 2h, o app calcula bônus financeiro proporcional ao tempo adicional.
                </p>
              </div>

              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2 md:col-span-2">
                <h5 className="font-bold text-purple-300">5. Mercado Negro com Trava de Segurança (Smart Lock)</h5>
                <p className="text-xs text-gray-400">
                  Resgate de horas de descanso ou dias de folga no fim de semana usando o saldo. O sistema bloqueia folgas automaticamente se houver obrigações inadiáveis pendentes no dia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Database Schema */}
      {activeSubTab === 'database' && (
        <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 space-y-6 text-gray-200 text-sm leading-relaxed shadow-xl">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Estrutura do Banco de Dados Relacional / NoSQL
            </h3>
            <p className="text-xs text-indigo-300 font-semibold mt-1">Modelagem otimizada para transações de economia virtual e feedback de IA</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Table Users */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold text-sm">TABLE users</div>
              <pre className="text-gray-300 overflow-x-auto p-2 bg-gray-950 rounded-xl">
{`id: VARCHAR PRIMARY KEY
name: VARCHAR NOT NULL
balance_virtual: DECIMAL(10,2) DEFAULT 0.00
streak_days: INT DEFAULT 0
total_earned: DECIMAL(10,2) DEFAULT 0.00
total_penalties: DECIMAL(10,2) DEFAULT 0.00
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP`}
              </pre>
            </div>

            {/* Table Tasks */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold text-sm">TABLE tasks</div>
              <pre className="text-gray-300 overflow-x-auto p-2 bg-gray-950 rounded-xl">
{`id: VARCHAR PRIMARY KEY
user_id: VARCHAR FOREIGN KEY REFERENCES users(id)
title: TEXT NOT NULL
category: VARCHAR(50) -- Estudos, Trabalho, Saúde, Finanças, Casa
friction_level: ENUM('ALTO', 'MÉDIO', 'BAIXO')
estimated_minutes: INT NOT NULL
actual_minutes: INT DEFAULT NULL
reward_virtual: DECIMAL(10,2) NOT NULL
penalty_virtual: DECIMAL(10,2) NOT NULL
overtime_bonus_calculated: DECIMAL(10,2) DEFAULT 0.00
is_mandatory: BOOLEAN DEFAULT FALSE
status: ENUM('pending', 'completed', 'failed_laziness', 'deferred_valid')
target_date: DATE NOT NULL
adhd_tip: TEXT
created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
completed_at: TIMESTAMP DEFAULT NULL`}
              </pre>
            </div>

            {/* Table Routine Checkins */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold text-sm">TABLE routine_checkins</div>
              <pre className="text-gray-300 overflow-x-auto p-2 bg-gray-950 rounded-xl">
{`id: VARCHAR PRIMARY KEY
user_id: VARCHAR FOREIGN KEY REFERENCES users(id)
title: VARCHAR(255) NOT NULL
base_reward: DECIMAL(10,2) NOT NULL
base_penalty: DECIMAL(10,2) NOT NULL
is_mandatory: BOOLEAN DEFAULT FALSE
category: VARCHAR(50)
completed_dates: JSONB DEFAULT '[]'`}
              </pre>
            </div>

            {/* Table Reward Store */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold text-sm">TABLE reward_store_items</div>
              <pre className="text-gray-300 overflow-x-auto p-2 bg-gray-950 rounded-xl">
{`id: VARCHAR PRIMARY KEY
title: VARCHAR(255) NOT NULL
price_virtual: DECIMAL(10,2) NOT NULL
icon: VARCHAR(50)
item_type: ENUM('hour_rest', 'day_off', 'snack', 'custom')
blocks_on_mandatory_pending: BOOLEAN DEFAULT TRUE
description: TEXT`}
              </pre>
            </div>

            {/* Table Transactions Log */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 space-y-2">
              <div className="text-indigo-400 font-bold text-sm">TABLE transactions_log</div>
              <pre className="text-gray-300 overflow-x-auto p-2 bg-gray-950 rounded-xl">
{`id: VARCHAR PRIMARY KEY
user_id: VARCHAR FOREIGN KEY REFERENCES users(id)
amount: DECIMAL(10,2) NOT NULL -- positivo para ganhos, negativo para punições/compras
tx_type: ENUM('REWARD_TASK', 'PENALTY_LAZINESS', 'BONUS_OVERTIME', 'STORE_PURCHASE', 'ROUTINE_CHECKIN')
description: TEXT NOT NULL
timestamp: TIMESTAMP DEFAULT CURRENT_TIMESTAMP`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: NLP Logic & AI Learning */}
      {activeSubTab === 'nlp_logic' && (
        <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 space-y-6 text-gray-200 text-sm leading-relaxed shadow-xl">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" /> Pipeline de Processamento NLP & Aprendizado da IA
            </h3>
            <p className="text-xs text-indigo-300 font-semibold mt-1">Detalhamento técnico da extração de verbos, estimativas e aprendizado contínuo</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
              <h4 className="font-bold text-white text-base">1. Tokenização & Extração Semântica</h4>
              <p className="text-gray-300">
                A entrada do usuário (ex: <em>"estudar hidrologia, arrumar quarto, cotar preços no mercado"</em>) passa pelo seguinte fluxo no Gemini 3.8 Flash:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-xs">
                <li><strong>Identificação de Verbos de Ação:</strong> Ex: <em>estudar</em>, <em>arrumar</em>, <em>cotar</em>.</li>
                <li><strong>Extração de Objetos & Escopo:</strong> Ex: <em>hidrologia</em> (complexo/acadêmico), <em>quarto</em> (doméstico/curto), <em>preços no mercado</em> (pesquisa/burocrático).</li>
                <li><strong>Classificação de Atrito Emocional:</strong> Mede o custo cognitivo percebido para um cérebro TDAH iniciar a tarefa.</li>
              </ul>
            </div>

            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
              <h4 className="font-bold text-white text-base">2. Regra de Precificação Dinâmica & Loss Aversion</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-950 p-2.5 rounded-xl border border-rose-900/50">
                  <span className="text-rose-400 font-bold block">ALTO ATRITO</span>
                  <span className="text-white font-black">+R$ 60 - 100</span>
                  <span className="text-rose-400 text-[10px] block">Punição: -R$ 120 - 200</span>
                </div>
                <div className="bg-gray-950 p-2.5 rounded-xl border border-amber-900/50">
                  <span className="text-amber-400 font-bold block">MÉDIO ATRITO</span>
                  <span className="text-white font-black">+R$ 25 - 45</span>
                  <span className="text-amber-400 text-[10px] block">Punição: -R$ 50 - 90</span>
                </div>
                <div className="bg-gray-950 p-2.5 rounded-xl border border-emerald-900/50">
                  <span className="text-emerald-400 font-bold block">BAIXO ATRITO</span>
                  <span className="text-white font-black">+R$ 10 - 20</span>
                  <span className="text-emerald-400 text-[10px] block">Punição: -R$ 20 - 40</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-700 space-y-2">
              <h4 className="font-bold text-white text-base">3. Aprendizado por Feedback Contínuo (Reinforcement Loop)</h4>
              <p className="text-gray-300 text-xs">
                À medida que o usuário completa tarefas e registra o <strong>tempo real de execução (actual_minutes)</strong>, a IA ajusta os multiplicadores de atrito no banco de dados. Se o usuário sistematicamente leva 120 minutos em tarefas que a IA estimou em 60m, o modelo recalibra o perfil do usuário para atribuir recompensas maiores a essa categoria específica.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: UX Flow */}
      {activeSubTab === 'ux_flow' && (
        <div className="bg-gray-800/90 border border-gray-700/80 rounded-3xl p-6 space-y-6 text-gray-200 text-sm leading-relaxed shadow-xl">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-400" /> Fluxo de Telas UX de Zero Atrito
            </h3>
            <p className="text-xs text-indigo-300 font-semibold mt-1">Design de interface pensado para evitar o cansaço de decisão TDAH</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-700 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">Passo 1</span>
                <h5 className="font-bold text-white">Descarregar Mente (Brain Dump)</h5>
                <p className="text-xs text-gray-400">Caixa única gigante sem formulários chatos. Digite ou fale e clique em 1 botão.</p>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0 hidden sm:block" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-700 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">Passo 2</span>
                <h5 className="font-bold text-white">Preview e Envio para Agenda</h5>
                <p className="text-xs text-gray-400">A IA exibe os cards precificados com a Dica de 2 Minutos para iniciar. Clique único em "Confirmar".</p>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0 hidden sm:block" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-700 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">Passo 3</span>
                <h5 className="font-bold text-white">Front de Batalha (Ações Viscerais)</h5>
                <p className="text-xs text-gray-400">
                  Botões gigantes de 1 toque: <strong>"Concluir (+R$)"</strong> para creditar saldo e registrar bônus de hora extra, ou <strong>"Adiar (-R$)"</strong> com aviso de Loss Aversion.
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0 hidden sm:block" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-700 gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase">Passo 4</span>
                <h5 className="font-bold text-white">Mercado Negro & Recompensas</h5>
                <p className="text-xs text-gray-400">
                  Compre folgas e lazer com seu saldo acumulado. Se houver compromisso obrigatório pendente, a trava de segurança bloqueia folgas até terminar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
