import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Heart, Calendar, Trash2, Camera } from 'lucide-react';
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
    { name: 'happy', emoji: '😊', color: 'bg-green-100 border-green-500 hover:bg-green-200' },
    { name: 'sad', emoji: '😢', color: 'bg-blue-100 border-blue-500 hover:bg-blue-200' },
    { name: 'anxious', emoji: '😰', color: 'bg-yellow-100 border-yellow-500 hover:bg-yellow-200' },
    { name: 'stressed', emoji: '😫', color: 'bg-red-100 border-red-500 hover:bg-red-200' },
    { name: 'calm', emoji: '😌', color: 'bg-purple-100 border-purple-500 hover:bg-purple-200' },
    { name: 'angry', emoji: '😠', color: 'bg-orange-100 border-orange-500 hover:bg-orange-200' },
    { name: 'excited', emoji: '🤩', color: 'bg-pink-100 border-pink-500 hover:bg-pink-200' },
    { name: 'tired', emoji: '😴', color: 'bg-gray-100 border-gray-500 hover:bg-gray-200' },
    { name: 'neutral', emoji: '😐', color: 'bg-slate-100 border-slate-500 hover:bg-slate-200' }
  ];

  const fetchMoods = async () => {
    try {
      const response = await axios.get('/api/mood');
      setMoods(response.data.moods);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleMicroReflectionComplete = async ({ emotion, intensity, note, trackingType, source, challengeType, helpedBy }) => {
    setLoading(true);
    try {
      await axios.post('/api/mood', {
        emotion,
        intensity,
        note,
        trackingType,
        source,
        challengeType,
        helpedBy,
      });
      toast.success('Mood logged successfully!');
      fetchMoods();
    } catch (error) {
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraComplete = async ({ emotion, intensity, note, trackingType, source, challengeType, helpedBy }) => {
    setLoading(true);
    try {
      await axios.post('/api/mood', {
        emotion,
        intensity,
        note,
        trackingType,
        source,
        challengeType,
        helpedBy,
      });
      toast.success('Tracking entry saved');
      fetchMoods();
    } catch (error) {
      toast.error('Failed to save tracking entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/mood/${id}`);
      toast.success('Mood deleted');
      fetchMoods();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <Heart className="w-10 h-10 mr-3" />
            Tracking
          </h1>
          <p className="text-gray-600">Track how you feel using questions or your camera.</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('question')}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              mode === 'question'
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary/60 hover:text-primary'
            }`}
          >
            Question-based
          </button>
          <button
            type="button"
            onClick={() => setMode('camera')}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all flex items-center gap-2 ${
              mode === 'camera'
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary/60 hover:text-primary'
            }`}
          >
            <Camera className="w-4 h-4" />
            Camera-based
          </button>
        </div>

        {/* Mood Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card neuro-hologram-hover mb-8"
        >
          {mode === 'question' ? (
            <>
              <h2 className="text-2xl font-bold mb-6">10-question wellbeing check</h2>
              <QuestionSurveyCard onComplete={handleMicroReflectionComplete} loading={loading} />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Camera-based Tracking</h2>
              <CameraTrackingCard onComplete={handleCameraComplete} loading={loading} />
            </>
          )}
        </motion.div>

        {/* Recent Moods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card neuro-hologram-hover"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Recent Entries
          </h2>
          
          {moods.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No mood entries yet. Start tracking!</p>
          ) : (
            <div className="space-y-4">
              {moods.slice(0, 10).map((mood, index) => {
                const emotionData = emotions.find(e => e.name === mood.emotion);
                return (
                  <div key={mood.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{emotionData?.emoji}</div>
                      <div>
                        <p className="font-semibold capitalize">{mood.emotion}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(mood.date).toLocaleDateString()} at {new Date(mood.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {mood.note && <p className="text-sm text-gray-600 mt-1">{mood.note}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-2xl font-bold text-primary">{mood.intensity}/10</p>
                      <button
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        onClick={() => handleDelete(mood.id)}
                        title="Delete entry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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
