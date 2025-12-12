import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Mindfulness from './pages/Mindfulness';
import Specialists from './pages/Specialists';
import Chatbot from './pages/Chatbot';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Games from './pages/Games';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#232121ff',
              color: '#004f7aff',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#76f4c6ff',
                secondary: '#e79797ff',
              },
            },
          }}
        />
        <Routes future={{ v7_relativeSplatPath: true }}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/mood" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
          <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
          <Route path="/mindfulness" element={<PrivateRoute><Mindfulness /></PrivateRoute>} />
          <Route path="/specialists" element={<PrivateRoute><Specialists /></PrivateRoute>} />
          <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
          <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/games" element={<PrivateRoute><Games /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
