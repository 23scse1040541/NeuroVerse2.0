import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'uplifting', label: 'Uplifting' },
  { id: 'calming', label: 'Calming' },
  { id: 'growth', label: 'Growth' },
  { id: 'self-compassion', label: 'Self-Compassion' },
  { id: 'motivation', label: 'Motivation' },
  { id: 'discipline', label: 'Discipline' },
  { id: 'success', label: 'Success' },
  { id: 'resilience', label: 'Resilience' },
  { id: 'mindfulness', label: 'Mindfulness' },
  { id: 'gratitude', label: 'Gratitude' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'hope', label: 'Hope' },
  { id: 'wisdom', label: 'Wisdom' },
  { id: 'connection', label: 'Connection' },
];

const BOOKS = [
  {
    id: 'morning-light',
    title: 'Morning Light',
    moodTag: 'Uplifting · Gentle start',
    category: 'uplifting',
    duration: '6 min read',
    accent: 'from-amber-500/80 via-orange-400 to-rose-400',
    thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?w=800&h=600&fit=crop',
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
    accent: 'from-sky-500/80 via-blue-400 to-emerald-400',
    thumbnail: 'https://images.unsplash.com/photo-1519331379826-f89859b1b07d?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
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
    accent: 'from-emerald-500/80 via-lime-400 to-teal-400',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
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
    moodTag: 'Self-Compassion · Warmth',
    category: 'self-compassion',
    duration: '5 min read',
    accent: 'from-rose-500/80 via-pink-400 to-fuchsia-400',
    thumbnail: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop',
    description: 'A letter to the part of you that is always trying, even when no one sees it.',
    pages: [
      'If your heart had a voice, it would not ask why you are not stronger yet. It would ask if you slept well. If you drank enough water. If you remembered to look at the sky today.',
      'You have lived through days that younger-you thought were impossible. Nights that felt endless. Yet here you are, still reaching for something softer.',
      'You apologize for being "too emotional", "too sensitive", "too much". But the world is already full of people who feel too little. Your softness is not a problem to fix.',
      'Tonight, when you are finally alone with your thoughts, place a hand over your chest. Feel the stubborn rhythm that never gave up on you.',
      'Whisper, even if it feels silly: "Thank you for carrying me, even when I forget to carry you."',
    ],
  },
  {
    id: 'mountain-climber',
    title: 'The Mountain Within',
    moodTag: 'Motivation · Perseverance',
    category: 'motivation',
    duration: '9 min read',
    accent: 'from-indigo-500/80 via-purple-400 to-pink-400',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
    description: 'Every summit starts with a single step. A story about conquering the mountains we carry inside.',
    pages: [
      'Rajat stood at the base of the mountain, his breath visible in the cold morning air. The peak seemed impossibly far, shrouded in clouds that whispered of doubt.',
      'He had trained for months, waking before dawn, pushing his body through pain and exhaustion. But now, facing the reality of the climb, fear wrapped around his heart like frost.',
      'The guide, an old man with eyes like weathered stone, placed a hand on his shoulder. "The mountain is not your enemy," he said. "Your mind is. One step at a time."',
      'So Rajat climbed. When his legs burned, he focused on the next rock. When doubt screamed, he counted his breaths. The summit, once a distant dream, grew closer with each stubborn step.',
      'At the top, as the sun broke through the clouds, Rajat understood: every mountain we face in life is climbed the same way. Not by looking at the peak, but by taking the next step.',
    ],
  },
  {
    id: 'daily-rituals',
    title: 'The Power of Small Rituals',
    moodTag: 'Discipline · Consistency',
    category: 'discipline',
    duration: '7 min read',
    accent: 'from-amber-500/80 via-yellow-400 to-orange-400',
    thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    description: 'Greatness is built in the quiet moments when no one is watching.',
    pages: [
      'Every morning at 5 AM, while the world still slept, Priya sat at her desk. Not because she had to, but because she had promised herself.',
      'She wrote three pages. Every single day. Some days the words flowed like rivers. Other days, she stared at the cursor, writing nonsense just to fill the pages.',
      'Her friends laughed. "Why so serious?" they asked. "You\'re not getting paid for this." But Priya knew something they didn\'t: greatness is built in the invisible hours.',
      'Months passed. Then years. The small ritual, repeated daily, became a cathedral of discipline. And one day, Priya held her published book, knowing every word was earned in those quiet mornings.',
      'Discipline is not punishment. It is the architecture of dreams, built one brick at a time, in the moments when motivation fades but commitment remains.',
    ],
  },
  {
    id: 'phoenix-rising',
    title: 'Rising from Ashes',
    moodTag: 'Resilience · Rebirth',
    category: 'resilience',
    duration: '10 min read',
    accent: 'from-red-500/80 via-orange-400 to-amber-400',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    description: 'When everything burns down, we discover what we are truly made of.',
    pages: [
      'The fire took everything. Her home. Her business. Her sense of safety in the world. Ananya stood among the ashes, watching smoke rise into a gray sky.',
      'For weeks, she moved through life like a ghost. Eating without tasting. Sleeping without resting. The future she had planned was now a pile of cinders.',
      'Then one morning, she noticed something impossible: a green shoot pushing through the blackened earth. A plant, defying destruction, reaching for light.',
      'Ananya knelt beside it. If something so fragile could persist through such devastation, what might she be capable of? The thought felt dangerous. It also felt like hope.',
      'She started small. One decision. One action. One day at a time. The phoenix does not rise in a single moment of glory. It rises in a thousand small choices to continue.',
    ],
  },
  {
    id: 'success-garden',
    title: 'The Garden of Success',
    moodTag: 'Success · Patience',
    category: 'success',
    duration: '8 min read',
    accent: 'from-green-500/80 via-emerald-400 to-teal-400',
    thumbnail: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    description: 'Success grows slowly, rooted in patience and watered with persistence.',
    pages: [
      'Vikram\'s grandmother had a garden that was famous in the village. Every season, it overflowed with vegetables and flowers while neighboring plots struggled.',
      'As a boy, Vikram asked her secret. She smiled and handed him a seed. "Plant this," she said. "Water it every day. Even when you see nothing happening."',
      'For two weeks, Vikram watered bare soil. Nothing emerged. He wanted to give up, but his grandmother\'s quiet faith kept him going. Then, one morning, a tiny green curl broke through.',
      'Years later, running his own business, Vikram remembered that seed. When months passed without profit, when competitors seemed to sprint ahead, he kept watering his dream.',
      'Success, he learned, is not a harvest you reap in a single season. It is a garden you tend across many years, trusting that growth happens even when you cannot see it.',
    ],
  },
  {
    id: 'breathe-deep',
    title: 'Just Breathe',
    moodTag: 'Mindfulness · Presence',
    category: 'mindfulness',
    duration: '5 min read',
    accent: 'from-cyan-500/80 via-blue-400 to-indigo-400',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&h=600&fit=crop',
    description: 'In the space between breaths, we find everything we have been searching for.',
    pages: [
      'The meditation teacher said nothing for the first ten minutes. Sarah sat in uncomfortable silence, her mind racing through to-do lists and worries.',
      'Then the teacher spoke: "You are not your thoughts. You are the awareness in which thoughts arise. Like the sky, you remain even when storms pass through."',
      'Sarah closed her eyes. She noticed the cool air entering her nostrils. The gentle rise of her chest. The pause at the top of each inhale, filled with possibility.',
      'For the first time in months, she was not planning, regretting, or anticipating. She was simply here, breathing, existing in this exact moment.',
      'Mindfulness is not about emptying the mind. It is about making room for presence, one breath at a time, until we remember we were never truly lost.',
    ],
  },
  {
    id: 'gratitude-jar',
    title: 'The Gratitude Jar',
    moodTag: 'Gratitude · Abundance',
    category: 'gratitude',
    duration: '6 min read',
    accent: 'from-yellow-500/80 via-amber-400 to-orange-400',
    thumbnail: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    description: 'What we focus on grows. A story about the transformative power of appreciation.',
    pages: [
      'Meera\'s therapist suggested a gratitude jar. "Write down three good things every day," she said. "Even on terrible days. Especially on terrible days."',
      'At first, Meera stared at the empty strips of paper, her mind blank. Good things? Her life felt like a series of small disasters. But she forced herself to begin.',
      'Day one: "The barista remembered my order. The sun came out at lunch. My cat purred when I got home." Small. Insignificant. Yet she folded the paper and dropped it in.',
      'Months later, the jar was full. As Meera read through the notes, patterns emerged. She had been surrounded by kindness all along, but her attention had been elsewhere.',
      'Gratitude does not require life to be perfect. It simply asks us to notice what is already here, transforming scarcity into abundance one small moment at a time.',
    ],
  },
  {
    id: 'inner-voice',
    title: 'Finding Your Voice',
    moodTag: 'Confidence · Authenticity',
    category: 'confidence',
    duration: '9 min read',
    accent: 'from-violet-500/80 via-purple-400 to-fuchsia-400',
    thumbnail: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    description: 'The world needs who you are becoming, not who you think you should be.',
    pages: [
      'Riya had spent years building a version of herself that others would approve of. The right job. The right friends. The right opinions, carefully selected to avoid conflict.',
      'But at night, alone with her thoughts, she felt hollow. The person in the mirror was a composite of expectations, assembled from other people\'s blueprints.',
      'Her breakthrough came during a conversation with a child. "What do you like?" the little girl asked. Riya opened her mouth to give the safe, expected answer.',
      'But something stopped her. For the first time, she told the truth: "I love painting, but I\'m terrible at it. I cry at sad movies. I think pineapple belongs on pizza."',
      'The girl laughed. "Good," she said. "Being terrible at things you love is how you get better. And crying means your heart works." Riya finally understood: authenticity is not about being perfect. It is about being real.',
    ],
  },
  {
    id: 'tomorrow-sun',
    title: 'Tomorrow\'s Sun',
    moodTag: 'Hope · Renewal',
    category: 'hope',
    duration: '7 min read',
    accent: 'from-orange-500/80 via-amber-400 to-yellow-400',
    thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    description: 'No night is so dark that it prevents the dawn from coming.',
    pages: [
      'Dr. Kumar sat by the hospital window, watching rain streak the glass. Another long shift. Another family receiving difficult news. The weight of human suffering felt unbearable.',
      'He had stopped believing in hope. Medicine, he told himself, was just about managing symptoms, delaying the inevitable. Every cure was temporary; every life, finite.',
      'Then he noticed something outside. Despite the storm, despite the dark clouds, the sun was trying to break through. A thin beam of light illuminated a single raindrop.',
      'In that moment, Dr. Kumar remembered why he had chosen this path. Not to defeat death—no one can do that. But to be present for people in their hardest moments, to offer light when darkness falls.',
      'Hope is not naive optimism. It is the stubborn refusal to let darkness have the final word, trusting that even the longest night eventually surrenders to morning.',
    ],
  },
  {
    id: 'old-sage',
    title: 'The Wisdom of Not Knowing',
    moodTag: 'Wisdom · Humility',
    category: 'wisdom',
    duration: '8 min read',
    accent: 'from-stone-500/80 via-gray-400 to-slate-400',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
    description: 'True wisdom begins with admitting how much we have yet to learn.',
    pages: [
      'A scholar traveled to the mountains to study with a famous sage. He arrived with notebooks full of questions, theories he had developed over years of study.',
      'The sage welcomed him and poured tea. As the cup filled, he kept pouring. Tea overflowed, spilling onto the table, then the floor. "Stop!" the scholar cried. "The cup is full!"',
      '"Exactly," the sage said, setting down the teapot. "You came with a full cup, already full of your own ideas. How can I teach you if there is no room for new knowledge?"',
      'The scholar was offended, then thoughtful, then humbled. He emptied his notebooks into the fire that night. In the morning, he approached the sage with empty hands.',
      'Wisdom is not accumulated knowledge. It is the courage to empty yourself, to say "I don\'t know," to remain curious and open in a world that rewards certainty.',
    ],
  },
  {
    id: 'bridge-between',
    title: 'The Bridge Between',
    moodTag: 'Connection · Empathy',
    category: 'connection',
    duration: '6 min read',
    accent: 'from-pink-500/80 via-rose-400 to-red-400',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=600&fit=crop',
    description: 'We are all bridges between each other, built of shared moments and understanding.',
    pages: [
      'Two strangers sat on opposite ends of the subway car, both crying silently. The other passengers looked away, embarrassed by displays of emotion in public.',
      'But one woman, older and unafraid, moved to sit between them. She said nothing, simply offered tissues. The strangers looked up, surprised by this small kindness.',
      '"Bad day?" the woman asked. They both nodded. Then, slowly, haltingly, stories emerged. A lost job. A sick parent. A broken heart. Different pain, but pain nonetheless.',
      'By the end of the ride, the three were laughing. They exchanged numbers, promising to check on each other. The older woman smiled: "See? We are not meant to suffer alone."',
      'Human connection is the bridge that carries us across our darkest waters. We build it with vulnerability, cross it with empathy, and maintain it with presence.',
    ],
  },
  {
    id: 'last-lecture',
    title: 'The Last Lecture',
    moodTag: 'Legacy · Purpose',
    category: 'motivation',
    duration: '10 min read',
    accent: 'from-blue-600/80 via-indigo-400 to-violet-400',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
    poster: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    description: 'What would you say if you knew this was your last chance to share wisdom?',
    pages: [
      'Professor Ahmed received the diagnosis on a Tuesday. Terminal. Six months, perhaps less. He walked out of the hospital and sat on a bench for three hours, watching people hurry by.',
      'That weekend, he announced one final class. "No grades," he wrote. "No syllabus. Just a conversation about what matters." The lecture hall overflowed with students, colleagues, strangers.',
      '"I spent my life accumulating credentials," he began. "Degrees. Publications. Awards. But in the end, none of it will accompany me. Only this: the love I gave, the people I helped, the moments when I was truly present."',
      'He spoke for two hours about failure, about courage, about the importance of telling people what they mean to you before it is too late. No one checked their phones. No one looked away.',
      'We treat life like a rehearsal, saving our best words and deepest feelings for a future that is not guaranteed. The last lecture is a reminder: every day could be the one that matters most.',
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-cyan-400" />
              Kahaniyan
            </h1>
            <p className="text-white/60 max-w-xl">
              15 emotional short stories designed for your mind. Pick a mood, open a book, and sink into
              smooth, page-by-page storytelling.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyan-400 bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <Sparkles className="w-4 h-4" />
            <span>Micro-reading · Mindful pacing</span>
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
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book, index) => (
            <motion.button
              key={book.id}
              type="button"
              onClick={() => openBook(book)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.03 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative text-left rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer transition-all duration-300"
            >
              {/* Thumbnail Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={book.thumbnail} 
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 capitalize">
                    {CATEGORIES.find(c => c.id === book.category)?.label}
                  </span>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-medium text-cyan-400 mb-2 uppercase tracking-wider">
                  {book.moodTag}
                </p>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    {book.duration}
                  </span>
                  <span className="text-xs font-medium text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read story
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${book.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
            </motion.button>
          ))}
        </motion.div>

        {/* Reader Overlay */}
        <AnimatePresence>
          {activeBook && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white border border-white/20"
              >
                {/* Poster Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={activeBook.poster} 
                    alt={activeBook.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                  
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={closeBook}
                    className="absolute top-4 right-4 p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs uppercase tracking-wider text-cyan-400 mb-2">{activeBook.moodTag}</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{activeBook.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activeBook.duration}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span>{totalPages} pages</span>
                    </div>
                  </div>
                </div>

                {/* Reader Body */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Navigation */}
                    <div className="md:w-24 flex md:flex-col items-center justify-between gap-4">
                      <div className="flex md:flex-col items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-white/40">Page</span>
                        <span className="text-2xl font-bold text-white">
                          {currentPage + 1}
                          <span className="text-white/30 text-lg">/{totalPages}</span>
                        </span>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button
                          type="button"
                          onClick={handlePrevPage}
                          disabled={currentPage === 0}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages - 1}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPage}
                          initial={{ opacity: 0, x: pageDirection === 'next' ? 30 : -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: pageDirection === 'next' ? -30 : 30 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10"
                        >
                          <p className="text-sm uppercase tracking-wider text-white/40 mb-4">
                            Page {currentPage + 1}
                          </p>
                          <p className="text-lg md:text-xl leading-relaxed text-white/90">
                            {activeBook.pages[currentPage]}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Progress Bar */}
                      <div className="mt-6">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
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
