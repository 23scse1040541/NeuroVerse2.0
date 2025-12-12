import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Volume2, Clock, Heart, X } from 'lucide-react';

const Mindfulness = () => {
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [breathingMode, setBreathingMode] = useState(null);
  const [breathStep, setBreathStep] = useState('Inhale');
  const [scale, setScale] = useState(1);

  const musicTracks = [
    {
      title: 'Calm Ocean Waves',
      mood: 'Calm · Relax',
      duration: '10 min',
      color: 'from-blue-400 to-cyan-400',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      title: 'Soft Piano Focus',
      mood: 'Focus · Study',
      duration: '12 min',
      color: 'from-purple-400 to-pink-400',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      title: 'Gentle Night Sky',
      mood: 'Sleep · Wind-down',
      duration: '15 min',
      color: 'from-indigo-400 to-purple-400',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      title: 'Morning Energy Rise',
      mood: 'Energy · Morning',
      duration: '8 min',
      color: 'from-orange-400 to-red-400',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
  ];

  const breathingExercises = [
    {
      name: '4-7-8 Breathing',
      description: 'Breathe in for 4, hold for 7, exhale for 8. Reduces anxiety.',
      icon: '🌬️'
    },
    {
      name: 'Box Breathing',
      description: 'Inhale 4, hold 4, exhale 4, hold 4. Calms nervous system.',
      icon: '📦'
    },
    {
      name: 'Deep Belly Breathing',
      description: 'Place hand on belly, breathe deeply. Promotes relaxation.',
      icon: '🫁'
    }
  ];

  const quotes = [
    { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha' },
    { text: 'The present moment is filled with joy and happiness.', author: 'Thich Nhat Hanh' },
    { text: 'Breath is the bridge which connects life to consciousness.', author: 'Thich Nhat Hanh' },
    { text: 'Meditation is not evasion; it is a serene encounter with reality.', author: 'Thich Nhat Hanh' }
  ];

  const playTone = (seconds = 5, frequency = 432) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    setTimeout(() => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.25);
      } catch {}
    }, seconds * 1000);
  };

  const openBreathing = (mode) => {
    setBreathingMode(mode);
    setBreathingOpen(true);
  };

  useEffect(() => {
    if (!breathingOpen) return;
    let timer;
    const patterns = {
      '4-7-8 Breathing': [
        { step: 'Inhale', seconds: 4, scale: 1.2 },
        { step: 'Hold', seconds: 7, scale: 1.2 },
        { step: 'Exhale', seconds: 8, scale: 0.8 },
      ],
      'Box Breathing': [
        { step: 'Inhale', seconds: 4, scale: 1.2 },
        { step: 'Hold', seconds: 4, scale: 1.2 },
        { step: 'Exhale', seconds: 4, scale: 0.8 },
        { step: 'Hold', seconds: 4, scale: 0.8 },
      ],
      'Deep Belly Breathing': [
        { step: 'Inhale', seconds: 5, scale: 1.25 },
        { step: 'Exhale', seconds: 5, scale: 0.8 },
      ],
    };
    const seq = patterns[breathingMode?.name] || patterns['4-7-8 Breathing'];
    let idx = 0;
    const run = () => {
      const current = seq[idx % seq.length];
      setBreathStep(current.step);
      setScale(current.scale);
      timer = setTimeout(() => {
        idx += 1;
        run();
      }, current.seconds * 1000);
    };
    run();
    return () => clearTimeout(timer);
  }, [breathingOpen, breathingMode]);

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <Sparkles className="w-10 h-10 mr-3" />
            Mindfulness Hub
          </h1>
          <p className="text-gray-600">Use music, relaxation exercises, and healthy time-schedules to support your emotions.</p>
        </motion.div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card neuro-hologram-hover mb-8 bg-gradient-to-r from-primary/10 to-purple-100/50 border-2 border-primary/20"
        >
          <div className="text-center py-4">
            <p className="text-2xl font-serif italic text-gray-800 mb-3">
              "{quotes[Math.floor(Math.random() * quotes.length)].text}"
            </p>
            <p className="text-sm text-gray-600">- {quotes[Math.floor(Math.random() * quotes.length)].author}</p>
          </div>
        </motion.div>

        {/* Music section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Volume2 className="w-6 h-6 mr-2 text-primary" />
            Music for your mind
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicTracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl border border-white/10 group"
              >
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.22),transparent_55%)]" />
                <div className="relative p-4 h-full flex flex-col">
                  <div className={`w-full h-28 bg-gradient-to-br ${track.color} rounded-2xl mb-4 flex items-center justify-between px-4 group-hover:scale-[1.02] transition-transform`}>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/80 mb-1">NeuroVerse · Music</p>
                      <p className="text-sm font-semibold text-white/95 line-clamp-2">{track.title}</p>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-black/20 flex items-center justify-center text-white shadow-lg shadow-black/40">
                      <Play className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {track.duration}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-[0.7rem] font-medium text-slate-50 border border-white/20">
                      {track.mood}
                    </span>
                  </div>

                  <audio
                    className="mt-2 w-full accent-primary"
                    src={track.url}
                    controls
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Relaxation Exercises section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-pink-500" />
            Relaxation Exercises
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {breathingExercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card neuro-hologram-hover hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4 text-center">{exercise.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{exercise.name}</h3>
                <p className="text-gray-600 text-center">{exercise.description}</p>
                <button className="mt-4 w-full btn-secondary" onClick={() => openBreathing(exercise)}>
                  Try Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Time-Schedule by emotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">Time-schedule by emotion</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[{
              emotion: 'Sad / low mood',
              key: 'sad',
              color: 'from-blue-100 to-indigo-100',
              morning: 'Slow start with gentle movement and no heavy decisions.',
              afternoon: 'One small task and a 5-minute emotional check-in.',
              night: 'Wind-down with low light, calm music, and minimal screens.',
            }, {
              emotion: 'Anxious / overwhelmed',
              key: 'anxious',
              color: 'from-yellow-100 to-orange-100',
              morning: 'Breathing or grounding before opening apps and messages.',
              afternoon: 'Limit to 1–2 core priorities with micro-breaks.',
              night: 'Light stretch, breathing audio, and writing worries out of your head.',
            }, {
              emotion: 'Neutral / okay',
              key: 'neutral',
              color: 'from-slate-100 to-emerald-100',
              morning: 'Short energising routine (music, sunlight, or a walk).',
              afternoon: 'Focused work block plus one intentional mindful break.',
              night: 'Reflect on one good thing and do a short enjoyable activity.',
            }, {
              emotion: 'Happy / excited',
              key: 'happy',
              color: 'from-pink-100 to-purple-100',
              morning: 'Lock in your mood with gratitude or fun music.',
              afternoon: 'Use your energy on meaningful work or kindness.',
              night: 'Celebrate a win and allow yourself a relaxed or early bedtime.',
            }].map((plan, index) => (
              <div
                key={plan.key}
                className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">Schedule</p>
                <p className="text-sm font-semibold text-gray-800 mb-2">{plan.emotion}</p>
                <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${plan.color}`} />
                <div className="space-y-2 text-xs text-gray-700">
                  <p><span className="font-semibold">Morning:</span> {plan.morning}</p>
                  <p><span className="font-semibold">Afternoon:</span> {plan.afternoon}</p>
                  <p><span className="font-semibold">Night:</span> {plan.night}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        {breathingOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <button className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100" onClick={() => setBreathingOpen(false)}>
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-center mb-2">{breathingMode?.name || 'Breathing'}</h3>
              <p className="text-center text-gray-600 mb-6">Follow the rhythm</p>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale }}
                  transition={{ duration: 1.0 }}
                  className="w-40 h-40 bg-gradient-to-br from-primary to-purple-500 rounded-full mb-6"
                />
                <div className="text-xl font-semibold mb-2">{breathStep}</div>
                <p className="text-gray-500">Breathe with the animation</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mindfulness;
