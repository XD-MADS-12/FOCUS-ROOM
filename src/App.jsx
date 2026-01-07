import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={!session ? <AuthPage /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/auth/callback" 
          element={<AuthCallback />} 
        />
        <Route 
          path="/*" 
          element={session ? <HomePage session={session} /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
