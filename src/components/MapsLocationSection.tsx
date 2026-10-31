import React, { useState } from 'react';
import { MapPin, Navigation, Search, Clock, Plus, Compass, ExternalLink } from 'lucide-react';
import { Task } from '../types';

interface MapsLocationSectionProps {
  onAddTask: (task: Task) => void;
  onNavigateToDashboard: () => void;
}

export const MapsLocationSection: React.FC<MapsLocationSectionProps> = ({ onAddTask, onNavigateToDashboard }) => {
  const [searchQuery, setSearchQuery] = useState('Mercado Municipal');
  const [origin, setOrigin] = useState('Minha Localização');
  const [destination, setDestination] = useState('Supermercado / Faculdade');
  const [transportMode, setTransportMode] = useState<'driving' | 'walking' | 'transit'>('driving');
  const [estimatedTravelMinutes, setEstimatedTravelMinutes] = useState<number>(25);
  const [locationName, setLocationName] = useState('Mercado Central - Cotar Preços');

  const samplePlaces = [
    { name: 'Supermercado Carrefour', category: 'Finanças/Mercado', estMin: 35, friction: 'MÉDIO' as const },
    { name: 'Biblioteca da Universidade', category: 'Estudos', estMin: 45, friction: 'ALTO' as const },
    { name: 'Drogaria São Paulo', category: 'Saúde', estMin: 15, friction: 'BAIXO' as const },
    { name: 'Academia SmartFit', category: 'Saúde/Treino', estMin: 30, friction: 'MÉDIO' as const },
  ];

  const handleCreateLocationTask = (placeName: string, minutes: number, friction: 'ALTO' | 'MÉDIO' | 'BAIXO', category: string) => {
    const reward = friction === 'ALTO' ? 60 : friction === 'MÉDIO' ? 30 : 15;
    const newTask: Task = {
      id: `map_${Date.now()}`,
      title: `Ir até ${placeName} e concluir compromisso`,
      category,
      friction_level: friction,
      estimated_minutes: minutes,
      reward_virtual: reward,
      penalty_virtual: reward * 2,
      is_mandatory: false,
      status: 'pending',
      target_date: 'hoje',
      adhd_tip: 'Defina a rota no GPS antes de sair de casa para não perder o foco.',
      created_at: new Date().toISOString(),
    };

    onAddTask(newTask);
    onNavigateToDashboard();
  };

  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${transportMode}`;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 pb-28 animate-in fade-in">
      {/* Maps Header */}
      <div className="bg-gradient-to-r from-teal-900/60 via-emerald-900/40 to-gray-900 border border-teal-500/30 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          Conectado ao Google Maps Real-Time
        </div>
        <h2 className="text-2xl font-black text-white">Rotas, Locais & Estimativa de Deslocamento</h2>
        <p className="text-gray-300 text-sm">
          Pesquise destinos para suas tarefas de deslocamento (compras, exames, trabalho). Calcule o tempo real de trajeto para precificar com precisão seu atrito e recompensa em R$!
        </p>
      </div>

      {/* Places Search Input */}
      <div className="bg-gray-800/90 border border-gray-700/80 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar local no Google Maps..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all"
          >
            Abrir no Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Map iFrame */}
        <div className="rounded-2xl overflow-hidden border border-gray-700 shadow-inner h-64 bg-gray-900 relative">
          <iframe
            title="Google Maps Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={googleMapsEmbedUrl}
          />
        </div>

        {/* Quick Sample Locations */}
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <span className="text-xs font-bold text-gray-300 uppercase block">
            Locais Frequentes & Agendamento Rápido:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {samplePlaces.map((place, idx) => (
              <div
                key={idx}
                className="bg-gray-900 border border-gray-700/80 p-3 rounded-xl flex items-center justify-between gap-2 hover:border-teal-500/50 transition-all"
              >
                <div>
                  <div className="font-bold text-white">{place.name}</div>
                  <div className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{place.estMin} min de trajeto | Atrito {place.friction}
                  </div>
                </div>

                <button
                  onClick={() => handleCreateLocationTask(place.name, place.estMin, place.friction, place.category)}
                  className="bg-teal-600/80 hover:bg-teal-500 text-white p-2 rounded-lg font-bold text-xs shrink-0 transition-all active:scale-95 flex items-center gap-1"
                  title="Transformar em Tarefa"
                >
                  <Plus className="w-3.5 h-3.5" /> Agenda
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
