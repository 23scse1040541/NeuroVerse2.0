import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
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

// Import styles
import './styles/auth.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {}
          }}
        />
        <Routes>
          <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
          <Route path="/login" element={!currentUser ? <ErrorBoundary><Login /></ErrorBoundary> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!currentUser ? <ErrorBoundary><Signup /></ErrorBoundary> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <ErrorBoundary><Dashboard /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/mood-tracker" element={
            <PrivateRoute>
              <ErrorBoundary><MoodTracker /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/journal" element={
            <PrivateRoute>
              <ErrorBoundary><Journal /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/goals" element={
            <PrivateRoute>
              <ErrorBoundary><Goals /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/mindfulness" element={
            <PrivateRoute>
              <ErrorBoundary><Mindfulness /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/specialists" element={
            <PrivateRoute>
              <ErrorBoundary><Specialists /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/chatbot" element={
            <PrivateRoute>
              <ErrorBoundary><Chatbot /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/feedback" element={
            <PrivateRoute>
              <ErrorBoundary><Feedback /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ErrorBoundary><Profile /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="/games" element={
            <PrivateRoute>
              <ErrorBoundary><Games /></ErrorBoundary>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
 
export default App;
