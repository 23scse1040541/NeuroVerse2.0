import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Heart, Calendar, Trash2, Camera, TrendingUp, Activity, Sparkles, Brain } from 'lucide-react';
import QuestionSurveyCard from '../components/QuestionSurveyCard';
import CameraTrackingCard from '../components/CameraTrackingCard';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('question'); // 'question' | 'camera'

  useEffect(() => {
    fetchMoods();
  }, []);

  const emotions = [
    { name: 'happy', emoji: '😊', color: 'bg-emerald-500/20 border-emerald-400' },
    { name: 'sad', emoji: '😢', color: 'bg-blue-500/20 border-blue-400' },
    { name: 'anxious', emoji: '😰', color: 'bg-amber-500/20 border-amber-400' },
    { name: 'stressed', emoji: '😫', color: 'bg-rose-500/20 border-rose-400' },
    { name: 'calm', emoji: '😌', color: 'bg-purple-500/20 border-purple-400' },
    { name: 'angry', emoji: '😠', color: 'bg-orange-500/20 border-orange-400' },
    { name: 'excited', emoji: '🤩', color: 'bg-pink-500/20 border-pink-400' },
    { name: 'tired', emoji: '😴', color: 'bg-slate-500/20 border-slate-400' },
    { name: 'neutral', emoji: '😐', color: 'bg-gray-500/20 border-gray-400' }
  ];

  const fetchMoods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/mood', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setMoods(response.data.moods);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      console.error('Error fetching moods:', error);
    }
  };

  const handleMicroReflectionComplete = async ({ emotion, intensity, note, trackingType, source, challengeType, helpedBy }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to log mood');
        return;
      }
      await axios.post('/api/mood', {
        emotion,
        intensity,
        note,
        trackingType,
        source,
        challengeType,
        helpedBy,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mood logged successfully!');
      fetchMoods();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraComplete = async ({ emotion, intensity, note, trackingType, source, challengeType, helpedBy }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to save tracking entry');
        return;
      }
      await axios.post('/api/mood', {
        emotion,
        intensity,
        note,
        trackingType,
        source,
        challengeType,
        helpedBy,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Tracking entry saved');
      fetchMoods();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to save tracking entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete');
        return;
      }
      await axios.delete(`/api/mood/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mood deleted');
      fetchMoods();
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to delete');
    }
  };

  // Calculate stats for display
  const stats = {
    totalEntries: moods.length,
    avgIntensity: moods.length > 0 
      ? (moods.reduce((acc, m) => acc + (m.intensity || 0), 0) / moods.length).toFixed(1)
      : '0',
    streak: moods.length > 0 ? Math.min(moods.length, 7) : 0,
    dominantMood: moods.length > 0 
      ? moods.slice().sort((a,b) => new Date(b.date) - new Date(a.date))[0]?.emotion 
      : 'None'
  };

  const statCards = [
    { icon: Activity, label: 'Total Entries', value: stats.totalEntries, color: 'from-cyan-500 to-blue-600' },
    { icon: TrendingUp, label: 'Avg Intensity', value: stats.avgIntensity, color: 'from-emerald-500 to-teal-600' },
    { icon: Calendar, label: 'Day Streak', value: stats.streak, color: 'from-amber-500 to-orange-600' },
    { icon: Brain, label: 'Last Mood', value: stats.dominantMood, color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
                <Heart className="w-8 h-8 mr-3 text-rose-400" />
                Mood Tracking
              </h1>
              <p className="text-white/60">Track how you feel using questions or your camera.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-cyan-400 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>AI-powered insights · Emotional wellness</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-6 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit"
        >
          <button
            type="button"
            onClick={() => setMode('question')}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              mode === 'question'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4" />
            Question-based
          </button>
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              mode === 'camera'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            Camera-based
          </button>
        </motion.div>

        {/* Mood Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              {mode === 'question' ? <Activity className="w-6 h-6 text-white" /> : <Camera className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'question' ? '10-Question Wellbeing Check' : 'Camera-Based Tracking'}
              </h2>
              <p className="text-white/50 text-sm">
                {mode === 'question' ? 'Answer a few questions to log your mood' : 'Use your camera for AI-powered mood detection'}
              </p>
            </div>
          </div>
          {mode === 'question' ? (
            <QuestionSurveyCard onComplete={handleMicroReflectionComplete} loading={loading} />
          ) : (
            <CameraTrackingCard onComplete={handleCameraComplete} loading={loading} />
          )}
        </motion.div>

        {/* Recent Moods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recent Entries</h2>
                <p className="text-white/50 text-sm">Your mood history over time</p>
              </div>
            </div>
            {moods.length > 0 && (
              <span className="text-sm text-white/40 bg-white/10 px-3 py-1 rounded-full">
                {moods.length} entries
              </span>
            )}
          </div>
          
          {moods.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/50">No mood entries yet. Start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moods.slice(0, 10).map((mood, index) => {
                const emotionData = emotions.find(e => e.name === mood.emotion);
                return (
                  <motion.div 
                    key={mood.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${emotionData?.color || 'bg-white/10'} flex items-center justify-center text-2xl border-2`}>
                        {emotionData?.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize text-lg">{mood.emotion}</p>
                        <p className="text-sm text-white/40">
                          {new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(mood.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {mood.note && <p className="text-sm text-white/60 mt-1 line-clamp-1">{mood.note}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">{mood.intensity}<span className="text-lg text-white/40">/10</span></p>
                        <p className="text-xs text-white/30">intensity</p>
                      </div>
                      <button
                        className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => handleDelete(mood.id)}
                        title="Delete entry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker;
