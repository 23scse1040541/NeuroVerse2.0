import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Play, Square, RefreshCw, Brain, Activity, Sparkles,
  Heart, Zap, AlertCircle, CheckCircle, XCircle, ChevronRight,
  Shield, Lock, Eye, BarChart3, Smile, Frown, Meh
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                AI-Powered
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  Wellness Tracking
                </span>
              </h1>
              <p className="text-gray-500">Real-time biometric analysis using computer vision</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Privacy Protected</span>
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy First</h2>
                  <p className="text-gray-500">
                    Your video is processed locally on your device. No data is sent to our servers.
                  </p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Local Processing</p>
                      <p className="text-sm text-gray-500">AI runs entirely in your browser</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">No Video Storage</p>
                      <p className="text-sm text-gray-500">We never record or store your video</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Encrypted Connection</p>
                      <p className="text-sm text-gray-500">Secure HTTPS connection only</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="flex-1 px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={startCamera}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
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
            <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
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
                            borderColor: ['rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 1)', 'rgba(99, 102, 241, 0.5)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 rounded-2xl"
                        />
                        
                        {/* Tracking points */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-white text-xs font-medium">Tracking Active</span>
                        </div>

                        {/* Session timer */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                          <span className="text-white font-mono text-lg">{formatTime(sessionTime)}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Camera Access Required</p>
                    <p className="text-sm opacity-70 mt-2">Enable camera to start AI tracking</p>
                    <button
                      onClick={startCamera}
                      className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
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
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
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
                        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
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
                  className={`p-4 rounded-2xl flex items-start gap-3 ${
                    currentInsight.type === 'positive' ? 'bg-emerald-50 border border-emerald-200' :
                    currentInsight.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentInsight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                    currentInsight.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <currentInsight.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{currentInsight.message}</p>
                    <p className="text-sm text-gray-500 mt-1">Real-time AI analysis</p>
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Live Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="text-sm text-gray-600">Heart Rate</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {trackingData.heartRate || '--'}
                    </span>
                    <span className="text-sm text-gray-500">BPM</span>
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
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-gray-600">Stress Level</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {trackingData.stressLevel || '--'}
                    </span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  {trackingData.stressLevel !== null && (
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trackingData.stressLevel}%` }}
                        className={`h-full rounded-full ${getStressColor(trackingData.stressLevel)}`}
                      />
                    </div>
                  )}
                </div>

                {/* Emotion */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Emotion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {trackingData.emotion ? (
                      <>
                        {getEmotionIcon(trackingData.emotion)}
                        <span className="text-lg font-bold text-gray-900 capitalize">
                          {trackingData.emotion}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg text-gray-400">--</span>
                    )}
                  </div>
                </div>

                {/* Focus Score */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-600">Focus Score</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {trackingData.focusScore || '--'}
                    </span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                  {trackingData.focusScore !== null && (
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trackingData.focusScore}%` }}
                        className="h-full rounded-full bg-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Session Summary */}
            {analysisHistory.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Stress: {session.averageMetrics.stressLevel}%
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {session.averageMetrics.emotion}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
              <div className="space-y-3">
                {[
                  { icon: Heart, text: 'Heart rate estimation from facial color changes', color: 'text-rose-600' },
                  { icon: Sparkles, text: 'Emotion detection using facial landmarks', color: 'text-purple-600' },
                  { icon: Brain, text: 'Focus analysis via eye tracking patterns', color: 'text-indigo-600' },
                  { icon: Zap, text: 'Stress level from micro-expressions', color: 'text-amber-600' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 bg-white rounded-lg ${feature.color}`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-600">{feature.text}</p>
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
