import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, BookOpen, Target, TrendingUp, Flame, Award, Brain,
  Zap, Calendar, Clock, Activity, Sparkles, ChevronRight,
  BarChart3, Smile, Frown, Meh, ArrowUpRight, Sparkle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setDashboardData(response.data.dashboard);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      try {
        const token = localStorage.getItem('token');
        const moodsRes = await axios.get('/api/mood', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const moods = moodsRes.data.moods || [];
        const recent = moods.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
        const stats = { totalMoodEntries: moods.length, totalJournalEntries: 0, activeGoals: 0, completedGoals: 0 };
        const streaks = { journalStreak: 0, moodStreak: 0, meditationStreak: 0, gamesStreak: 0 };
        setDashboardData({ stats, streaks, recentMoods: recent, wellnessScore: 78 });
        setLastUpdated(new Date().toISOString());
      } catch (fallbackErr) {
        console.error('Error fetching dashboard:', fallbackErr);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20"
        >
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent" />
        </motion.div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const streaks = dashboardData?.streaks || {};
  const recentMoods = dashboardData?.recentMoods || [];
  const wellnessScore = dashboardData?.wellnessScore || 78;

  // Enhanced stat cards with icons and gradients
  const statCards = [
    { icon: Heart, label: 'Health Entries', value: stats.totalMoodEntries || 0, color: 'from-rose-500 to-pink-600', trend: '+12%', trendUp: true },
    { icon: BookOpen, label: 'Journal Entries', value: stats.totalJournalEntries || 0, color: 'from-blue-500 to-indigo-600', trend: '+5%', trendUp: true },
    { icon: Target, label: 'Active Goals', value: stats.activeGoals || 0, color: 'from-emerald-500 to-teal-600', trend: 'On track', trendUp: true },
    { icon: Award, label: 'Completed', value: stats.completedGoals || 0, color: 'from-violet-500 to-purple-600', trend: '+8%', trendUp: true },
  ];

  // Mood data with colors
  const moodColors = {
    happy: { color: '#22c55e', bg: '#dcfce7', icon: Smile },
    sad: { color: '#3b82f6', bg: '#dbeafe', icon: Frown },
    anxious: { color: '#f59e0b', bg: '#fef3c7', icon: Meh },
    stressed: { color: '#ef4444', bg: '#fee2e2', icon: Activity },
    calm: { color: '#8b5cf6', bg: '#ede9fe', icon: Sparkles },
    angry: { color: '#dc2626', bg: '#fecaca', icon: Flame },
    excited: { color: '#f97316', bg: '#ffedd5', icon: Zap },
    tired: { color: '#64748b', bg: '#f1f5f9', icon: Clock },
    neutral: { color: '#6b7280', bg: '#f3f4f6', icon: Meh }
  };

  // Generate mock data for charts
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      day,
      mood: 6 + Math.floor(Math.random() * 4),
      stress: 3 + Math.floor(Math.random() * 5),
      energy: 5 + Math.floor(Math.random() * 5),
      sleep: 7 + Math.floor(Math.random() * 3),
      focus: 6 + Math.floor(Math.random() * 4),
    }));
  };

  const weeklyData = generateWeeklyData();

  // Wellness radar data
  const wellnessData = [
    { subject: 'Sleep', A: 85, fullMark: 100 },
    { subject: 'Mood', A: 78, fullMark: 100 },
    { subject: 'Energy', A: 72, fullMark: 100 },
    { subject: 'Focus', A: 88, fullMark: 100 },
    { subject: 'Social', A: 65, fullMark: 100 },
    { subject: 'Exercise', A: 70, fullMark: 100 },
  ];

  // Mood distribution
  const moodDistribution = [
    { name: 'Happy', value: 35, color: '#22c55e' },
    { name: 'Calm', value: 25, color: '#8b5cf6' },
    { name: 'Neutral', value: 20, color: '#6b7280' },
    { name: 'Stressed', value: 15, color: '#ef4444' },
    { name: 'Sad', value: 5, color: '#3b82f6' },
  ];

  const quickActions = [
    { icon: Heart, label: 'Log Mood', path: '/mood-tracker', color: 'from-rose-500 to-pink-500' },
    { icon: BookOpen, label: 'Write Journal', path: '/journal', color: 'from-blue-500 to-indigo-500' },
    { icon: Target, label: 'Set Goal', path: '/goals', color: 'from-emerald-500 to-teal-500' },
    { icon: Brain, label: 'Brain Games', path: '/games', color: 'from-violet-500 to-purple-500' },
  ];

  const insights = [
    { type: 'positive', message: 'Your mood has improved 15% this week', icon: TrendingUp },
    { type: 'tip', message: 'Try a 5-minute meditation before bed', icon: Sparkles },
    { type: 'goal', message: '3 days until you complete your sleep goal!', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Welcome & Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  {dashboardData?.user?.name || 'Friend'}
                </span>
              </h1>
              <p className="text-gray-500">Here's your wellness snapshot for today</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                {['day', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      timeRange === range
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wellness Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 lg:p-8 text-white shadow-2xl shadow-indigo-500/20">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-white/80 font-medium">Overall Wellness Score</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl lg:text-7xl font-bold">{wellnessScore}</span>
                  <span className="text-2xl text-white/60">/100</span>
                </div>
                <p className="text-white/80">Your wellness is trending upward! Keep up the great work.</p>
              </div>
              <div className="flex gap-4 lg:gap-8">
                {[
                  { label: 'Streak', value: `${streaks.moodStreak || 0} days`, icon: Flame },
                  { label: 'Sessions', value: stats.totalMoodEntries || 0, icon: Calendar },
                  { label: 'Goals', value: `${Math.round((stats.completedGoals || 0) / (stats.activeGoals + stats.completedGoals || 1) * 100)}%`, icon: Target },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{action.label}</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Weekly Trends
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={3} fill="url(#colorMood)" />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-gray-600">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Energy</span>
              </div>
            </div>
          </motion.div>

          {/* Wellness Radar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Wellness Balance
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={wellnessData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
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
          </motion.div>
        </div>

        {/* Mood Distribution & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Mood Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Smile className="w-5 h-5 text-emerald-500" />
              Mood Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {moodDistribution.slice(0, 4).map((mood, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mood.color }} />
                  <span className="text-gray-600">{mood.name}</span>
                  <span className="text-gray-400 ml-auto">{mood.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Sparkle className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                    insight.type === 'tip' ? 'bg-amber-100 text-amber-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{insight.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {insight.type === 'positive' ? 'Based on your recent entries' :
                       insight.type === 'tip' ? 'Personalized recommendation' :
                       'Track your progress'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Moods */}
        {recentMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentMoods.slice(0, 5).map((mood, index) => {
                const moodConfig = moodColors[mood.emotion] || moodColors.neutral;
                const MoodIcon = moodConfig.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: moodConfig.bg }}
                      >
                        <MoodIcon className="w-6 h-6" style={{ color: moodConfig.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">{mood.emotion}</p>
                        <p className="text-sm text-gray-500">{format(new Date(mood.date), 'MMM dd, yyyy • h:mm a')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Intensity</p>
                        <p className="font-bold" style={{ color: moodConfig.color }}>
                          {mood.intensity}/10
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
