import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All moods' },
  { id: 'uplifting', label: 'Uplifting' },
  { id: 'calming', label: 'Calming' },
  { id: 'growth', label: 'Growth' },
  { id: 'self-compassion', label: 'Self-compassion' },
];

const BOOKS = [
  {
    id: 'morning-light',
    title: 'Morning Light',
    moodTag: 'Uplifting · Gentle start',
    category: 'uplifting',
    duration: '6 min read',
    accent: 'from-amber-200/80 via-orange-100 to-rose-100',
    description: 'A soft story about slow mornings, tiny wins, and remembering that showing up is enough.',
    pages: [
      'The city was still half-asleep when Aanya stepped onto the balcony. The sky was not yet blue, but a washed-out purple, like someone had dipped the world in watercolor and hadn\'t let it dry.',
      'Her notifications were already waiting. Deadlines. Messages. A voice in her head whispering that she was behind before the day had even begun.',
      'But then the kettle clicked. The softest sound. Steam curled like a shy thought. Aanya wrapped her hands around the warm mug and decided, just for this morning, to notice the tiniest good things.',
      'The way the sunlight slowly climbed the opposite building. The plant on her windowsill growing a new leaf without permission. The neighbor humming an off-key song through the thin walls.',
      'Maybe, she thought, healing was not a dramatic turning point. Maybe it was a collection of barely noticeable mornings, where she chose to breathe, to sip, to simply be here.',
    ],
  },
  {
    id: 'the-bench',
    title: 'The Quiet Bench',
    moodTag: 'Calming · Safe space',
    category: 'calming',
    duration: '7 min read',
    accent: 'from-sky-200/80 via-blue-100 to-emerald-100',
    description: 'A small park, a familiar bench, and a reminder that you are allowed to pause.',
    pages: [
      'There was a bench in the corner of the park that no one really noticed. It sat under an old gulmohar tree, collecting fallen flowers and quiet secrets.',
      'On the days when Arjun felt his chest buzzing with invisible noise, he walked there without thinking. His feet knew the way, even when his thoughts didn\'t.',
      'The bench never asked him to be productive, positive, or okay. It only offered space. A patch of shade. A front-row seat to the breeze moving through leaves.',
      'As he sat there, he counted the breaths that reached his belly, not just his chest. In for four. Hold for four. Out for six. The world didn\'t slow down, but for a moment, he did.',
      'He realized that peace might not be a place you escape to far away. Sometimes, it is a wooden bench under a messy tree, just five minutes from home.',
    ],
  },
  {
    id: 'tiny-steps',
    title: 'Tiny Steps Forward',
    moodTag: 'Growth · Progress',
    category: 'growth',
    duration: '8 min read',
    accent: 'from-emerald-200/80 via-lime-100 to-teal-100',
    description: 'A journey where success is measured in tiny, almost invisible movements.',
    pages: [
      'Mira used to think that change would feel like fireworks. Loud. Obvious. Announced to the whole world.',
      'Instead, it felt like this: opening the curtains on a day she wanted to stay in bed. Replying to one message instead of none. Washing a single cup in the sink, even when the rest of the dishes glared at her.',
      'No one clapped for these moments. There were no milestone posts or shiny achievements. But late one night, scrolling through old photos, she noticed something subtle.',
      'Her eyes looked a little less tired. Her shoulders sat a little less heavy. Somewhere between all the tiny decisions she had made, a quiet kind of strength had grown.',
      'Progress, she realized, was not a straight line on a chart. It was a collection of almost invisible choices, made on days when she had every reason to give up and didn\'t.',
    ],
  },
  {
    id: 'soft-heart',
    title: 'For Your Soft Heart',
    moodTag: 'Self-compassion · Warmth',
    category: 'self-compassion',
    duration: '5 min read',
    accent: 'from-rose-200/80 via-pink-100 to-fuchsia-100',
    description: 'A letter to the part of you that is always trying, even when no one sees it.',
    pages: [
      'If your heart had a voice, it would not ask why you are not stronger yet. It would ask if you slept well. If you drank enough water. If you remembered to look at the sky today.',
      'You have lived through days that younger-you thought were impossible. Nights that felt endless. Yet here you are, still reaching for something softer.',
      'You apologize for being "too emotional", "too sensitive", "too much". But the world is already full of people who feel too little. Your softness is not a problem to fix.',
      'Tonight, when you are finally alone with your thoughts, place a hand over your chest. Feel the stubborn rhythm that never gave up on you.',
      'Whisper, even if it feels silly: "Thank you for carrying me, even when I forget to carry you."',
    ],
  },
];

