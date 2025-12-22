import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
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

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {}
        }}
      />
      <Outlet />
    </div>
  );
}

function RedirectIfAuthenticated({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" />;
}

function AppContent() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <ErrorBoundary><HomePage /></ErrorBoundary> },
          {
            path: 'login',
            element: (
              <RedirectIfAuthenticated>
                <ErrorBoundary><Login /></ErrorBoundary>
              </RedirectIfAuthenticated>
            )
          },
          {
            path: 'signup',
            element: (
              <RedirectIfAuthenticated>
                <ErrorBoundary><Signup /></ErrorBoundary>
              </RedirectIfAuthenticated>
            )
          },
          {
            path: 'dashboard',
            element: <PrivateRoute><ErrorBoundary><Dashboard /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'mood-tracker',
            element: <PrivateRoute><ErrorBoundary><MoodTracker /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'journal',
            element: <PrivateRoute><ErrorBoundary><Journal /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'goals',
            element: <PrivateRoute><ErrorBoundary><Goals /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'mindfulness',
            element: <PrivateRoute><ErrorBoundary><Mindfulness /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'specialists',
            element: <PrivateRoute><ErrorBoundary><Specialists /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'chatbot',
            element: <PrivateRoute><ErrorBoundary><Chatbot /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'feedback',
            element: <PrivateRoute><ErrorBoundary><Feedback /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'profile',
            element: <PrivateRoute><ErrorBoundary><Profile /></ErrorBoundary></PrivateRoute>
          },
          {
            path: 'games',
            element: <PrivateRoute><ErrorBoundary><Games /></ErrorBoundary></PrivateRoute>
          },
          { path: '*', element: <Navigate to="/" /> }
        ]
      }
    ],
    {
      future: {
        v7_relativeSplatPath: true
      }
    }
  );

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
 
export default App;
