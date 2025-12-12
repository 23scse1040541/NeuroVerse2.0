import express from 'express';

const router = express.Router();

const crisisKeywords = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself', 'die', 'want to die'
];

const categories = [
  { key: 'anxiety', kw: ['anxious', 'anxiety', 'panic', 'nervous', 'worried', 'tense'] },
  { key: 'stress', kw: ['stress', 'stressed', 'overwhelmed', 'pressure', 'burnout'] },
  { key: 'sadness', kw: ['sad', 'down', 'depressed', 'crying', 'lonely'] },
  { key: 'sleep', kw: ['sleep', 'insomnia', 'tired', 'fatigue', 'restless'] },
  { key: 'motivation', kw: ['motivation', 'motivated', 'productive', 'focus'] },
  { key: 'meditation', kw: ['meditation', 'mindfulness', 'breathe', 'breathing'] }
];

const responses = {
  crisis:
    "I'm really sorry you're going through this. You deserve immediate support. If you are in danger or considering harming yourself, please seek help now:\n\n• Call your local emergency number.\n• Contact a trusted person nearby.\n• In India: 9152987821 (Kiran), 1800-599-0019 (iCall).\n• International: Find your country’s lifeline at findahelpline.com.\n\nI can stay with you here while you reach out. You're not alone.",
  anxiety:
    "Feeling anxious is hard. A few techniques that may help right now:\n\n• 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Try our Breathing in Mindfulness.\n• Grounding 5-4-3-2-1: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.\n• Short walk or stretch.\n\nWould you like me to guide a quick breathing exercise?",
  stress:
    "Stress can build up quickly. You might try:\n\n• Box breathing (4-4-4-4).\n• Break tasks into small steps and schedule a tiny next action.\n• A 5–10 min calm meditation in Mindfulness.\n\nIf stress is constant, consider talking to a professional in Specialists.",
  sadness:
    "I'm here with you. It may help to:\n\n• Write a short note in Journal about what feels heavy.\n• Reach out to someone you trust.\n• Light movement or going outside for a few minutes.\n\nIf sadness persists or worsens, please consider professional support.",
  sleep:
    "For better sleep tonight:\n\n• Limit screens 60 minutes before bed.\n• Try a brief body-scan meditation in Mindfulness.\n• Keep your room cool and dark.\n\nIf issues continue, discussing with a clinician can help.",
  motivation:
    "To get moving again:\n\n• Pick a 2-minute starter task.\n• Reduce the scope to 'just begin'.\n• Celebrate small wins — log your mood after.\n\nWant me to suggest a tiny first step?",
  meditation:
    "Mindfulness can calm the system:\n\n• 4-7-8 or Box Breathing (Mindfulness > Breathing).\n• 5-Minute Calm session to reset.\n\nTap Mindfulness in the navbar and choose a practice. I can also time a short breathing now.",
  default:
    "Thanks for sharing. I can offer general wellness tips, breathing support, or reflective prompts. You can tell me how you feel (e.g., 'I feel anxious'), and we can begin a simple practice together."
};

function pickCategory(text) {
  const t = text.toLowerCase();
  if (crisisKeywords.some(k => t.includes(k))) return 'crisis';
  for (const c of categories) {
    if (c.kw.some(k => t.includes(k))) return c.key;
  }
  return 'default';
}

router.post('/', (req, res) => {
  const message = (req.body?.message || '').toString();
  if (!message.trim()) {
    return res.status(400).json({ response: 'Please share a bit about how you’re feeling or what you need help with.' });
  }
  const cat = pickCategory(message);
  const response = responses[cat] || responses.default;
  res.json({ response });
});

export default router;
