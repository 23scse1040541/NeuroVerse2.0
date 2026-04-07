import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, Calendar, MessageCircle, Award, Clock, CheckCircle, CreditCard, X, ChevronRight, Sparkles, Shield, Video, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

// Enhanced specialists data with more details
const SPECIALISTS_DATA = [
  {
    _id: '1',
    title: 'Dr.',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    specialization: ['Anxiety', 'Depression', 'Stress Management'],
    experience: 10,
    rating: 4.9,
    reviews: 127,
    consultationFee: 120,
    bio: 'Board-certified clinical psychologist with expertise in CBT and mindfulness-based therapies. Harvard Medical School graduate with 10+ years helping clients overcome anxiety and depression.',
    education: 'Ph.D. Clinical Psychology, Harvard University',
    languages: ['English', 'Spanish'],
    availability: 'Mon-Fri, 9AM-6PM',
    sessionTypes: ['Video', 'Audio', 'Chat'],
    nextAvailable: 'Today, 3:00 PM'
  },
  {
    _id: '2',
    title: 'Dr.',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    specialization: ['Trauma', 'PTSD', 'Relationship Counseling'],
    experience: 8,
    rating: 4.8,
    reviews: 98,
    consultationFee: 150,
    bio: 'Trauma specialist focused on EMDR therapy and couples counseling. Known for creating safe spaces for healing and relationship growth.',
    education: 'Psy.D. Trauma Psychology, Stanford University',
    languages: ['English', 'Mandarin'],
    availability: 'Tue-Sat, 10AM-8PM',
    sessionTypes: ['Video', 'In-Person'],
    nextAvailable: 'Tomorrow, 10:00 AM'
  },
  {
    _id: '3',
    title: 'Ms.',
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    specialization: ['Mindfulness', 'Meditation', 'Life Coaching'],
    experience: 6,
    rating: 4.9,
    reviews: 156,
    consultationFee: 90,
    bio: 'Certified mindfulness coach and meditation instructor. Helps clients find mental clarity through ancient wisdom and modern techniques.',
    education: 'M.A. Mindfulness Studies, UC Berkeley',
    languages: ['English', 'Portuguese'],
    availability: 'Daily, 7AM-9PM',
    sessionTypes: ['Video', 'Audio', 'Chat'],
    nextAvailable: 'Today, 5:30 PM'
  },
  {
    _id: '4',
    title: 'Dr.',
    name: 'David Williams',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    specialization: ['Addiction', 'Behavioral Therapy', 'Group Therapy'],
    experience: 12,
    rating: 4.7,
    reviews: 203,
    consultationFee: 180,
    bio: 'Addiction medicine specialist with expertise in behavioral change. Leading researcher in recovery programs and sobriety maintenance.',
    education: 'M.D. Addiction Medicine, Johns Hopkins',
    languages: ['English'],
    availability: 'Mon-Thu, 8AM-4PM',
    sessionTypes: ['Video', 'In-Person', 'Group'],
    nextAvailable: 'Wed, 11:00 AM'
  },
  {
    _id: '5',
    title: 'Ms.',
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    specialization: ['Adolescent Therapy', 'Family Counseling', 'ADHD'],
    experience: 7,
    rating: 4.9,
    reviews: 89,
    consultationFee: 110,
    bio: 'Specialized in helping teenagers and families navigate mental health challenges. Creates supportive environments for adolescent growth.',
    education: 'M.S.W. Family Therapy, Columbia University',
    languages: ['English', 'French'],
    availability: 'Wed-Sun, 11AM-7PM',
    sessionTypes: ['Video', 'Audio'],
    nextAvailable: 'Today, 7:00 PM'
  },
  {
    _id: '6',
    title: 'Dr.',
    name: 'James Kumar',
    avatar: 'https://images.unsplash.com/photo-1612531386530-97286d74c2ea?w=200&h=200&fit=crop&crop=face',
    specialization: ['OCD', 'Phobias', 'Panic Disorders'],
    experience: 9,
    rating: 4.8,
    reviews: 134,
    consultationFee: 140,
    bio: 'OCD and anxiety disorder specialist using exposure therapy and ERP techniques. Helping clients reclaim control over their thoughts.',
    education: 'Ph.D. Anxiety Disorders, UCLA',
    languages: ['English', 'Hindi'],
    availability: 'Mon-Fri, 9AM-7PM',
    sessionTypes: ['Video', 'Chat'],
    nextAvailable: 'Tomorrow, 2:00 PM'
  }
];

