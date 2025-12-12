import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'energy',
    text: 'How is your energy level today?',
    options: [
      { value: 1, label: 'Very low' },
      { value: 2, label: 'Low' },
      { value: 3, label: 'Okay' },
      { value: 4, label: 'Good' },
      { value: 5, label: 'Very high' },
    ],
  },
  {
    id: 'mood',
    text: 'Overall, how would you rate your mood?',
    options: [
      { value: 1, label: 'Very low / down' },
      { value: 2, label: 'Low' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Pretty good' },
      { value: 5, label: 'Great' },
    ],
  },
  {
    id: 'stress',
    text: 'How stressed do you feel?',
    options: [
      { value: 5, label: 'Extremely stressed' },
      { value: 4, label: 'Quite stressed' },
      { value: 3, label: 'Somewhat stressed' },
      { value: 2, label: 'A little stressed' },
      { value: 1, label: 'Not stressed' },
    ],
    invert: true,
  },
  {
    id: 'anxiety',
    text: 'How anxious or worried have you felt today?',
    options: [
      { value: 5, label: 'Almost all day' },
      { value: 4, label: 'Often' },
      { value: 3, label: 'Sometimes' },
      { value: 2, label: 'Rarely' },
      { value: 1, label: 'Not at all' },
    ],
    invert: true,
  },
  {
    id: 'focus',
    text: 'How easy is it to focus on tasks?',
    options: [
      { value: 1, label: 'Very hard to focus' },
      { value: 2, label: 'Hard' },
      { value: 3, label: 'Okay' },
      { value: 4, label: 'Easy' },
      { value: 5, label: 'Very easy' },
    ],
  },
  {
    id: 'sleep',
    text: 'How rested do you feel from your recent sleep?',
    options: [
      { value: 1, label: 'Very tired' },
      { value: 2, label: 'Tired' },
      { value: 3, label: 'Okay' },
      { value: 4, label: 'Rested' },
      { value: 5, label: 'Very rested' },
    ],
  },
  {
    id: 'selfTalk',
    text: 'How kind has your self-talk been today?',
    options: [
      { value: 1, label: 'Very critical' },
      { value: 2, label: 'Mostly critical' },
      { value: 3, label: 'Mixed' },
      { value: 4, label: 'Mostly kind' },
      { value: 5, label: 'Very kind and supportive' },
    ],
  },
  {
    id: 'connection',
    text: 'How connected do you feel to people around you?',
    options: [
      { value: 1, label: 'Very isolated' },
      { value: 2, label: 'Somewhat isolated' },
      { value: 3, label: 'Okay' },
      { value: 4, label: 'Connected' },
      { value: 5, label: 'Very connected' },
    ],
  },
  {
    id: 'enjoyment',
    text: 'How much have you enjoyed things today?',
    options: [
      { value: 1, label: 'Not at all' },
      { value: 2, label: 'A little' },
      { value: 3, label: 'Somewhat' },
      { value: 4, label: 'Quite a bit' },
      { value: 5, label: 'A lot' },
    ],
  },
  {
    id: 'overwhelm',
    text: 'How overwhelmed do you feel by responsibilities right now?',
    options: [
      { value: 5, label: 'Extremely overwhelmed' },
      { value: 4, label: 'Quite overwhelmed' },
      { value: 3, label: 'Somewhat' },
      { value: 2, label: 'A little' },
      { value: 1, label: 'Not overwhelmed' },
    ],
    invert: true,
  },
];

const TIME_SCHEDULE_RECS = {
  sad: {
    morning: 'Slow start: 10–15 minutes of gentle movement (stretching or a short walk). Avoid heavy decisions.',
    afternoon: 'One focused task and a short check-in break to notice how you feel.',
    night: '20–30 minutes wind-down (low light, calm music, journaling) and reduce screens 30 minutes before sleep.',
  },
  anxious: {
    morning: '5–10 minutes of breathing or grounding before checking messages or social media.',
    afternoon: 'Plan 1–2 realistic priorities and insert 5-minute pauses between tasks.',
    night: 'Light stretch or relaxation audio, then a quick worry-dump on paper before bed.',
  },
  neutral: {
    morning: 'Short energising routine (music, sunlight, or a brief walk) to set the tone for the day.',
    afternoon: 'Focused work block with one intentional micro-break away from your screen.',
    night: 'Brief reflection on what went well and 10 minutes of something you enjoy.',
  },
  happy: {
    morning: 'Lock in the good mood with music or a gratitude note before starting work.',
    afternoon: 'Use your energy for a meaningful task or a small act of kindness.',
    night: 'Celebrate one win from the day and give yourself an early or relaxed bedtime.',
  },
};

