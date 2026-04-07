import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Target, Plus, Check, Trash2, TrendingUp } from 'lucide-react';

const API_URL = '/api/goals';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'meditation',
    targetFrequency: 5,
    frequencyUnit: 'weekly'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view goals');
        return;
      }
      const response = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setGoals(response.data.goals);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create a goal');
        return;
      }
      await axios.post(API_URL, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      toast.success('Goal created!');
      setFormData({ title: '', description: '', category: 'meditation', targetFrequency: 5, frequencyUnit: 'weekly' });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleProgress = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to update progress');
        return;
      }
      await axios.put(`${API_URL}/${goalId}/progress`, undefined, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      toast.success('Progress updated!');
      fetchGoals();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to update progress');
    }
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Delete this goal?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to delete a goal');
          return;
        }
        await axios.delete(`${API_URL}/${goalId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        toast.success('Goal deleted');
        fetchGoals();
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          toast.error('Session expired. Please log in again.');
          return;
        }
        toast.error('Failed to delete goal');
      }
    }
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal.currentProgress / goal.targetFrequency) * 100, 100);
  };

  const categoryEmojis = {
    meditation: '🧘',
    journal: '📝',
    exercise: '💪',
    sleep: '😴',
    mindfulness: '✨',
    social: '👥',
    custom: '🎯'
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3 text-cyan-400" />
              My Goals
            </h1>
            <p className="text-white/60">Set and track your wellness goals</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New Goal</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="E.g., Daily Meditation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="meditation" className="bg-slate-800">Meditation</option>
                    <option value="journal" className="bg-slate-800">Journal</option>
                    <option value="exercise" className="bg-slate-800">Exercise</option>
                    <option value="sleep" className="bg-slate-800">Sleep</option>
                    <option value="mindfulness" className="bg-slate-800">Mindfulness</option>
                    <option value="social" className="bg-slate-800">Social</option>
                    <option value="custom" className="bg-slate-800">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Frequency</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.targetFrequency}
                      onChange={(e) => setFormData({ ...formData, targetFrequency: parseInt(e.target.value) })}
                      className="w-24 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      min="1"
                      required
                    />
                    <select
                      value={formData.frequencyUnit}
                      onChange={(e) => setFormData({ ...formData, frequencyUnit: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="daily" className="bg-slate-800">per Day</option>
                      <option value="weekly" className="bg-slate-800">per Week</option>
                      <option value="monthly" className="bg-slate-800">per Month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all font-medium">
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Goals List */}
        <div className="grid md:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center py-12">
              <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">No goals yet. Create your first goal!</p>
            </div>
          ) : (
            goals.map((goal, index) => (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{categoryEmojis[goal.category]}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                      <p className="text-sm text-white/50 capitalize">{goal.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-white/60 mb-4">{goal.description}</p>
                )}

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">
                      Progress: {goal.currentProgress} / {goal.targetFrequency} {goal.frequencyUnit}
                    </span>
                    <span className="font-semibold text-cyan-400">
                      {getProgressPercentage(goal).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold text-white">
                      {goal.streak} day streak
                    </span>
                  </div>
                  
                  {goal.status === 'active' && (
                    <button
                      onClick={() => handleProgress(goal._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Done</span>
                    </button>
                  )}
                  
                  {goal.status === 'completed' && (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold border border-emerald-500/30">
                      ✅ Completed!
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
