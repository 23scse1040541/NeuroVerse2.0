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
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
              <Target className="w-10 h-10 mr-3" />
              My Goals
            </h1>
            <p className="text-gray-600">Set and track your wellness goals</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card neuro-hologram-hover mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Goal</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="E.g., Daily Meditation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="meditation">Meditation</option>
                    <option value="journal">Journal</option>
                    <option value="exercise">Exercise</option>
                    <option value="sleep">Sleep</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="social">Social</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.targetFrequency}
                      onChange={(e) => setFormData({ ...formData, targetFrequency: parseInt(e.target.value) })}
                      className="input-field w-24"
                      min="1"
                      required
                    />
                    <select
                      value={formData.frequencyUnit}
                      onChange={(e) => setFormData({ ...formData, frequencyUnit: e.target.value })}
                      className="input-field flex-1"
                    >
                      <option value="daily">per Day</option>
                      <option value="weekly">per Week</option>
                      <option value="monthly">per Month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
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
            <div className="col-span-full card neuro-hologram-hover text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No goals yet. Create your first goal!</p>
            </div>
          ) : (
            goals.map((goal, index) => (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card neuro-hologram-hover"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{categoryEmojis[goal.category]}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{goal.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                )}

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Progress: {goal.currentProgress} / {goal.targetFrequency} {goal.frequencyUnit}
                    </span>
                    <span className="font-semibold text-primary">
                      {getProgressPercentage(goal).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {goal.streak} day streak
                    </span>
                  </div>
                  
                  {goal.status === 'active' && (
                    <button
                      onClick={() => handleProgress(goal._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Done</span>
                    </button>
                  )}
                  
                  {goal.status === 'completed' && (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
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
