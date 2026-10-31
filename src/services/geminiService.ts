import { Task } from '../types';

export async function parseBrainDumpWithAI(dumpText: string): Promise<Task[]> {
  try {
    const res = await fetch('/api/gemini/parse-brain-dump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dumpText }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erro ${res.status} no servidor`);
    }

    const data = await res.json();
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Formato retornado pela IA é inválido.');
    }

    const nowIso = new Date().toISOString();
    return data.tasks.map((raw: any, index: number) => ({
      id: `ai_${Date.now()}_${index}`,
      title: raw.title || 'Tarefa sem nome',
      category: raw.category || 'Geral',
      friction_level: (['ALTO', 'MÉDIO', 'BAIXO'].includes(raw.friction_level) ? raw.friction_level : 'MÉDIO') as any,
      urgency_level: (['CRÍTICA', 'ALTA', 'MÉDIA', 'BAIXA'].includes(raw.urgency_level) ? raw.urgency_level : 'ALTA') as any,
      estimated_minutes: Number(raw.estimated_minutes) || 30,
      reward_virtual: Number(raw.reward_virtual) || 20,
      penalty_virtual: Number(raw.penalty_virtual) || 40,
      is_mandatory: Boolean(raw.is_mandatory),
      status: 'pending',
      target_date: raw.target_date === 'amanhã' ? 'amanhã' : 'hoje',
      adhd_tip: raw.adhd_tip || 'Divida em passos mínimos de 2 minutos para iniciar.',
      created_at: nowIso,
    }));
  } catch (error) {
    console.warn('Falha na chamada ao Gemini API, usando gerador heurístico local:', error);
    // Client-side fallback if server issue
    return fallbackParse(dumpText);
  }
}

export interface JudgeVerdictResponse {
  verdict: 'DESCULPA_ESFARRAPADA' | 'MOTIVO_VALIDO';
  verdict_title: string;
  multiplier: number;
  calculated_fine: number;
  judge_feedback: string;
}

export async function judgeDeferralWithAI(
  taskTitle: string,
  basePenalty: number,
  reasonText: string
): Promise<JudgeVerdictResponse> {
  try {
    const res = await fetch('/api/gemini/judge-deferral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskTitle, basePenalty, reasonText }),
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Falha ao conectar com Tribunal da IA, aplicando veredito padrão de rigor:', error);
    const lower = reasonText.toLowerCase();
    const isValid = lower.includes('hospital') || lower.includes('médico') || lower.includes('emergência') || lower.includes('febre') || lower.includes('energia');
    const mult = isValid ? 0.7 : 2.5;

    return {
      verdict: isValid ? 'MOTIVO_VALIDO' : 'DESCULPA_ESFARRAPADA',
      verdict_title: isValid ? 'MULTA MITIGADA POR FORÇA MAIOR' : 'PUNIÇÃO SEVERA POR PREGUIÇA',
      multiplier: mult,
      calculated_fine: Math.round(basePenalty * mult * 100) / 100,
      judge_feedback: isValid
        ? 'Imprevistos acontecem, mas a taxa de atrito é mantida. Nenhuma exceção zera a multa.'
        : 'O Tribunal repudia justificativas fracas. Multa multiplicada por 2.5x para forçar disciplina.',
    };
  }
}

export async function transcribeAudioWithGemini(audioBlob: Blob): Promise<string> {
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
  });

  reader.readAsDataURL(audioBlob);
  const base64Data = await base64Promise;

  const res = await fetch('/api/gemini/transcribe-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Data, mimeType: audioBlob.type || 'audio/webm' }),
  });

  if (!res.ok) {
    throw new Error('Falha ao transcrever áudio.');
  }

  const data = await res.json();
  return data.text || '';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function sendCoachChatMessage(messages: ChatMessage[], userMessage: string): Promise<string> {
  const res = await fetch('/api/gemini/coach-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userMessage }),
  });

  if (!res.ok) {
    throw new Error('Erro na resposta do Coach.');
  }

  const data = await res.json();
  return data.responseText || '';
}

function fallbackParse(text: string): Task[] {
  const parts = text.split(/,|\n|\se\s/i).map(s => s.trim()).filter(Boolean);
  const nowIso = new Date().toISOString();

  return parts.map((part, index) => {
    const lower = part.toLowerCase();
    let friction: 'ALTO' | 'MÉDIO' | 'BAIXO' = 'MÉDIO';
    let reward = 25;
    let isMandatory = false;
    let minutes = 30;
    let category = 'Geral';
    let tip = 'Ligue um timer de 5 minutos apenas para dar o primeiro passo.';

    if (lower.includes('estudar') || lower.includes('prova') || lower.includes('hidrologia') || lower.includes('trabalhar') || lower.includes('relatório')) {
      friction = 'ALTO';
      reward = 60;
      isMandatory = true;
      minutes = 60;
      category = 'Estudos/Trabalho';
      tip = 'Abra o documento e leia apenas a primeira frase sem compromisso de continuar.';
    } else if (lower.includes('cotar') || lower.includes('comprar') || lower.includes('médico') || lower.includes('pagar')) {
      friction = 'MÉDIO';
      reward = 35;
      isMandatory = true;
      minutes = 25;
      category = 'Finanças/Saúde';
      tip = 'Abra a aba do navegador agora e busque só a primeira opção.';
    } else if (lower.includes('arrumar') || lower.includes('quarto') || lower.includes('louça') || lower.includes('limpar')) {
      friction = 'BAIXO';
      reward = 15;
      isMandatory = false;
      minutes = 15;
      category = 'Casa';
      tip = 'Guarde apenas 3 objetos no lugar e comemore a micro-vitória.';
    }

    let urgency: 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA' = isMandatory ? 'CRÍTICA' : friction === 'ALTO' ? 'ALTA' : 'MÉDIA';

    return {
      id: `fb_${Date.now()}_${index}`,
      title: part.charAt(0).toUpperCase() + part.slice(1),
      category,
      friction_level: friction,
      urgency_level: urgency,
      estimated_minutes: minutes,
      reward_virtual: reward,
      penalty_virtual: reward * 2,
      is_mandatory: isMandatory,
      status: 'pending',
      target_date: lower.includes('amanhã') ? 'amanhã' : 'hoje',
      adhd_tip: tip,
      created_at: nowIso,
    };
  });
}
