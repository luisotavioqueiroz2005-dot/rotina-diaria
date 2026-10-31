import React, { useState } from 'react';
import { StoreItem, Task } from '../types';
import { ShoppingBag, Lock, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Coins } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface StoreSectionProps {
  balance: number;
  items: StoreItem[];
  tasks: Task[];
  onPurchaseItem: (item: StoreItem) => void;
}

export const StoreSection: React.FC<StoreSectionProps> = ({
  balance,
  items,
  tasks,
  onPurchaseItem,
}) => {
  const [lastPurchased, setLastPurchased] = useState<string | null>(null);

  // Check if there are mandatory tasks pending for today
  const hasMandatoryPending = tasks.some(
    (t) => t.target_date === 'hoje' && t.is_mandatory && t.status === 'pending'
  );

  const handleBuy = (item: StoreItem) => {
    if (balance < item.price) return;
    if (item.blocks_mandatory && hasMandatoryPending) return;

    soundFx.playReward();
    onPurchaseItem(item);
    setLastPurchased(`Você comprou "${item.title}" por R$ ${item.price.toFixed(2)}! Aproveite sem culpa.`);
    setTimeout(() => setLastPurchased(null), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* Store Header - Zona da Loja VIP Dourada */}
      <div className="zone-store rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          Área VIP de Recompensas (Zona Dourada)
        </div>
        <h2 className="text-2xl font-black text-white">Mercado Negro de Descanso</h2>
        <p className="text-amber-100/90 text-sm">
          Troque seu saldo de R$ virtuais (ganhos com suor e foco) por momentos de lazer sem peso na consciência.
        </p>

        <div className="inline-flex items-center gap-2 bg-black/80 border border-amber-500/40 px-4 py-2 rounded-2xl mt-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-300 font-bold">Saldo Disponível:</span>
          <span className={`font-black text-base ${balance >= 0 ? 'text-amber-400' : 'text-rose-500'}`}>
            R$ {balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trava de Segurança Warning Banner */}
      {hasMandatoryPending}
      <div className={`p-4 rounded-2xl border transition-all ${
        hasMandatoryPending
          ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          {hasMandatoryPending ? (
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1 text-xs">
            <h4 className="font-black text-sm">
              {hasMandatoryPending ? 'Trava de Segurança Ativa! (Smart Lock)' : 'Trava de Segurança Desativada'}
            </h4>
            <p>
              {hasMandatoryPending
                ? 'Você possui compromissos obrigatórios inadiáveis pendentes para hoje. A compra de "Dias de Folga" e "Passeios" está bloqueada até você concluir suas obrigações!'
                : 'Todas as obrigações do dia foram cumpridas. Todos os itens da loja estão desbloqueados para compra!'}
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {lastPurchased && (
        <div className="bg-emerald-900 border border-emerald-500 text-emerald-100 p-4 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg animate-in slide-in-from-top">
          <Sparkles className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{lastPurchased}</span>
        </div>
      )}

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const isAffordable = balance >= item.price;
          const isLockedByMandatory = item.blocks_mandatory && hasMandatoryPending;
          const isDisabled = !isAffordable || isLockedByMandatory;

          return (
            <div
              key={item.id}
              className={`bg-gray-800/90 border rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                isLockedByMandatory
                  ? 'border-rose-900/60 bg-gray-900/80 opacity-70'
                  : !isAffordable
                  ? 'border-gray-700/60 opacity-80'
                  : 'border-gray-700 hover:border-purple-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="text-4xl bg-gray-900 border border-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Preço Virtual</span>
                    <span className={`font-black text-lg ${isAffordable ? 'text-emerald-400' : 'text-gray-500'}`}>
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base leading-snug flex items-center gap-1.5">
                    {item.title}
                    {isLockedByMandatory && (
                      <span title="Bloqueado por obrigações pendentes">
                        <Lock className="w-4 h-4 text-rose-400 inline shrink-0" />
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>

              {/* Status & Purchase Button */}
              <div className="space-y-2 pt-2 border-t border-gray-700/60">
                {isLockedByMandatory && (
                  <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Bloqueado: Conclua tarefas obrigatórias primeiro.
                  </p>
                )}

                {!isAffordable && !isLockedByMandatory && (
                  <p className="text-[10px] text-amber-400 font-bold">
                    Saldo insuficiente (Faltam R$ {(item.price - balance).toFixed(2)})
                  </p>
                )}

                <button
                  onClick={() => handleBuy(item)}
                  disabled={isDisabled}
                  className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    isDisabled
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 active:scale-95'
                  }`}
                >
                  {isLockedByMandatory ? (
                    <>
                      <Lock className="w-4 h-4" /> Bloqueado (Trava)
                    </>
                  ) : !isAffordable ? (
                    'Saldo Insuficiente'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Comprar Recompensa
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
