import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, Check, Trash2, TrendingUp, Calendar, 
  Clock, Edit2, X, Search, CheckCircle2, Circle,
  Filter, MoreHorizontal
} from 'lucide-react';

const API_URL = '/api/goals';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
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
      console.log('Fetching goals with token...');
      const response = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      console.log('Goals response:', response.data);
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        toast.error('Session expired. Please log in again.');
        return;
      }
      toast.error('Failed to fetch goals: ' + (error.response?.data?.message || error.message));
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

      const dataToSend = {
        ...formData,
        deadline: formData.deadline || null
      };

      if (editingGoal) {
        await axios.put(`${API_URL}/${editingGoal._id}`, dataToSend, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        toast.success('Goal updated!');
      } else {
        await axios.post(API_URL, dataToSend, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        toast.success('Goal created!');
      }
      
      setFormData({ title: '', description: '', deadline: '', category: 'meditation', targetFrequency: 5, frequencyUnit: 'weekly' });
      setShowForm(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      toast.error(editingGoal ? 'Failed to update goal' : 'Failed to create goal');
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

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      deadline: goal.endDate ? goal.endDate.split('T')[0] : '',
      category: goal.category,
      targetFrequency: goal.targetFrequency,
      frequencyUnit: goal.frequencyUnit
    });
    setShowForm(true);
  };

  const handleToggleComplete = async (goal) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const newStatus = goal.status === 'completed' ? 'active' : 'completed';
      await axios.put(`${API_URL}/${goal._id}`, { ...goal, status: newStatus }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      toast.success(newStatus === 'completed' ? 'Goal completed!' : 'Goal reactivated!');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to update goal status');
    }
  };

  const getDaysUntilDeadline = (endDate) => {
    if (!endDate) return null;
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
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

  const categoryColors = {
    meditation: 'from-rose-500 to-pink-600',
    journal: 'from-amber-500 to-orange-600',
    exercise: 'from-emerald-500 to-teal-600',
    sleep: 'from-indigo-500 to-purple-600',
    mindfulness: 'from-cyan-500 to-blue-600',
    social: 'from-violet-500 to-purple-600',
    custom: 'from-fuchsia-500 to-pink-600'
  };

  const filteredGoals = goals
    .filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (goal.description && goal.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate) - new Date(b.endDate);
      }
      if (sortBy === 'progress') return getProgressPercentage(b) - getProgressPercentage(a);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const pendingGoals = goals.filter(g => g.status === 'active').length;
  const completionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
                <Target className="w-8 h-8 mr-3 text-cyan-400" />
                Goals Tracker
              </h1>
              <p className="text-white/60">Organize, track, and achieve your wellness goals</p>
            </div>
            
            <button
              onClick={() => { setEditingGoal(null); setShowForm(!showForm); }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Goal</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Total Goals</span>
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white">{goals.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Completed</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400">{completedGoals}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Pending</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400">{pendingGoals}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Completion Rate</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400">{completionRate}%</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search goals..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="active" className="bg-slate-800">Active</option>
              <option value="completed" className="bg-slate-800">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="deadline" className="bg-slate-800">Sort by Deadline</option>
              <option value="progress" className="bg-slate-800">Sort by Progress</option>
              <option value="title" className="bg-slate-800">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setEditingGoal(null); }}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Goal Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                        placeholder="E.g., Daily Meditation"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Deadline</label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                      placeholder="Describe your goal..."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
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
                      <label className="block text-sm font-medium text-white/80 mb-2">Target</label>
                      <input
                        type="number"
                        value={formData.targetFrequency}
                        onChange={(e) => setFormData({ ...formData, targetFrequency: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Frequency</label>
                      <select
                        value={formData.frequencyUnit}
                        onChange={(e) => setFormData({ ...formData, frequencyUnit: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="daily" className="bg-slate-800">per Day</option>
                        <option value="weekly" className="bg-slate-800">per Week</option>
                        <option value="monthly" className="bg-slate-800">per Month</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all font-medium"
                    >
                      {editingGoal ? 'Update Goal' : 'Create Goal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingGoal(null); }}
                      className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-16">
              <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">No goals found</p>
              <p className="text-white/40 text-sm mt-1">Create your first goal to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Goal</th>
                    <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Category</th>
                    <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Progress</th>
                    <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Deadline</th>
                    <th className="text-center py-4 px-6 text-white/60 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal, index) => {
                    const progress = getProgressPercentage(goal);
                    const daysLeft = getDaysUntilDeadline(goal.endDate);
                    
                    return (
                      <motion.tr
                        key={goal._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        {/* Status */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleComplete(goal)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                              goal.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-white/40 hover:bg-cyan-500/20 hover:text-cyan-400'
                            }`}
                          >
                            {goal.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </td>

                        {/* Goal Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{categoryEmojis[goal.category]}</div>
                            <div>
                              <h3 className={`font-semibold ${goal.status === 'completed' ? 'text-white/50 line-through' : 'text-white'}`}>
                                {goal.title}
                              </h3>
                              {goal.description && (
                                <p className="text-white/40 text-sm mt-1 line-clamp-1">{goal.description}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[goal.category]} text-white`}>
                            {goal.category}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="py-4 px-6">
                          <div className="w-32">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/60">{goal.currentProgress}/{goal.targetFrequency}</span>
                              <span className="text-cyan-400 font-medium">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="py-4 px-6">
                          {goal.endDate ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-white/40" />
                              <span className={`text-sm ${
                                daysLeft < 0 ? 'text-red-400' :
                                daysLeft <= 3 ? 'text-amber-400' :
                                'text-white/60'
                              }`}>
                                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` :
                                 daysLeft === 0 ? 'Today' :
                                 `${daysLeft}d left`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-white/30 text-sm">No deadline</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {goal.status === 'active' && progress < 100 && (
                              <button
                                onClick={() => handleProgress(goal._id)}
                                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                title="Mark progress"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(goal)}
                              className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(goal._id)}
                              className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {filteredGoals.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-white/40 text-sm">
            <span>Showing {filteredGoals.length} of {goals.length} goals</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                {completedGoals} completed
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                {pendingGoals} pending
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
