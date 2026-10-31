import React, { useState } from 'react';
import { UserProfile, getAllUsers, createNewUserAccount } from '../services/authService';
import { LogIn, UserPlus, Users, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, onSelectUser, onClose }) => {
  const [mode, setMode] = useState<'switch' | 'register'>('switch');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const allUsers = getAllUsers();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    const newUser = createNewUserAccount(nameInput, emailInput);
    onSelectUser(newUser);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Sistema Multi-Usuário Isolar
          </div>
          <h3 className="text-xl font-black text-white">Gerenciar Conta / Login</h3>
          <p className="text-xs text-gray-400">
            Cada perfil possui saldo, tarefas, rotinas e IA estritamente individuais.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'switch' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Alternar Conta ({allUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Criar Nova Conta (R$ 0,00)
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {allUsers.map((user) => {
              const isSelected = user.id === currentUser.id;

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                      : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm flex items-center gap-2">
                      {user.name}
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase">
                          Ativo
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>

                  {isSelected ? (
                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                  ) : (
                    <LogIn className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-emerald-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Garantia de Estado Inicial Zerado:</strong>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  Esta nova conta iniciará exatamente com <strong>R$ 0,00 de saldo</strong> e agenda 100% limpa.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300 uppercase block">Nome do Usuário</label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Andrade"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-300 uppercase block">E-mail para Login</label>
              <input
                type="email"
                required
                placeholder="carlos@exemplo.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Criar Perfil e Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
