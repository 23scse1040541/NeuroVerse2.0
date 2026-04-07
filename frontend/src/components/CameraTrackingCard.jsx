import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';

const EMOTIONS = [
  { emotion: 'happy', label: 'Happy', intensity: 7 },
  { emotion: 'sad', label: 'Sad', intensity: 6 },
  { emotion: 'anxious', label: 'Anxious', intensity: 6 },
  { emotion: 'stressed', label: 'Stressed', intensity: 7 },
  { emotion: 'calm', label: 'Calm', intensity: 5 },
  { emotion: 'neutral', label: 'Neutral', intensity: 5 },
];

function CameraTrackingCard({ onComplete, loading }) {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState(null);

  useEffect(() => {
    let stream;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        setError('Camera access blocked. Please enable camera permissions.');
        setHasPermission(false);
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setupCamera();
    } else {
      setError('Camera not supported in this browser.');
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!hasPermission || loading) return;

    setAnalyzing(true);
    setError('');

    // Placeholder: randomly pick an emotion for now.
    // Later you can plug in a real face recognition/emotion model here.
    setTimeout(() => {
      const choice = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      setDetected(choice);

      if (onComplete) {
        onComplete({
          emotion: choice.emotion,
          intensity: choice.intensity,
          note: `Camera-based detection: ${choice.label} (${choice.intensity}/10).`,
          trackingType: 'camera',
          source: 'camera',
          challengeType: 'none',
          helpedBy: [],
        });
      }

      setAnalyzing(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-2xl bg-white/80 shadow-sm p-4 md:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">Camera mode</p>
            <h3 className="text-lg font-semibold text-gray-800">Face-based tracking</h3>
          </div>
        </div>
        <div className="hidden md:inline-flex items-center gap-1 text-xs text-primary/70">
          <Sparkles className="w-3 h-3" />
          <span>Experimental</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] gap-4 items-stretch">
        <div className="relative rounded-2xl overflow-hidden bg-black/5 border border-gray-200 flex items-center justify-center">
          {hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-60 object-cover bg-black/80"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 px-4 text-center text-sm text-gray-500">
              <Camera className="w-8 h-8 mb-2 text-gray-400" />
              <p>{error || 'Waiting for camera permission...'}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Step 1</p>
            <p className="text-sm text-gray-500 mb-3">
              Look into the camera with a neutral face for a few seconds, then tap analyze.
            </p>

            {detected && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-primary/5 border border-primary/30 text-sm text-gray-800 flex items-center justify-between">
                <span>
                  Detected: <span className="font-semibold capitalize">{detected.label}</span>
                </span>
                <span className="text-xs text-gray-600">Intensity {detected.intensity}/10</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || analyzing || !hasPermission}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {analyzing || loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span className="text-sm">Analyze emotion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default CameraTrackingCard;
