import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Endpoint to process Brain Dump with AI
app.post('/api/gemini/parse-brain-dump', async (req, res) => {
  try {
    const { dumpText } = req.body;

    if (!dumpText || typeof dumpText !== 'string' || !dumpText.trim()) {
      return res.status(400).json({ error: 'Texto de entrada inválido ou vazio.' });
    }

    const systemInstruction = `Você é um motor de Inteligência Artificial especialista em Psicologia Comportamental, TDAH (Transtorno do Deficit de Atenção com Hiperatividade) e Gamificação Severa.
Sua missão é receber um "Brain Dump" (texto livre e desorganizado de um usuário TDAH) e transformá-lo em um plano de ação altamente estruturado com Economia Dinâmica de R$ Virtuais.

Regras de Precificação e Atrito:
1. Tarefas de ALTO ATRITO (estudos complexos, burocracia, médicos, trabalhos pesados, entregar relatórios, cotar preços chatos):
   - Friction: "ALTO"
   - Reward (R$): 40 a 100 R$
   - Penalty (R$): 2x o valor da recompensa (Loss Aversion severa)
   - Is Mandatory: true (se for compromisso inadiável ou prazo firme)
   - Estimated Minutes: 45 a 120 minutos
2. Tarefas de MÉDIO ATRITO (ligações, arrumar cômodo grande, lavar acúmulo de louça, treinar):
   - Friction: "MÉDIO"
   - Reward (R$): 20 a 35 R$
   - Penalty (R$): 1.5x a 2x recompensa
   - Is Mandatory: false ou true dependendo do contexto
   - Estimated Minutes: 20 a 45 minutos
3. Tarefas de BAIXO ATRITO (arrumar cama, tomar água, levar lixo, ler 2 páginas):
   - Friction: "BAIXO"
   - Reward (R$): 5 a 15 R$
   - Penalty (R$): 10 a 20 R$
   - Is Mandatory: false
   - Estimated Minutes: 5 a 15 minutos

Para cada tarefa, inclua também um "adhd_tip" (uma dica de micro-passo de 2 minutos para vencer a paralisia do TDAH).
Identifique a data alvo ("hoje" ou "amanhã") baseado nas palavras do usuário. Se o usuário diz "dia seguinte" ou "amanhã", marque target_date="amanhã", senão "hoje".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Interprete o seguinte Brain Dump e monte a lista de tarefas precificadas:\n\n"${dumpText}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Lista de tarefas interpretadas pela IA',
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título claro e objetivo da ação' },
              category: { type: Type.STRING, description: 'Categoria (Ex: Estudos, Trabalho, Saúde, Casa, Finanças, Pessoal)' },
              friction_level: { type: Type.STRING, description: 'ALTO, MÉDIO ou BAIXO' },
              urgency_level: { type: Type.STRING, description: 'CRÍTICA, ALTA, MÉDIA ou BAIXA' },
              estimated_minutes: { type: Type.INTEGER, description: 'Tempo estimado em minutos' },
              reward_virtual: { type: Type.NUMBER, description: 'Recompensa em R$ virtuais' },
              penalty_virtual: { type: Type.NUMBER, description: 'Punição em R$ virtuais se falhar/adiar' },
              is_mandatory: { type: Type.BOOLEAN, description: 'Se é um compromisso obrigatório/inadiável' },
              target_date: { type: Type.STRING, description: 'hoje ou amanhã' },
              adhd_tip: { type: Type.STRING, description: 'Dica de micro-ação de 2 minutos' },
            },
            required: [
              'title',
              'category',
              'friction_level',
              'urgency_level',
              'estimated_minutes',
              'reward_virtual',
              'penalty_virtual',
              'is_mandatory',
              'target_date',
              'adhd_tip',
            ],
          },
        },
      },
    });

    const jsonText = response.text || '[]';
    const parsedTasks = JSON.parse(jsonText);

    return res.json({ tasks: parsedTasks });
  } catch (error: any) {
    console.error('Erro ao processar Brain Dump:', error);
    return res.status(500).json({
      error: 'Falha ao processar o Brain Dump com a IA.',
      details: error?.message || String(error),
    });
  }
});

// API Endpoint: Tribunal da IA - Juiz Severo de Adiamentos
app.post('/api/gemini/judge-deferral', async (req, res) => {
  try {
    const { taskTitle, basePenalty, reasonText } = req.body;

    if (!reasonText || typeof reasonText !== 'string' || !reasonText.trim()) {
      return res.status(400).json({ error: 'Justificativa de adiamento necessária.' });
    }

    const systemInstruction = `Você é o "JUIZ IMPLACÁVEL DO TRIBUNAL DA IA" do aplicativo Dopamine Hacker.
Sua missão é atuar como um magistrado extremamente linha-dura, frio e incorruptível especialista em disciplina para TDAH.
Você está julgando a justificativa do usuário para adiar a tarefa: "${taskTitle}".
A punição base pré-configurada é de R$ ${basePenalty}.

REGRAS DE JULGAMENTO (LEI SEVERA DE DISCIPLINA):
1. Se a justificativa for PREGUIÇA, PROCRASTINAÇÃO, CANSAÇO SIMPLES, DESISTÊNCIA OU DESCULPA ESFARRAPADA (ex: "tô com preguiça", "faço depois", "vou ver TV", "cansado", "não deu tempo por bobeira"):
   - verdict: "DESCULPA_ESFARRAPADA"
   - verdict_title: "PUNIÇÃO SEVERA POR PREGUIÇA E FRAQUEZA"
   - multiplier: entre 2.0 e 4.0 (Aumenta drasticamente a multa para cobrar muito caro pelo ato de fraqueza!)
   - judge_feedback: Uma sentença dura, ácida e direta ao ponto que envergonha a desculpa do TDAH e exige disciplina imediata.

2. Se a justificativa for UMA EMERGÊNCIA MÉDICA REAL, IMPEDIMENTO FÍSICO INCONTESTÁVEL OU FORÇA MAIOR (ex: "estou no hospital com febre alta", "houve queda de energia geral na rua", "acidente com parente"):
   - verdict: "MOTIVO_VALIDO"
   - verdict_title: "MULTA MITIGADA POR FORÇA MAIOR"
   - multiplier: entre 0.5 e 0.8 (Diminui a pena)
   - REGRA INVIOLÁVEL: NUNCA ZERE A MULTA! NUNCA RETORNE MULTIPLIER 0 OU MENOR QUE 0.5. Disciplina exige aceitar a taxa de atrito mesmo em imprevistos.
   - judge_feedback: Reconheça o imprevisto real com tom firme e respeitoso, mas lembre o usuário que nenhum adiamento sai de graça no Dopamine Hacker.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Tarefa: "${taskTitle}"\nMulta Base: R$ ${basePenalty}\nJustificativa do Usuário: "${reasonText}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          description: 'Veredito do Tribunal da IA',
          properties: {
            verdict: { type: Type.STRING, description: 'DESCULPA_ESFARRAPADA ou MOTIVO_VALIDO' },
            verdict_title: { type: Type.STRING, description: 'Título solene e austero da sentença' },
            multiplier: { type: Type.NUMBER, description: 'Multiplicador da multa base' },
            judge_feedback: { type: Type.STRING, description: 'Frase dura do Juiz da IA' },
          },
          required: ['verdict', 'verdict_title', 'multiplier', 'judge_feedback'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const result = JSON.parse(jsonText);

    const mult = Number(result.multiplier) || 2.0;
    const calculatedFine = Math.round(Number(basePenalty) * mult * 100) / 100;

    return res.json({
      verdict: result.verdict || 'DESCULPA_ESFARRAPADA',
      verdict_title: result.verdict_title || 'PUNIÇÃO SEVERA APLICADA',
      multiplier: mult,
      calculated_fine: calculatedFine,
      judge_feedback: result.judge_feedback || 'O Tribunal não aceita desculpas. A disciplina é soberana.',
    });
  } catch (error: any) {
    console.error('Erro no Tribunal da IA:', error);
    const fallbackFine = Math.round(Number(req.body.basePenalty || 40) * 2 * 100) / 100;
    return res.json({
      verdict: 'DESCULPA_ESFARRAPADA',
      verdict_title: 'PUNIÇÃO SEVERA RECURSIVA',
      multiplier: 2.0,
      calculated_fine: fallbackFine,
      judge_feedback: 'O Tribunal da IA condena a hesitação. A punição padrão foi dobrada.',
    });
  }
});

// API Endpoint: Transcrever Áudio com gemini-3.5-transcribe
app.post('/api/gemini/transcribe-audio', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Dados de áudio não fornecidos.' });
    }

    const audioPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'audio/webm',
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: [
        audioPart,
        { text: 'Transcreva este áudio em português com alta precisão para ser usado como Brain Dump de tarefas. Retorne apenas o texto transcrito sem formatação adicional.' },
      ],
    });

    return res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Erro ao transcrever áudio:', error);
    return res.status(500).json({ error: 'Falha ao transcrever áudio com Gemini.', details: String(error) });
  }
});

