import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Brain,
  LayoutDashboard,
  Activity,
  BookHeart,
  Target,
  Sparkles,
  Users,
  MessageCircle,
  Gamepad2,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  Bell,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
    { path: '/mood-tracker', label: 'Track', icon: Activity, color: 'from-rose-500 to-pink-500' },
    { path: '/journal', label: 'Journal', icon: BookHeart, color: 'from-amber-500 to-orange-500' },
    { path: '/goals', label: 'Goals', icon: Target, color: 'from-emerald-500 to-teal-500' },
    { path: '/mindfulness', label: 'Mind', icon: Sparkles, color: 'from-violet-500 to-purple-500' },
    { path: '/specialists', label: 'Connect', icon: Users, color: 'from-cyan-500 to-blue-500' },
    { path: '/games', label: 'Games', icon: Gamepad2, color: 'from-cyan-500 to-blue-500' },
    { path: '/chatbot', label: 'AI', icon: MessageCircle, color: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg ${
          scrolled ? 'shadow-cyan-500/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity animate-glow" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold navbar-brand">
                  NeuroVerse
                </span>
                <span className="text-[10px] text-white/50 font-medium tracking-[0.2em] uppercase">
                  Mental Wellness
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {currentUser && (
              <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                <div className="flex items-center space-x-1 bg-white/5 rounded-2xl p-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="relative group"
                      >
                        <motion.div
                          whileHover={{ y: -1 }}
                          whileTap={{ y: 0 }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-white bg-white/15'
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                          <span className="hidden xl:inline">{link.label}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30"
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">12</span>
                    <span className="text-xs text-white/60">day streak</span>
                  </motion.div>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-white">
                        {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-white/50">Pro Member</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-white/70 font-medium hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white transition-all"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100">
                  {currentUser ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                        </p>
                        <p className="text-sm text-gray-500">{currentUser?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">Welcome to NeuroVerse</p>
                      <p className="text-sm text-gray-500">Sign in to track your wellness</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  {currentUser ? (
                    <div className="px-4 space-y-1">
                      {navLinks.map((link, index) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                          <motion.div
                            key={link.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={link.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                                isActive
                                  ? 'bg-indigo-50 text-indigo-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{link.label}</p>
                                <p className="text-xs text-gray-400">{link.description}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-300'}`} />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-6 space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-3 text-center text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full py-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
                {currentUser && (
                  <div className="p-4 border-t border-gray-100 space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">My Profile</span>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
