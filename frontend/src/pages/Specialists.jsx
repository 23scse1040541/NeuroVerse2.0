import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Star, Calendar, MessageCircle, Award } from 'lucide-react';

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialists');
      setSpecialists(response.data.specialists);
    } catch (error) {
      console.error('Error fetching specialists:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample specialists data (since backend might not have data yet)
  const sampleSpecialists = [
    {
      _id: '1',
      title: 'Dr.',
      user: { name: 'Sarah Johnson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=8EC5FC&color=fff' },
      specialization: ['Anxiety', 'Depression', 'Stress Management'],
      experience: 10,
      rating: 4.8,
      consultationFee: 100,
      bio: 'Experienced clinical psychologist specializing in anxiety and depression treatment with CBT approach.'
    },
    {
      _id: '2',
      title: 'Dr.',
      user: { name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=E0C3FC&color=fff' },
      specialization: ['Trauma', 'PTSD', 'Relationship Counseling'],
      experience: 8,
      rating: 4.9,
      consultationFee: 120,
      bio: 'Specialized in trauma recovery and relationship counseling using evidence-based therapies.'
    },
    {
      _id: '3',
      title: 'Ms.',
      user: { name: 'Emily Rodriguez', avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=A8E6CF&color=fff' },
      specialization: ['Mindfulness', 'Meditation', 'Life Coaching'],
      experience: 6,
      rating: 4.7,
      consultationFee: 80,
      bio: 'Certified mindfulness coach and therapist helping clients achieve mental clarity and balance.'
    },
    {
      _id: '4',
      title: 'Dr.',
      user: { name: 'David Williams', avatar: 'https://ui-avatars.com/api/?name=David+Williams&background=FFD3B6&color=fff' },
      specialization: ['Addiction', 'Behavioral Therapy', 'Group Therapy'],
      experience: 12,
      rating: 4.9,
      consultationFee: 150,
      bio: 'Expert in addiction recovery and behavioral change with over a decade of experience.'
    },
    {
      _id: '5',
      title: 'Ms.',
      user: { name: 'Lisa Anderson', avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=B4E7FF&color=fff' },
      specialization: ['Adolescent Therapy', 'Family Counseling'],
      experience: 7,
      rating: 4.8,
      consultationFee: 90,
      bio: 'Passionate about helping teenagers and families navigate mental health challenges together.'
    },
    {
      _id: '6',
      title: 'Dr.',
      user: { name: 'James Kumar', avatar: 'https://ui-avatars.com/api/?name=James+Kumar&background=DDA0DD&color=fff' },
      specialization: ['OCD', 'Phobias', 'Panic Disorders'],
      experience: 9,
      rating: 4.9,
      consultationFee: 110,
      bio: 'Specialized in treating OCD and anxiety disorders with exposure therapy and cognitive techniques.'
    }
  ];

  const displaySpecialists = specialists.length > 0 ? specialists : sampleSpecialists;

  if (loading && specialists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="neuro-cosmic-grid w-full h-full" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center">
            <Users className="w-10 h-10 mr-3" />
            Connect with Specialists
          </h1>
          <p className="text-gray-600">Find certified mental health professionals to support your journey</p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card neuro-hologram-hover mb-8 bg-gradient-to-r from-primary/10 to-purple-100/50 border-2 border-primary/20"
        >
          <div className="flex items-start space-x-4">
            <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2">All specialists are verified and certified</h3>
              <p className="text-gray-700">Every mental health professional on our platform has been carefully vetted and holds valid certifications in their specialization areas.</p>
            </div>
          </div>
        </motion.div>

        {/* Specialists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySpecialists.map((specialist, index) => (
            <motion.div
              key={specialist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card neuro-hologram-hover group hover:shadow-2xl transition-all"
            >
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={specialist.user?.avatar}
                  alt={specialist.user?.name}
                  className="w-20 h-20 rounded-full border-4 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {specialist.title} {specialist.user?.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold text-gray-700">{specialist.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({specialist.experience} years exp.)</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {specialist.specialization?.slice(0, 3).map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{specialist.bio}</p>

              {/* Fee and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="text-2xl font-bold text-primary">rs{specialist.consultationFee}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card neuro-hologram-hover mt-8 text-center"
        >
          <h3 className="text-xl font-bold mb-3">Need Immediate Help?</h3>
          <p className="text-gray-600 mb-4">If you're in crisis or need urgent support, please contact emergency services or a crisis hotline.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
              Emergency: 112
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Crisis Hotline: 108
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Specialists;
