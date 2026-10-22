import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import MyTicketsPage from './pages/MyTicketsPage.jsx';

// Lazy-loaded: this code is only downloaded when someone opens /organizer
const OrganizerPanel = lazy(() => import('./pages/OrganizerPanel.jsx'));

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Suspense fallback={<p className="info">Loading organizer panel...</p>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
            <Route
              path="/organizer"
              element={<ProtectedRoute requiredRole="organizer"><OrganizerPanel /></ProtectedRoute>}
            />
            <Route path="*" element={<p className="info">Page not found.</p>} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
