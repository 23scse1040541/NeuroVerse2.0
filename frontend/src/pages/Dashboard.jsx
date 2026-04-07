import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Target, TrendingUp, Flame, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 20000);

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
        const recent = moods
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7);
        const stats = {
          totalMoodEntries: moods.length,
          totalJournalEntries: 0,
          activeGoals: 0,
          completedGoals: 0,
        };
        const streaks = {
          journalStreak: 0,
          moodStreak: 0,
          meditationStreak: 0,
        };
        setDashboardData({ stats, streaks, recentMoods: recent });
        setLastUpdated(new Date().toISOString());
      } catch (fallbackErr) {
        console.error('Error fetching dashboard:', fallbackErr);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const streaks = dashboardData?.streaks || {};
  const recentMoods = dashboardData?.recentMoods || [];

  const statCards = [
    { icon: Heart, label: 'Tracking Entries', value: stats.totalMoodEntries || 0, color: 'from-pink-500 to-rose-500' },
    { icon: BookOpen, label: 'Kahaniyan Reads', value: stats.totalJournalEntries || 0, color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Active Goals', value: stats.activeGoals || 0, color: 'from-green-500 to-emerald-500' },
    { icon: Award, label: 'Completed Goals', value: stats.completedGoals || 0, color: 'from-purple-500 to-violet-500' }
  ];

  const moodColors = {
    happy: '#22c55e',
    sad: '#3b82f6',
    anxious: '#f59e0b',
    stressed: '#ef4444',
    calm: '#8b5cf6',
    angry: '#dc2626',
    excited: '#f97316',
    tired: '#64748b',
    neutral: '#6b7280'
  };

  const moodChartData = recentMoods.map(mood => ({
    date: format(new Date(mood.date), 'MMM dd'),
    intensity: mood.intensity,
    emotion: mood.emotion
  })).reverse();

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Your Dashboard</h1>
            <p className="text-gray-600">Live view of your Tracking, Kahaniyan, and goals.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {lastUpdated
                ? `Updated ${new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Updating...'}
            </span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-[0.16em] mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md shadow-gray-300/70`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-[0.7rem] text-gray-400">Auto-updating from your recent activity.</p>
              </motion.div>
            );
          })}
        </div>

        {/* Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card neuro-hologram-hover mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Flame className="w-6 h-6 text-orange-500 mr-2" />
            Your Streaks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <Flame className="w-10 h-10 text-orange-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-orange-600">{streaks.journalStreak || 0}</p>
              <p className="text-gray-600 text-sm">Journal Streak</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-pink-600">{streaks.moodStreak || 0}</p>
              <p className="text-gray-600 text-sm">Mood Streak</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-600">{streaks.meditationStreak || 0}</p>
              <p className="text-gray-600 text-sm">Meditation Streak</p>
            </div>
          </div>
        </motion.div>

        {/* Mood Trend Chart */}
        {moodChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card neuro-hologram-hover mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Mood Intensity Trend (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#8EC5FC" 
                  strokeWidth={3}
                  dot={{ fill: '#8EC5FC', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Moods */}
        {recentMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card neuro-hologram-hover"
          >
            <h2 className="text-2xl font-bold mb-6">Recent Mood Entries</h2>
            <div className="space-y-3">
              {recentMoods.slice(0, 5).map((mood, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${moodColors[mood.emotion]}20` }}
                    >
                      {mood.emotion === 'happy' && '😊'}
                      {mood.emotion === 'sad' && '😢'}
                      {mood.emotion === 'anxious' && '😰'}
                      {mood.emotion === 'stressed' && '😫'}
                      {mood.emotion === 'calm' && '😌'}
                      {mood.emotion === 'angry' && '😠'}
                      {mood.emotion === 'excited' && '🤩'}
                      {mood.emotion === 'tired' && '😴'}
                      {mood.emotion === 'neutral' && '😐'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{mood.emotion}</p>
                      <p className="text-sm text-gray-500">{format(new Date(mood.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Intensity</p>
                    <p className="text-lg font-bold" style={{ color: moodColors[mood.emotion] }}>
                      {mood.intensity}/10
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