const Specialists = () => {
  const [specialists, setSpecialists] = useState(SPECIALISTS_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionType, setSessionType] = useState('Video');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // Try to fetch real data, fallback to static
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await axios.get('/api/specialists');
      if (response.data.specialists?.length > 0) {
        setSpecialists(response.data.specialists);
      }
    } catch (error) {
      console.log('Using static specialists data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (specialist) => {
    setSelectedSpecialist(specialist);
    setBookingStep(1);
    setSelectedSlot(null);
  };

  const handleCloseBooking = () => {
    setBookingStep(0);
    setSelectedSpecialist(null);
    setSelectedSlot(null);
    setPaymentProcessing(false);
  };

  const handleProceedToPayment = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setBookingStep(3);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentProcessing(false);
    setBookingStep(4);
    toast.success('Booking confirmed! Check your email for details.');
  };

  // Generate mock time slots
  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const times = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];
      times.forEach(time => {
        slots.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          time,
          available: Math.random() > 0.3
        });
      });
    }
    return slots;
  };

  const displaySpecialists = specialists;
  const timeSlots = generateTimeSlots();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
                <Users className="w-8 h-8 mr-3 text-cyan-400" />
                Connect with Experts
              </h1>
              <p className="text-white/60">
                Book sessions with certified mental health professionals
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-cyan-400 bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <Shield className="w-4 h-4" />
              <span>All specialists verified</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Verified Experts', value: '50+', icon: Shield },
            { label: 'Happy Clients', value: '10K+', icon: Users },
            { label: 'Avg. Rating', value: '4.8/5', icon: Star },
            { label: 'Sessions Today', value: '200+', icon: Calendar },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Specialists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySpecialists.map((specialist, index) => (
            <motion.div
              key={specialist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:border-cyan-400/40 transition-all duration-300"
            >
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={specialist.avatar}
                    alt={specialist.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-slate-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {specialist.title} {specialist.name}
                  </h3>
                  <p className="text-sm text-white/50">{specialist.education}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-white">{specialist.rating}</span>
                    <span className="text-white/40 text-sm">({specialist.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {specialist.specialization.map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-400/20">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>{specialist.experience} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Next available: {specialist.nextAvailable}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MessageCircle className="w-4 h-4" />
                  <span>{specialist.languages.join(', ')}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-white/70 mb-4 line-clamp-2">{specialist.bio}</p>

              {/* Session Types */}
              <div className="flex gap-2 mb-4">
                {specialist.sessionTypes.map(type => (
                  <span key={type} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-xs text-white/60">
                    {type === 'Video' && <Video className="w-3 h-3" />}
                    {type === 'Audio' && <Phone className="w-3 h-3" />}
                    {type === 'Chat' && <MessageCircle className="w-3 h-3" />}
                    {type}
                  </span>
                ))}
              </div>

              {/* Fee and Book Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/40">Starting from</p>
                  <p className="text-2xl font-bold text-white">${specialist.consultationFee}</p>
                </div>
                <button 
                  onClick={() => handleBookClick(specialist)}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors flex items-center gap-2"
                >
                  Book Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emergency Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl p-8 border border-red-400/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Need Immediate Help?</h3>
              <p className="text-white/60">If you are in crisis, please contact emergency services immediately</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                Emergency: 112
              </button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Crisis Line: 108
              </button>
            </div>
          </div>
        </motion.div>

        {/* Booking Modal */}
        <AnimatePresence>
          {bookingStep > 0 && selectedSpecialist && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative max-w-2xl w-full max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedSpecialist.avatar}
                      alt={selectedSpecialist.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedSpecialist.title} {selectedSpecialist.name}
                      </h3>
                      <p className="text-sm text-cyan-400">${selectedSpecialist.consultationFee}/session</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseBooking}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Select Session Type</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {['Video', 'Audio', 'Chat'].map(type => (
                            <button
                              key={type}
                              onClick={() => setSessionType(type)}
                              className={`p-4 rounded-xl border transition-all ${
                                sessionType === type
                                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                              }`}
                            >
                              {type === 'Video' && <Video className="w-5 h-5 mx-auto mb-2" />}
                              {type === 'Audio' && <Phone className="w-5 h-5 mx-auto mb-2" />}
                              {type === 'Chat' && <MessageCircle className="w-5 h-5 mx-auto mb-2" />}
                              <span className="text-sm">{type}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Available Time Slots</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.slice(0, 10).map((slot, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSlot(slot)}
                              disabled={!slot.available}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                selectedSlot === slot
                                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                                  : slot.available
                                    ? 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                                    : 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                              }`}
                            >
                              <p className="text-sm font-medium">{slot.date}</p>
                              <p className="text-xs text-white/50">{slot.time}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-lg font-bold text-white mb-4">Booking Summary</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Specialist</span>
                            <span className="text-white">{selectedSpecialist.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Session Type</span>
                            <span className="text-white">{sessionType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Date & Time</span>
                            <span className="text-white">{selectedSlot?.date}, {selectedSlot?.time}</span>
                          </div>
                          <div className="border-t border-white/10 pt-3 flex justify-between">
                            <span className="text-white/60">Total Amount</span>
                            <span className="text-xl font-bold text-cyan-400">${selectedSpecialist.consultationFee}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Payment Method (Demo)</h4>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">Demo Payment</p>
                              <p className="text-xs text-white/50">No real transaction will occur</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {bookingStep === 4 && (
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <h4 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h4>
                      <p className="text-white/60 mb-6">Your session has been scheduled successfully</p>
                      <div className="bg-white/5 rounded-xl p-4 text-left max-w-sm mx-auto">
                        <p className="text-sm text-white/60 mb-1">Session Details</p>
                        <p className="text-white font-medium">{selectedSpecialist.name}</p>
                        <p className="text-cyan-400">{selectedSlot?.date}, {selectedSlot?.time}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                {bookingStep < 4 && (
                  <div className="flex items-center justify-between p-6 border-t border-white/10">
                    <button
                      onClick={() => bookingStep > 1 && setBookingStep(bookingStep - 1)}
                      className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                    >
                      {bookingStep > 1 ? 'Back' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => {
                        if (bookingStep === 1) handleProceedToPayment();
                        else if (bookingStep === 3) handlePayment();
                      }}
                      disabled={bookingStep === 1 && !selectedSlot}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                        (bookingStep === 1 && !selectedSlot) || paymentProcessing
                          ? 'bg-white/10 text-white/40 cursor-not-allowed'
                          : 'bg-cyan-500 text-white hover:bg-cyan-600'
                      }`}
                    >
                      {paymentProcessing ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Processing...
                        </span>
                      ) : bookingStep === 1 ? (
                        'Continue to Payment'
                      ) : (
                        'Pay & Confirm'
                      )}
                    </button>
                  </div>
                )}

                {bookingStep === 4 && (
                  <div className="p-6 border-t border-white/10">
                    <button
                      onClick={handleCloseBooking}
                      className="w-full px-8 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Specialists;
