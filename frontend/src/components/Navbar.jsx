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
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Stats', color: 'from-blue-500 to-indigo-500' },
    { path: '/mood-tracker', label: 'Tracking', icon: Activity, description: 'Health Analytics', color: 'from-rose-500 to-pink-500' },
    { path: '/journal', label: 'Kahaniyan', icon: BookHeart, description: 'Personal Stories', color: 'from-amber-500 to-orange-500' },
    { path: '/goals', label: 'Goals', icon: Target, description: 'Set & Achieve', color: 'from-emerald-500 to-teal-500' },
    { path: '/mindfulness', label: 'Mindfulness', icon: Sparkles, description: 'Meditate & Relax', color: 'from-violet-500 to-purple-500' },
    { path: '/games', label: 'Games', icon: Gamepad2, description: 'Brain Training', color: 'from-cyan-500 to-blue-500' },
    { path: '/specialists', label: 'Connect', icon: Users, description: 'Expert Help', color: 'from-fuchsia-500 to-pink-500' },
    { path: '/chatbot', label: 'AI Chat', icon: MessageCircle, description: '24/7 Support', color: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  NeuroVerse
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                  Mental Wellness
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {currentUser && (
              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onMouseEnter={() => setActiveHover(link.path)}
                      onMouseLeave={() => setActiveHover(null)}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <motion.div
                          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        </motion.div>
                        <span>{link.label}</span>
                      </motion.div>

                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        {activeHover === link.path && !isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50"
                          >
                            {link.description}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {currentUser ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-100"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-700">12</span>
                    <span className="text-xs text-amber-600">day streak</span>
                  </motion.div>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-400">Pro Member</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
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
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
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
