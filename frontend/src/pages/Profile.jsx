import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Save, Crown, Zap, Shield, Check, Sparkles, Award, Clock, Edit3, ChevronRight, Star, TrendingUp, Target, Calendar, Brain, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MEMBERSHIP_TIERS = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Shield,
    color: 'from-slate-400 to-slate-600',
    price: 0,
    period: 'Free Forever',
    description: 'Perfect for getting started with your wellness journey',
    features: [
      'Daily mood tracking',
      'Basic journal entries',
      '5 Kahaniyan stories',
      'Community support',
      'Basic mindfulness exercises'
    ],
    limitations: ['No specialist access', 'Limited games', 'No AI insights']
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: Zap,
    color: 'from-cyan-400 to-blue-600',
    price: 9.99,
    period: 'per month',
    popular: true,
    description: 'Most popular choice for serious wellness enthusiasts',
    features: [
      'Everything in Basic',
      'All 15 Kahaniyan stories',
      'Full specialist directory',
      'Advanced mood analytics',
      'All brain games',
      'Priority support',
      'Monthly progress reports'
    ],
    limitations: ['Limited specialist sessions (2/month)']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    icon: Crown,
    color: 'from-amber-400 via-orange-500 to-pink-500',
    price: 29.99,
    period: 'per month',
    description: 'Ultimate wellness experience with unlimited access',
    features: [
      'Everything in Standard',
      'Unlimited specialist sessions',
      '1-on-1 coaching calls',
      'Custom wellness plans',
      'AI-powered insights',
      'Family account (up to 4)',
      'Exclusive workshops',
      '24/7 priority support',
      'Early access to new features'
    ],
    limitations: []
  }
];

const Profile = () => {
  const { user, checkAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    preferences: user?.preferences || { notifications: true, moodReminder: true, meditationReminder: true }
  });
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('basic');
  const [showTierDetails, setShowTierDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/auth/update-profile', formData);
      toast.success('Profile updated');
      await checkAuth();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
    toast.success(`Selected ${MEMBERSHIP_TIERS.find(t => t.id === tierId).name} plan`);
  };

  // Stats data (mock)
  const stats = {
    streakDays: 12,
    totalSessions: 45,
    moodEntries: 87,
    goalsCompleted: 15,
    level: 8,
    exp: 2450,
    nextLevelExp: 3000
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
                <User className="w-8 h-8 mr-3 text-cyan-400" />
                Profile
              </h1>
              <p className="text-white/60">Manage your account and membership</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-cyan-400 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Crown className="w-4 h-4" />
              <span className="capitalize">{selectedTier} Member</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Day Streak', value: stats.streakDays, icon: Calendar, color: 'from-orange-400 to-red-500' },
            { label: 'Level', value: stats.level, icon: Award, color: 'from-yellow-400 to-amber-500' },
            { label: 'Mood Entries', value: stats.moodEntries, icon: Brain, color: 'from-cyan-400 to-blue-500' },
            { label: 'Goals Done', value: stats.goalsCompleted, icon: Target, color: 'from-emerald-400 to-teal-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
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
        </motion.div>

        {/* Experience Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-400/20 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold">Experience Points</span>
            </div>
            <span className="text-cyan-400 font-bold">{stats.exp} / {stats.nextLevelExp} XP</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.exp / stats.nextLevelExp) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p className="text-sm text-white/50 mt-2">{stats.nextLevelExp - stats.exp} XP needed for Level {stats.level + 1}</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'membership', label: 'Membership', icon: Crown },
            { id: 'settings', label: 'Settings', icon: Edit3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        {/* Membership Tiers */}
        {activeTab === 'membership' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Membership</h2>
              <p className="text-white/60">Unlock premium features and accelerate your wellness journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {MEMBERSHIP_TIERS.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl p-6 border transition-all ${
                    selectedTier === tier.id
                      ? 'bg-white/10 border-cyan-400 shadow-xl shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                    <tier.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">${tier.price}</span>
                    <span className="text-white/50 text-sm">/{tier.period}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                    {tier.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full border border-white/30 mt-0.5 shrink-0" />
                        <span className="text-sm text-white/50 line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleTierSelect(tier.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      selectedTier === tier.id
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {selectedTier === tier.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Current Plan Benefits */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-400/20 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Your Current Benefits</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {MEMBERSHIP_TIERS.find(t => t.id === selectedTier)?.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Settings */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                <textarea
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Notification Preferences</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { key: 'notifications', label: 'Push Notifications', icon: Sparkles },
                    { key: 'moodReminder', label: 'Mood Reminders', icon: Brain },
                    { key: 'meditationReminder', label: 'Mindfulness Alerts', icon: Clock },
                  ].map((pref) => (
                    <label
                      key={pref.key}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.preferences[pref.key]
                          ? 'bg-cyan-500/20 border-cyan-400/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <pref.icon className={`w-5 h-5 ${formData.preferences[pref.key] ? 'text-cyan-400' : 'text-white/40'}`} />
                      <div className="flex-1">
                        <span className={`text-sm ${formData.preferences[pref.key] ? 'text-white' : 'text-white/60'}`}>
                          {pref.label}
                        </span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        formData.preferences[pref.key] ? 'bg-cyan-500' : 'bg-white/20'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          formData.preferences[pref.key] ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.preferences[pref.key]}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, [pref.key]: e.target.checked }
                        })}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{formData.name || 'User'}</h3>
                  <p className="text-white/50">{formData.bio || 'No bio yet'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium capitalize">
                      {selectedTier} Member
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { icon: Brain, text: 'Logged mood: Happy', time: '2 hours ago', color: 'text-green-400' },
                  { icon: Target, text: 'Completed goal: Meditate daily', time: 'Yesterday', color: 'text-cyan-400' },
                  { icon: Award, text: 'Reached Level 8', time: '2 days ago', color: 'text-yellow-400' },
                  { icon: BookOpen, text: 'Read "Morning Light"', time: '3 days ago', color: 'text-purple-400' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.text}</p>
                      <p className="text-white/40 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
