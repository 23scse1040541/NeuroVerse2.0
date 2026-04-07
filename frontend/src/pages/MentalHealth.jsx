import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Activity, Sparkles, TrendingUp, Calendar, Clock,
  ChevronRight, Zap, Moon, Sun, Smile, Frown, Meh, AlertCircle,
  CheckCircle, BarChart3, Lightbulb, Target, Shield
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const MentalHealthTracking = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // Mock data for mental health trends
  const generateMentalHealthData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'MMM dd'),
        mood: 5 + Math.floor(Math.random() * 4),
        anxiety: Math.floor(Math.random() * 6),
        energy: 4 + Math.floor(Math.random() * 5),
        sleep: 6 + Math.floor(Math.random() * 3),
        stress: Math.floor(Math.random() * 7)
      });
    }
    return data;
  };

  const [healthData, setHealthData] = useState(generateMentalHealthData());

  // Wellness dimensions for radar chart
  const wellnessDimensions = [
    { subject: 'Emotional', A: 78, fullMark: 100 },
    { subject: 'Physical', A: 72, fullMark: 100 },
    { subject: 'Social', A: 65, fullMark: 100 },
    { subject: 'Occupational', A: 80, fullMark: 100 },
    { subject: 'Spiritual', A: 70, fullMark: 100 },
    { subject: 'Intellectual', A: 85, fullMark: 100 }
  ];

  // AI-generated insights based on patterns
  const generateAIInsights = () => {
    return [
      {
        type: 'pattern',
        title: 'Sleep-Mood Correlation',
        description: 'Your mood scores are 23% higher on days with 7+ hours of sleep. Consider maintaining a consistent sleep schedule.',
        icon: Moon,
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'bg-indigo-50'
      },
      {
        type: 'prediction',
        title: 'Weekly Forecast',
        description: 'Based on your patterns, Tuesday might be challenging. Plan a mindfulness session in advance.',
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50'
      },
      {
        type: 'recommendation',
        title: 'Personalized Tip',
        description: 'Your anxiety peaks at 3 PM. Try a 5-minute breathing exercise at 2:45 PM today.',
        icon: Lightbulb,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50'
      }
    ];
  };

  const [insights, setInsights] = useState(generateAIInsights());

  // Mood options with icons and colors
  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'bg-emerald-100 text-emerald-700', gradient: 'from-emerald-400 to-emerald-600' },
    { value: 'calm', label: 'Calm', icon: Sun, color: 'bg-blue-100 text-blue-700', gradient: 'from-blue-400 to-blue-600' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-700', gradient: 'from-gray-400 to-gray-600' },
    { value: 'anxious', label: 'Anxious', icon: AlertCircle, color: 'bg-amber-100 text-amber-700', gradient: 'from-amber-400 to-amber-600' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'bg-rose-100 text-rose-700', gradient: 'from-rose-400 to-rose-600' }
  ];

  const handleCheckIn = () => {
    if (!currentMood) {
      toast.error('Please select a mood first');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date(),
      mood: currentMood,
      intensity,
      notes,
      timestamp: new Date().toISOString()
    };

    setMoodEntries([newEntry, ...moodEntries]);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysis = {
        sentiment: intensity > 7 ? 'positive' : intensity > 4 ? 'neutral' : 'concerning',
        recommendation: intensity < 4 
          ? 'Consider reaching out to a specialist or trying a guided meditation.'
          : 'Great entry! Keep tracking to maintain this positive trend.',
        trend: moodEntries.length > 0 
          ? `This is ${intensity > moodEntries[0].intensity ? 'higher' : 'lower'} than your last entry.`
          : 'First entry! Keep tracking to see your patterns.'
      };
      setAiAnalysis(analysis);
      toast.success('Check-in saved! AI analysis generated.');
    }, 500);

    setShowCheckIn(false);
    setCurrentMood(null);
    setIntensity(5);
    setNotes('');
  };

  // Stats cards
  const stats = [
    { 
      label: 'Mental Health Score', 
      value: '78/100', 
      trend: '+5%',
      icon: Brain, 
      color: 'from-indigo-500 to-purple-500',
      description: 'Overall wellness metric'
    },
    { 
      label: 'Check-ins This Week', 
      value: moodEntries.length + 5, 
      trend: '+2',
      icon: Calendar, 
      color: 'from-emerald-500 to-teal-500',
      description: 'Consistency matters'
    },
    { 
      label: 'Avg Mood Score', 
      value: '6.8', 
      trend: '+0.3',
      icon: Heart, 
      color: 'from-rose-500 to-pink-500',
      description: '7-day average'
    },
    { 
      label: 'Streak', 
      value: '12 days', 
      trend: 'Best!',
      icon: Zap, 
      color: 'from-amber-500 to-orange-500',
      description: 'Keep it up!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Mental Health
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  Intelligence
                </span>
              </h1>
              <p className="text-gray-500">AI-powered insights for your emotional well-being</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCheckIn(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              <Activity className="w-5 h-5" />
              Daily Check-in
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Trends Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  7-Day Wellness Trends
                </h3>
                <div className="flex gap-2">
                  {['mood', 'anxiety', 'energy'].map((metric) => (
                    <button
                      key={metric}
                      className="px-3 py-1 text-xs font-medium capitalize rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={3} fill="url(#colorMood)" />
                  <Area type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={3} fill="url(#colorEnergy)" />
                  <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Wellness Dimensions Radar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Wellness Dimensions
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={wellnessDimensions}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Current"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-3 md:w-48">
                  {wellnessDimensions.map((dim, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{dim.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${dim.A}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{dim.A}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* AI Insights Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
                  <p className="text-xs text-gray-500">Powered by machine learning</p>
                </div>
              </div>

              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-xl ${insight.bgColor} border border-opacity-20`}
                    style={{ borderColor: insight.color }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                        <insight.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Entries */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Recent Entries
              </h3>
              <div className="space-y-3">
                {[...moodEntries.slice(0, 3), ...Array(3 - moodEntries.length).fill(null)].map((entry, index) => {
                  if (!entry) {
                    return (
                      <div key={`empty-${index}`} className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-sm text-gray-400">No entry yet</p>
                      </div>
                    );
                  }
                  const moodOption = moodOptions.find(m => m.value === entry.mood) || moodOptions[2];
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${moodOption.color} flex items-center justify-center`}>
                          <moodOption.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{entry.mood}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(entry.date), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{entry.intensity}/10</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Your data is secure</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    All mental health data is encrypted and stored locally. You control your information.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Check-in Modal */}
        <AnimatePresence>
          {showCheckIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How are you feeling?</h2>
                  <p className="text-gray-500 mt-2">Track your mood to get personalized insights</p>
                </div>

                {/* Mood Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {moodOptions.map((mood) => (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentMood(mood.value)}
                      className={`p-4 rounded-xl transition-all ${
                        currentMood === mood.value
                          ? `${mood.color} ring-2 ring-offset-2 ring-indigo-500`
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <mood.icon className={`w-8 h-8 mx-auto mb-2 ${currentMood === mood.value ? '' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${currentMood === mood.value ? '' : 'text-gray-600'}`}>
                        {mood.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Intensity Slider */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Mild</span>
                    <span>Strong</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's affecting your mood today?"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckIn(false)}
                    className="flex-1 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    Save Entry
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Analysis Result */}
        <AnimatePresence>
          {aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-indigo-100 z-40"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  aiAnalysis.sentiment === 'positive' ? 'bg-emerald-100' :
                  aiAnalysis.sentiment === 'concerning' ? 'bg-rose-100' : 'bg-blue-100'
                }`}>
                  {aiAnalysis.sentiment === 'positive' ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : aiAnalysis.sentiment === 'concerning' ? (
                    <AlertCircle className="w-6 h-6 text-rose-600" />
                  ) : (
                    <Brain className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">AI Analysis</h4>
                  <p className="text-sm text-gray-600 mt-1">{aiAnalysis.recommendation}</p>
                  <p className="text-xs text-gray-400 mt-2">{aiAnalysis.trend}</p>
                </div>
                <button
                  onClick={() => setAiAnalysis(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MentalHealthTracking;