const Journal = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeBook, setActiveBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDirection, setPageDirection] = useState('next');

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'all') return BOOKS;
    return BOOKS.filter((book) => book.category === selectedCategory);
  }, [selectedCategory]);

  const openBook = (book) => {
    setActiveBook(book);
    setCurrentPage(0);
    setPageDirection('next');
  };

  const closeBook = () => {
    setActiveBook(null);
  };

  const handleNextPage = () => {
    if (!activeBook) return;
    if (currentPage >= activeBook.pages.length - 1) return;
    setPageDirection('next');
    setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (!activeBook) return;
    if (currentPage <= 0) return;
    setPageDirection('prev');
    setCurrentPage((p) => p - 1);
  };

  const totalPages = activeBook ? activeBook.pages.length : 0;

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
              <BookOpen className="w-10 h-10 mr-3" />
              KAHANIYAN
            </h1>
            <p className="text-gray-600 max-w-xl">
              Emotional short stories designed for your mind. Pick a mood, open a book, and sink into
              smooth, page-by-page storytelling.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary/80 bg-white/70 rounded-full px-4 py-2 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Micro-reading · Mindful pacing · Soft transitions</span>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm border backdrop-blur-sm transition-all ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/30'
                    : 'bg-white/70 text-gray-700 border-gray-200 hover:border-primary/60 hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.button
              key={book.id}
              type="button"
              onClick={() => openBook(book)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left rounded-2xl overflow-hidden shadow-md hover:shadow-xl bg-white/80 backdrop-blur border border-white/60 relative cursor-pointer"
            >
              <div className={`h-28 w-full bg-gradient-to-br ${book.accent} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(255,255,255,0.8),transparent_55%)]" />
                <motion.div
                  className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full border border-white/40 bg-white/10"
                  initial={{ rotate: -8 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <div className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.18em] text-white/90 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 rounded-full border border-white/60 bg-white/10 items-center justify-center text-[0.6rem] font-semibold">
                    NV
                  </span>
                  <span>Kahaniyan · NeuroVerse</span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-[0.7rem] font-medium text-primary/80 mb-1 uppercase tracking-[0.18em]">
                  {book.moodTag}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 group-hover:line-clamp-3 transition-all">
                  {book.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {book.duration}
                  </span>
                  <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform">
                    Open story →
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Reader Overlay */}
        <AnimatePresence>
          {activeBook && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative max-w-3xl w-full max-h-[85vh] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl shadow-2xl overflow-hidden text-slate-50"
              >
                {/* Header */}
                <div className="flex items-start justify-between px-5 md:px-7 pt-4 pb-3 border-b border-white/10 bg-slate-900/70 backdrop-blur">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-primary/60 mb-1 flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 rounded-full border border-primary/40 items-center justify-center text-[0.6rem] font-semibold text-primary">
                        NV
                      </span>
                      <span>Kahaniyan · Emotional Reader</span>
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">{activeBook.title}</h2>
                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activeBook.duration}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-500" />
                      <span>{activeBook.moodTag}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBook}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Reader Body */}
                <div className="px-4 md:px-7 pb-5 pt-4 flex flex-col h-[60vh] md:h-[64vh]">
                  <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="md:w-1/12 flex md:flex-col items-center justify-center gap-4 text-xs text-slate-400">
                      <div className="hidden md:flex flex-col items-center gap-2">
                        <span className="text-[0.6rem] uppercase tracking-[0.24em]">Pages</span>
                        <span className="text-sm font-medium text-slate-100">
                          {currentPage + 1}
                          <span className="text-slate-500 text-xs"> / {totalPages}</span>
                        </span>
                      </div>
                      <div className="flex md:flex-col items-center gap-3">
                        <button
                          type="button"
                          onClick={handlePrevPage}
                          disabled={currentPage === 0}
                          className="p-2 rounded-full border border-white/10 hover:border-white/40 disabled:opacity-40 disabled:hover:border-white/10 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages - 1}
                          className="p-2 rounded-full border border-white/10 hover:border-white/40 disabled:opacity-40 disabled:hover:border-white/10 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full h-full max-w-2xl flex items-center justify-center" style={{ perspective: '1200px' }}>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={currentPage}
                            initial={{
                              opacity: 0,
                              x: pageDirection === 'next' ? 40 : -40,
                              rotateY: pageDirection === 'next' ? 18 : -18,
                            }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{
                              opacity: 0,
                              x: pageDirection === 'next' ? -40 : 40,
                              rotateY: pageDirection === 'next' ? -18 : 18,
                            }}
                            transition={{ duration: 0.45, ease: 'easeInOut' }}
                            className="relative w-full h-full bg-gradient-to-br from-slate-50/95 via-white to-indigo-50 rounded-2xl shadow-xl px-5 md:px-8 py-6 md:py-8 text-slate-900 overflow-hidden"
                          >
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/5 via-transparent to-transparent" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/5 via-transparent to-transparent" />
                            <div className="h-full flex flex-col">
                              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400 mb-3">
                                Page {currentPage + 1} · {activeBook.title}
                              </p>
                              <p className="text-sm md:text-base leading-relaxed md:leading-relaxed text-slate-800 whitespace-pre-line">
                                {activeBook.pages[currentPage]}
                              </p>
                              <div className="mt-auto flex items-center justify-between pt-4 text-[0.7rem] text-slate-400">
                                <span>Kahaniyan · NeuroVerse</span>
                                <span>
                                  {currentPage + 1}/{totalPages}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Journal;
