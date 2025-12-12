import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from "lucide-react";

const challengeOptions = [
  {
    id: 'work',
    label: 'Work / study stress',
    emotion: 'stressed',
    intensity: 7,
  },
  {
    id: 'social',
    label: 'People / social stuff',
    emotion: 'anxious',
    intensity: 6,
  },
  {
    id: 'health',
    label: 'Energy / health',
    emotion: 'tired',
    intensity: 6,
  },
  {
    id: 'none',
    label: 'Nothing major today',
    emotion: 'neutral',
    intensity: 4,
  },
];

const helpOptions = [
  'Talking to someone',
  'Music / content',
  'Movement / walk',
  'Rest / sleep',
  'Mindfulness / breathing',
  'Nothing really helped',
];

function MicroReflectionCard({ title = "Today's Reflection", onComplete, loading }) {
  const [open, setOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedHelps, setSelectedHelps] = useState([]);

  const toggleHelp = (option) => {
    setSelectedHelps((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    const challenge = challengeOptions.find((c) => c.id === selectedChallenge);
    const emotion = challenge?.emotion || 'neutral';
    const intensity = challenge?.intensity || 5;
    const note = `Challenge: ${challenge ? challenge.label : 'Not specified'}. Helped: ${
      selectedHelps.length > 0 ? selectedHelps.join(', ') : 'Not specified'
    }.`;

    if (onComplete) {
      onComplete({
        emotion,
        intensity,
        note,
        trackingType: 'question',
        source: 'micro-reflection',
        challengeType: selectedChallenge || 'none',
        helpedBy: selectedHelps,
      });
    }
  };

  const disabled = !selectedChallenge || loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-2xl bg-white/80 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => !open && setOpen(true)}
    >
      {!open ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Micro check-in</p>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Take 20-30 seconds to reflect on today.</p>
          </div>
        </div>
      ) : (
        <div onClick={(e) => e.stopPropagation()}>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Step 1</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">What challenged you today?</h3>
          <p className="text-xs text-gray-500 mb-3">Pick the one that fits best.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {challengeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedChallenge(option.id)}
                className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${
                  selectedChallenge === option.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">Step 2</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">What helped you feel better?</h3>
          <p className="text-xs text-gray-500 mb-3">Select all that apply.</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {helpOptions.map((option) => {
              const isActive = selectedHelps.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleHelp(option)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    isActive
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={() => {
                setOpen(false);
                setSelectedChallenge(null);
                setSelectedHelps([]);
              }}
            >
              Clear & close
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={handleSave}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Save check-in</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default MicroReflectionCard;
