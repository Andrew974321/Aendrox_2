import { NextResponse } from 'next/server';
import { z } from 'zod';
import { guideReply } from '@/lib/chat-guide';
import { aiConfig, systemPrompt, tools, saveLead } from '@/lib/lead-agent';

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(2000) })).min(1).max(30),
  leadSaved: z.boolean().optional(),
});
const attempts = new Map<string, { count: number; until: number }>();
const leadAttempts = new Map<string, { count: number; until: number }>();

// Consent guard: a lead is saved only when the visitor's latest message clearly agrees.
const AGREES = /\b(yes|yeah|yep|yup|sure|ok|okay|send|go ahead|please do|confirm|confirmed|proceed)\b/i;

function limited(map: typeof attempts, key: string, max: number, windowMs: number) {
  const now = Date.now();
  for (const [k, v] of map) if (v.until < now) map.delete(k);
  const entry = map.get(key) || { count: 0, until: now + windowMs };
  if (entry.count >= max || map.size >= 5000) return true;
  entry.count++; map.set(key, entry);
  return false;
}

export async function GET() {
  const ai = aiConfig();
  return NextResponse.json({ mode: ai ? 'ai' : 'guide', provider: ai?.provider }, { headers: { 'Cache-Control': 'no-store' } });
}

type ChatMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string | null; tool_calls?: ToolCall[]; tool_call_id?: string };
type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } };

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try { if (new URL(origin).host !== request.headers.get('host')) throw new Error(); }
    catch { return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 }); }
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(attempts, ip, 20, 60000)) return NextResponse.json({ error: 'Please wait a minute before sending more messages.' }, { status: 429 });

  let data: z.infer<typeof schema>;
  try {
    const raw = await request.text();
    if (raw.length > 70000) throw new Error();
    data = schema.parse(JSON.parse(raw));
    if (data.messages.at(-1)?.role !== 'user') throw new Error();
  } catch { return NextResponse.json({ error: 'Please send a message of up to 2,000 characters.' }, { status: 400 }); }

  const ai = aiConfig();
  if (!ai) return NextResponse.json({ mode: 'guide', reply: guideReply(data.messages.at(-1)!.content) });

  let leadSaved = Boolean(data.leadSaved);
  const messages: ChatMessage[] = [{ role: 'system', content: systemPrompt(leadSaved) }, ...data.messages];

  try {
    // Agent loop: the model may call save_lead, then writes its reply. At most 3 rounds.
    for (let round = 0; round < 3; round++) {
      const response = await fetch(`${ai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(ai.apiKey ? { Authorization: `Bearer ${ai.apiKey}` } : {}) },
        body: JSON.stringify({ model: ai.model, messages, temperature: 0.4, max_tokens: 600, ...(leadSaved ? {} : { tools }) }),
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) throw new Error(`AI request failed (${response.status})`);
      const msg = (await response.json()).choices?.[0]?.message as ChatMessage | undefined;
      if (!msg) throw new Error('Empty AI response');

      const calls = (msg.tool_calls || []).filter(c => c.function?.name === 'save_lead');
      if (!calls.length || leadSaved) {
        const reply = (msg.content || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '').trim();
        if (!reply) throw new Error('Empty AI reply');
        return NextResponse.json({ mode: 'ai', provider: ai.provider, reply, leadSaved });
      }

      messages.push({ role: 'assistant', content: msg.content || '', tool_calls: calls.slice(0, 1) });
      let result;
      if (!AGREES.test(data.messages.at(-1)!.content)) result = { ok: false, error: 'Not sent: the visitor has not explicitly agreed yet. Summarise the brief in a few lines and ask: "Shall I send this to the AENDROX team so they can get back to you?" Do not say it was sent.' };
      else if (limited(leadAttempts, ip, 3, 600000)) result = { ok: false, error: 'Too many leads from this visitor recently. Ask them to use the contact form.' };
      else {
        let args: unknown = {};
        try { args = JSON.parse(calls[0].function.arguments || '{}'); } catch {}
        result = await saveLead(args);
        if (result.ok) leadSaved = true;
      }
      messages.push({ role: 'tool', tool_call_id: calls[0].id, content: JSON.stringify(result.ok ? { saved: true, message: 'Lead sent to the AENDROX team.' } : { saved: false, error: result.error }) });
    }
    throw new Error('Agent did not finish');
  } catch (e) {
    console.error('Sales agent error:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'The AI assistant is unavailable right now. Please try again or use the inquiry form.', leadSaved }, { status: 502 });
  }
}
