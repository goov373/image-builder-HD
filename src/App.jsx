import { useState, useEffect } from 'react';
import CarouselDesignTool from './CarouselDesignTool';
import LoginPage from './components/LoginPage';
import useAuth from './hooks/useAuth';

function App() {
  const { user, loading, error, signIn, signOut, isAuthenticated, isConfigured } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  // If Supabase not configured, run in local mode (no auth required)
  // This allows development without setting up Supabase
  if (!isConfigured) {
    return <CarouselDesignTool onSignOut={null} user={null} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={signIn} 
        error={error} 
        loading={loading} 
      />
    );
  }

  // Show main app
  return <CarouselDesignTool onSignOut={signOut} user={user} />;
}

export default App;
