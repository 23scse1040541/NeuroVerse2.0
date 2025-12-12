import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { user, checkAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    preferences: user?.preferences || { notifications: true, moodReminder: true, meditationReminder: true }
  });
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <User className="w-10 h-10 mr-3" />
            Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card neuro-hologram-hover">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-gray-700 font-medium">Experience</div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">EXP: {user?.exp || 0}</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
              <div className="grid md:grid-cols-3 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, notifications: e.target.checked } })}
                  />
                  <span>Notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferences.moodReminder}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, moodReminder: e.target.checked } })}
                  />
                  <span>Mood Reminders</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferences.meditationReminder}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, meditationReminder: e.target.checked } })}
                  />
                  <span>Meditation Reminders</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
