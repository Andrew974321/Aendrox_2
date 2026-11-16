import { services } from './data';

export function guideReply(text: string): string {
  const q = text.toLowerCase();
  if (/price|cost|budget|quote/.test(q)) return 'Pricing depends on scope, integrations, and delivery needs. Share your must-have features and budget range in the inquiry form for a tailored discussion. I cannot issue quotes or make commitments.';
  if (/time|deadline|long|when/.test(q)) return 'A useful timeline starts with your core features, integrations, and target launch date. Add these to your inquiry; the team can assess the scope and confirm a realistic plan.';
  if (/start|brief|idea|project/.test(q)) return 'Start with a short project brief: who will use it, what problem it solves, three essential features, and your target date. Add those details to the inquiry form. Your chat does not submit an inquiry automatically.';
  if (/service|offer|build|help/.test(q)) return `AENDROX offers ${services.map(s => s.title).join(', ')}. Choose a service or tell me which part you want to explore.`;
  const match = services.find(s => s.title.toLowerCase().split(/\W+/).filter(w => w.length > 2).some(w => q.includes(w)));
  if (match) return `${match.full}: ${match.detail} Tell the team your goal and existing systems through the inquiry form.`;
  if (/hello|hi\b|hey/.test(q)) return 'Hello! I’m the AENDROX robotic guide. I can explain services, help you prepare a project brief, or outline what to include in an inquiry.';
  return 'I’m currently a local guide with preset answers, not live AI. Ask about services, starting a project, budgets, or timelines. For a detailed answer about your idea, use the inquiry form.';
}
