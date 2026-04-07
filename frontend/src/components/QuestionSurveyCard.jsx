import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, CheckCircle2, Circle, ArrowRight, Brain, Heart, Zap, Moon, Sun, Activity, Smile, Frown, Meh } from 'lucide-react';

const questionIcons = {
  energy: Zap,
  mood: Smile,
  stress: Activity,
  anxiety: Frown,
  focus: Brain,
  sleep: Moon,
  selfTalk: Heart,
  connection: Sun,
  enjoyment: Sparkles,
  overwhelm: Meh,
};

const QUESTIONS = [
  {
    id: 'energy',
    text: 'How is your energy level today?',
    options: [
      { value: 1, label: 'Very low', emoji: '😴' },
      { value: 2, label: 'Low', emoji: '😌' },
      { value: 3, label: 'Okay', emoji: '😐' },
      { value: 4, label: 'Good', emoji: '💪' },
      { value: 5, label: 'Very high', emoji: '⚡' },
    ],
  },
  {
    id: 'mood',
    text: 'Overall, how would you rate your mood?',
    options: [
      { value: 1, label: 'Very low / down', emoji: '😢' },
      { value: 2, label: 'Low', emoji: '😔' },
      { value: 3, label: 'Neutral', emoji: '😐' },
      { value: 4, label: 'Pretty good', emoji: '🙂' },
      { value: 5, label: 'Great', emoji: '😄' },
    ],
  },
  {
    id: 'stress',
    text: 'How stressed do you feel?',
    options: [
      { value: 5, label: 'Extremely stressed', emoji: '🤯' },
      { value: 4, label: 'Quite stressed', emoji: '😰' },
      { value: 3, label: 'Somewhat stressed', emoji: '😓' },
      { value: 2, label: 'A little stressed', emoji: '😅' },
      { value: 1, label: 'Not stressed', emoji: '😌' },
    ],
    invert: true,
  },
  {
    id: 'anxiety',
    text: 'How anxious or worried have you felt today?',
    options: [
      { value: 5, label: 'Almost all day', emoji: '😰' },
      { value: 4, label: 'Often', emoji: '😥' },
      { value: 3, label: 'Sometimes', emoji: '😟' },
      { value: 2, label: 'Rarely', emoji: '🙂' },
      { value: 1, label: 'Not at all', emoji: '😄' },
    ],
    invert: true,
  },
  {
    id: 'focus',
    text: 'How easy is it to focus on tasks?',
    options: [
      { value: 1, label: 'Very hard to focus', emoji: '🤯' },
      { value: 2, label: 'Hard', emoji: '😵‍💫' },
      { value: 3, label: 'Okay', emoji: '🤔' },
      { value: 4, label: 'Easy', emoji: '🎯' },
      { value: 5, label: 'Very easy', emoji: '🧠' },
    ],
  },
  {
    id: 'sleep',
    text: 'How rested do you feel from your recent sleep?',
    options: [
      { value: 1, label: 'Very tired', emoji: '😫' },
      { value: 2, label: 'Tired', emoji: '🥱' },
      { value: 3, label: 'Okay', emoji: '😐' },
      { value: 4, label: 'Rested', emoji: '😊' },
      { value: 5, label: 'Very rested', emoji: '✨' },
    ],
  },
  {
    id: 'selfTalk',
    text: 'How kind has your self-talk been today?',
    options: [
      { value: 1, label: 'Very critical', emoji: '💔' },
      { value: 2, label: 'Mostly critical', emoji: '😤' },
      { value: 3, label: 'Mixed', emoji: '🤷' },
      { value: 4, label: 'Mostly kind', emoji: '💚' },
      { value: 5, label: 'Very kind', emoji: '💖' },
    ],
  },
  {
    id: 'connection',
    text: 'How connected do you feel to people around you?',
    options: [
      { value: 1, label: 'Very isolated', emoji: '😞' },
      { value: 2, label: 'Somewhat isolated', emoji: '😔' },
      { value: 3, label: 'Okay', emoji: '😐' },
      { value: 4, label: 'Connected', emoji: '🤝' },
      { value: 5, label: 'Very connected', emoji: '💕' },
    ],
  },
  {
    id: 'enjoyment',
    text: 'How much have you enjoyed things today?',
    options: [
      { value: 1, label: 'Not at all', emoji: '😑' },
      { value: 2, label: 'A little', emoji: '🙂' },
      { value: 3, label: 'Somewhat', emoji: '😊' },
      { value: 4, label: 'Quite a bit', emoji: '😄' },
      { value: 5, label: 'A lot', emoji: '🥳' },
    ],
  },
  {
    id: 'overwhelm',
    text: 'How overwhelmed do you feel by responsibilities right now?',
    options: [
      { value: 5, label: 'Extremely overwhelmed', emoji: '😵' },
      { value: 4, label: 'Quite overwhelmed', emoji: '😰' },
      { value: 3, label: 'Somewhat', emoji: '😓' },
      { value: 2, label: 'A little', emoji: '😅' },
      { value: 1, label: 'Not overwhelmed', emoji: '💪' },
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

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div className="bg-white/5 rounded-full p-1 border border-white/10">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cyan-400">{answeredCount}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/40">{QUESTIONS.length}</span>
            </div>
            <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
          <span className="text-sm text-white/60 ml-4">
            {progress === 100 ? 'Ready to submit!' : `${Math.round(progress)}% complete`}
          </span>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid gap-4">
        {QUESTIONS.map((q, index) => {
          const QuestionIcon = questionIcons[q.id] || Circle;
          const isAnswered = answers[q.id];
          
          return (
            <motion.div 
              key={q.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl p-5 border transition-all duration-300 ${
                isAnswered 
                  ? 'bg-white/10 border-cyan-400/30' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isAnswered 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {isAnswered ? <CheckCircle2 className="w-5 h-5" /> : <QuestionIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/40">Q{index + 1}</span>
                    {isAnswered && <span className="text-xs text-cyan-400 font-medium">Answered</span>}
                  </div>
                  <p className="text-white font-medium mb-4">{q.text}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const active = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleChange(q.id, opt.value)}
                          className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${
                            active
                              ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20'
                              : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/30'
                          }`}
                        >
                          <span className="text-lg">{opt.emoji}</span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      <motion.button
        type="button"
        disabled={!allAnswered || loading}
        onClick={handleSubmit}
        whileHover={allAnswered ? { scale: 1.02 } : {}}
        whileTap={allAnswered ? { scale: 0.98 } : {}}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg transition-all ${
          allAnswered
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <motion.div 
            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {allAnswered ? (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Mood Analysis
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Circle className="w-5 h-5" />
                Answer all questions to continue
              </>
            )}
          </>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-400/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Analysis Complete</h3>
                <p className="text-cyan-400">{result.summary}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Growth Tips</h4>
              <div className="grid gap-2">
                {result.tips.slice(0, 5).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-white/80">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuestionSurveyCard;