function analyseAnswers(answers) {
  let total = 0;
  let count = 0;

  QUESTIONS.forEach((q) => {
    const raw = answers[q.id];
    if (!raw) return;
    let val = raw;
    if (q.invert) {
      val = 6 - raw; // invert 1-5 scale
    }
    total += val;
    count += 1;
  });

  if (!count) {
    return {
      emotion: 'neutral',
      intensity: 5,
      summary: 'Not enough data to calculate mood.',
      tips: ['Answer a few questions to get a better reflection.'],
    };
  }

  const avg = total / count; // 1-5
  let emotion = 'neutral';
  let intensity = 5;
  const tips = [];

  if (avg <= 2) {
    emotion = 'sad';
    intensity = 8;
    tips.push(
      'Lower your expectations for today and focus on just one small, doable task.',
      'Reach out to someone you trust and share how you are feeling.',
      'Give yourself permission to rest without feeling guilty.'
    );
  } else if (avg <= 3) {
    emotion = 'anxious';
    intensity = 7;
    tips.push(
      'Write down everything on your mind and highlight only the top 1–2 priorities.',
      'Try a 5-minute breathing exercise or grounding technique.',
      'Schedule a tiny break (2–5 minutes) between tasks to reset your mind.'
    );
  } else if (avg <= 4) {
    emotion = 'neutral';
    intensity = 5;
    tips.push(
      'Protect the parts of your day that already feel okay or good.',
      'Add one small enjoyable activity (music, walk, hobby) to your schedule.',
      'Notice one thing you are grateful for before going to bed.'
    );
  } else {
    emotion = 'happy';
    intensity = 7;
    tips.push(
      'Celebrate the things that are going well, even if they feel small.',
      'Do one kind action for future-you (prep, plan, or tidy something).',
      'Share your good energy with someone who might need it.'
    );
  }

  const summary = `Average wellbeing score: ${avg.toFixed(1)} / 5. Detected mood: ${emotion} (${intensity}/10).`;

  const schedule = TIME_SCHEDULE_RECS[emotion];
  if (schedule) {
    tips.push(
      `Time-schedule · Morning: ${schedule.morning}`,
      `Time-schedule · Afternoon: ${schedule.afternoon}`,
      `Time-schedule · Night: ${schedule.night}`,
    );
  }

  return { emotion, intensity, summary, tips };
}

function QuestionSurveyCard({ onComplete, loading }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const handleSubmit = () => {
    if (!allAnswered || loading) return;

    const { emotion, intensity, summary, tips } = analyseAnswers(answers);

    const noteLines = [
      summary,
      '',
      'Growth tips:',
      ...tips.map((t, idx) => `${idx + 1}. ${t}`),
    ];

    const note = noteLines.join('\n');

    setResult({ emotion, intensity, summary, tips });

    if (onComplete) {
      onComplete({
        emotion,
        intensity,
        note,
        trackingType: 'question',
        source: 'questionnaire',
        challengeType: 'none',
        helpedBy: [],
      });
    }

    // Reset answers for the next entry while keeping the last result visible
    setAnswers({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-2xl bg-white/80 shadow-sm p-4 md:p-5 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Question-based tracking</p>
          <h3 className="text-lg font-semibold text-gray-800">10-question wellbeing check</h3>
          <p className="text-xs text-gray-500 mt-1">Answer to get an automatic mood summary and growth tips.</p>
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-primary/70">
          <Sparkles className="w-3 h-3" />
          <span>Auto analysis</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {QUESTIONS.map((q, index) => (
          <div key={q.id} className="border border-gray-100 rounded-xl p-3 bg-white/70">
            <p className="text-xs text-gray-400 mb-1">Q{index + 1}</p>
            <p className="text-sm font-medium text-gray-800 mb-2">{q.text}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const active = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange(q.id, opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      active
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={!allAnswered || loading}
        onClick={handleSubmit}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span className="text-sm">Submit & auto-track mood</span>
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 border border-primary/20 bg-primary/5 rounded-xl p-3 space-y-2 text-sm text-gray-800">
          <p className="font-semibold">Summary</p>
          <p className="text-gray-700 text-sm">{result.summary}</p>
          <p className="font-semibold mt-2">Growth tips</p>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {result.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default QuestionSurveyCard;
