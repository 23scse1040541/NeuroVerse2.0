import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Heart, BookOpen, Target, Sparkles, Users, TrendingUp, Shield, Zap, Star, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Monitor your emotions daily with intuitive tracking and beautiful visualizations.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: 'Digital Journal',
      description: 'Express your thoughts and feelings in a safe, private digital space.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set wellness goals and track your progress with motivational streaks.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'Mindfulness Tools',
      description: 'Access meditation guides, breathing exercises, and relaxation techniques.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: TrendingUp,
      title: 'Data Insights',
      description: 'Visualize your mental health journey with interactive charts and analytics.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Users,
      title: 'Connect with Specialists',
      description: 'Consult with certified mental health professionals when you need support.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Software Developer',
      content: 'Neuro Verse helped me understand my stress patterns. The mood tracking is incredibly insightful!',
      rating: 5
    },
    {
      name: 'Michael R.',
      role: 'College Student',
      content: 'The journaling feature is therapeutic. I love how I can track my mental wellness journey.',
      rating: 5
    },
    {
      name: 'Emily K.',
      role: 'Teacher',
      content: 'The mindfulness exercises have become part of my daily routine. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Cosmic grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="neuro-cosmic-grid w-full h-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-7xl mx-auto text-center z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="neuro-node-orbit p-5">
              <Brain className="w-16 h-16 text-primary drop-shadow-[0_0_30px_rgba(56,189,248,0.9)] animate-float" />
              <span className="neuro-node-orbit-dot neuro-node-orbit-dot--top" />
              <span className="neuro-node-orbit-dot neuro-node-orbit-dot--bottom" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Neuro Verse</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-slate-100 mb-4 font-medium">
            Understand Yourself, Heal Yourself
          </p>
          
          <p className="text-lg text-slate-300/80 mb-10 max-w-2xl mx-auto">
            Your personal mental health companion powered by modern technology. 
            Track moods, journal thoughts, practice mindfulness, and connect with professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group btn-primary inline-flex items-center justify-center space-x-2 shadow-2xl"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary inline-flex items-center justify-center backdrop-blur-sm"
            >
              Login to Continue
            </Link>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-cyan-400/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-purple-500/25 rounded-full blur-3xl animate-pulse-slow" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-slate-100">Comprehensive Mental Wellness Features</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Everything you need to monitor, track, and improve your mental well-being in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="card group cursor-pointer neuro-hologram-hover"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-slate-100">Why Choose Neuro Verse?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Private & Secure', desc: 'Your data is encrypted and completely private' },
              { icon: Zap, title: 'Easy to Use', desc: 'Intuitive interface designed for daily use' },
              { icon: Brain, title: 'Science-Based', desc: 'Built on proven mental health principles' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center neuro-glass-panel neuro-hologram-hover px-6 py-8"
                >
                  <div className="neuro-glass-panel-inner">
                    <div className="w-20 h-20 mx-auto mb-4 bg-slate-900/60 rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-50">{item.title}</h3>
                    <p className="text-slate-300 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-slate-100">What Our Users Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card neuro-hologram-hover"
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users taking control of their mental health with Neuro Verse
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">Neuro Verse</span>
            </div>
            <p className="text-gray-400 text-sm">
              A mental health monitoring system built to promote emotional awareness and self-care through technology.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Mood Tracker</li>
              <li>Digital Journal</li>
              <li>Mindfulness</li>
              <li>Connect with Specialists</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>support@neuroverse.ai</li>
              <li>+91-XXXXXXXXXX</li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2025 Neuro Verse. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
