import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Play, Square, RefreshCw, Brain, Activity, Sparkles,
  Heart, Zap, AlertCircle, CheckCircle, XCircle, ChevronRight,
  Shield, Lock, Eye, BarChart3, Smile, Frown, Meh, ScanFace,
  Timer, TrendingUp, BrainCircuit, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const AIAdvancedTracking = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [trackingData, setTrackingData] = useState({
    heartRate: null,
    stressLevel: null,
    emotion: null,
    focusScore: null,
    posture: null,
    eyeContact: null
  });
  const [sessionTime, setSessionTime] = useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentInsight, setCurrentInsight] = useState(null);

  // Mock AI analysis functions
  const analyzeFrame = useCallback(() => {
    // Simulated AI analysis - in production, this would use TensorFlow.js models
    const emotions = ['happy', 'calm', 'focused', 'tired', 'stressed'];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    const newData = {
      heartRate: 60 + Math.floor(Math.random() * 30),
      stressLevel: Math.floor(Math.random() * 100),
      emotion: emotion,
      focusScore: 50 + Math.floor(Math.random() * 50),
      posture: Math.random() > 0.3 ? 'Good' : 'Adjust',
      eyeContact: Math.random() > 0.2 ? 'Engaged' : 'Looking away'
    };

    setTrackingData(newData);
    
    // Generate insights based on data
    if (newData.stressLevel > 70) {
      setCurrentInsight({
        type: 'warning',
        message: 'High stress detected. Try taking deep breaths.',
        icon: AlertCircle
      });
    } else if (newData.focusScore < 60) {
      setCurrentInsight({
        type: 'tip',
        message: 'Focus dropping. Consider a short break.',
        icon: Brain
      });
    } else if (newData.emotion === 'happy' || newData.emotion === 'calm') {
      setCurrentInsight({
        type: 'positive',
        message: 'Great emotional state! Keep it up.',
        icon: Smile
      });
    }
  }, []);

  // Camera setup
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermission('granted');
      setShowPrivacyModal(false);
      toast.success('Camera access granted. AI tracking ready.');
    } catch (err) {
      console.error('Camera error:', err);
      setCameraPermission('denied');
      toast.error('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsTracking(false);
    setSessionTime(0);
  };

  const toggleTracking = () => {
    if (!isTracking) {
      setIsTracking(true);
      toast.success('AI tracking started. Analyzing your wellness metrics...');
    } else {
      setIsTracking(false);
      // Save session data
      const sessionData = {
        timestamp: new Date(),
        duration: sessionTime,
        averageMetrics: trackingData,
        insights: currentInsight
      };
      setAnalysisHistory(prev => [sessionData, ...prev].slice(0, 10));
      toast.success(`Session saved! Tracked for ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s`);
    }
  };

  // Timer and analysis loop
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setSessionTime(t => t + 1);
        analyzeFrame();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, analyzeFrame]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'happy': return <Smile className="w-6 h-6 text-emerald-500" />;
      case 'stressed': return <AlertCircle className="w-6 h-6 text-rose-500" />;
      case 'tired': return <Frown className="w-6 h-6 text-amber-500" />;
      default: return <Meh className="w-6 h-6 text-blue-500" />;
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'happy': return 'bg-emerald-100 text-emerald-700';
      case 'stressed': return 'bg-rose-100 text-rose-700';
      case 'tired': return 'bg-amber-100 text-amber-700';
      case 'focused': return 'bg-indigo-100 text-indigo-700';
      case 'calm': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStressColor = (level) => {
    if (level < 30) return 'bg-emerald-500';
    if (level < 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <ScanFace className="w-8 h-8 text-cyan-400" />
                AI Camera Tracking
              </h1>
              <p className="text-white/60">Real-time biometric analysis using computer vision technology</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Privacy Protected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Modal */}
        <AnimatePresence>
          {showPrivacyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-400/30">
                    <Lock className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Privacy First</h2>
                  <p className="text-white/60">
                    Your video is processed locally on your device. No data is sent to our servers.
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    { icon: CheckCircle, title: 'Local Processing', desc: 'AI runs entirely in your browser' },
                    { icon: Eye, title: 'No Video Storage', desc: 'We never record or store your video' },
                    { icon: Shield, title: 'Encrypted Connection', desc: 'Secure HTTPS connection only' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-sm text-white/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="flex-1 px-6 py-3 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={startCamera}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    Enable Camera
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* Video Feed */}
              <div className="aspect-video relative">
                {cameraPermission === 'granted' ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Tracking Overlay */}
                    {isTracking && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Face detection frame simulation */}
                        <motion.div
                          animate={{ 
                            borderColor: ['rgba(6, 182, 212, 0.5)', 'rgba(6, 182, 212, 1)', 'rgba(6, 182, 212, 0.5)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 rounded-2xl"
                        />
                        
                        {/* Tracking points */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/30">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-white text-xs font-medium">Tracking Active</span>
                        </div>

                        {/* Session timer */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                          <span className="text-white font-mono text-lg">{formatTime(sessionTime)}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-lg font-medium">Camera Access Required</p>
                    <p className="text-sm text-white/50 mt-2">Enable camera to start AI tracking</p>
                    <button
                      onClick={startCamera}
                      className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-medium transition-colors"
                    >
                      Allow Camera Access
                    </button>
                  </div>
                )}
              </div>

              {/* Control Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-center gap-4">
                  {cameraPermission === 'granted' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTracking}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                          isTracking
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'bg-cyan-500 text-white hover:bg-cyan-600'
                        }`}
                      >
                        {isTracking ? (
                          <>
                            <Square className="w-5 h-5" />
                            Stop Tracking
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Tracking
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={stopCamera}
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Current Insight */}
            <AnimatePresence mode="wait">
              {currentInsight && isTracking && (
                <motion.div
                  key={currentInsight.message}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 rounded-2xl flex items-start gap-3 border ${
                    currentInsight.type === 'positive' ? 'bg-emerald-500/10 border-emerald-400/30' :
                    currentInsight.type === 'warning' ? 'bg-amber-500/10 border-amber-400/30' :
                    'bg-cyan-500/10 border-cyan-400/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentInsight.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
                    currentInsight.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <currentInsight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{currentInsight.message}</p>
                    <p className="text-sm text-white/50 mt-1">Real-time AI analysis</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Metrics Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Live Metrics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Live Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span className="text-sm text-white/60">Heart Rate</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {trackingData.heartRate || '--'}
                    </span>
                    <span className="text-sm text-white/40">BPM</span>
                  </div>
                  {isTracking && trackingData.heartRate && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                          className="w-1 bg-rose-400 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Stress Level */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-white/60">Stress Level</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {trackingData.stressLevel || '--'}
                    </span>
                    <span className="text-sm text-white/40">%</span>
                  </div>
                  {trackingData.stressLevel !== null && (
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trackingData.stressLevel}%` }}
                        className={`h-full rounded-full ${getStressColor(trackingData.stressLevel)}`}
                      />
                    </div>
                  )}
                </div>

                {/* Emotion */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white/60">Emotion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {trackingData.emotion ? (
                      <>
                        {getEmotionIcon(trackingData.emotion)}
                        <span className="text-lg font-bold text-white capitalize">
                          {trackingData.emotion}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg text-white/40">--</span>
                    )}
                  </div>
                </div>

                {/* Focus Score */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white/60">Focus Score</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {trackingData.focusScore || '--'}
                    </span>
                    <span className="text-sm text-white/40">/100</span>
                  </div>
                  {trackingData.focusScore !== null && (
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trackingData.focusScore}%` }}
                        className="h-full rounded-full bg-cyan-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Session Summary */}
            {analysisHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-white/50">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            Stress: {session.averageMetrics.stressLevel}%
                          </p>
                          <p className="text-xs text-white/50 capitalize">
                            {session.averageMetrics.emotion}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Info */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-400/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                AI Features
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Heart, text: 'Heart rate estimation from facial color changes', color: 'text-rose-400' },
                  { icon: Sparkles, text: 'Emotion detection using facial landmarks', color: 'text-purple-400' },
                  { icon: Brain, text: 'Focus analysis via eye tracking patterns', color: 'text-cyan-400' },
                  { icon: Zap, text: 'Stress level from micro-expressions', color: 'text-amber-400' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 bg-white/10 rounded-lg ${feature.color} border border-white/10`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-white/70">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvancedTracking;