// API Endpoint: Coach Dopamínico TDAH (Multi-turn Chat)
app.post('/api/gemini/coach-chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return res.status(400).json({ error: 'Mensagem inválida.' });
    }

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: `Você é o "COACH DOPAMÍNICO TDAH", um assistente especialista em neurociência comportamental, foco, hábitos e gamificação para pessoas com TDAH.
Seu papel é motivar o usuário, dar hacks de 2 minutos contra a paralisia inicial, ajudar a estruturar tarefas e equilibrar o uso de saldo na Loja de Recompensas.
Mantenha um tom enérgico, empático, direto ao ponto e focado na ação imediata. Respostas em no máximo 2 ou 3 parágrafos curtos.`,
      },
    });

    // Replay preceding conversation history if available
    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        if (msg.role === 'user' && msg.text) {
          await chat.sendMessage({ message: msg.text });
        }
      }
    }

    const response = await chat.sendMessage({ message: userMessage });

    return res.json({ responseText: response.text || '' });
  } catch (error: any) {
    console.error('Erro no Coach Chat:', error);
    return res.status(500).json({ error: 'Falha na comunicação com o Coach Dopamínico.', details: String(error) });
  }
});

// Configure Vite middleware in development or serve static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, port: Number(PORT) },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dopamine Hacker - Gamificação TDAH</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Dopamine Hacker Server rodando na porta ${PORT}`);
});
