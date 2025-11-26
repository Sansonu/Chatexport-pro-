import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { AuthState } from './types';
import { AuthService } from './services/mockFirebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: false
  });

  const handleNavigate = (page: string) => {
    if (page === 'dashboard' || page === 'settings') {
      if (!auth.user) {
        // Simulate auth flow for demo
        handleLogin();
        return;
      }
    }
    setCurrentPage(page);
  };

  const handleLogin = async () => {
    setAuth(prev => ({ ...prev, loading: true }));
    try {
      const user = await AuthService.login();
      setAuth({ user, loading: false });
      setCurrentPage('dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setAuth(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setAuth({ user: null, loading: false });
    setCurrentPage('landing');
  };

  // Simple Router Switch
  const renderPage = () => {
    if (auth.loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Authenticating...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <Landing onStart={() => handleNavigate('dashboard')} />;
      case 'dashboard':
        return auth.user ? <Dashboard user={auth.user} /> : null;
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-slate-500">User preferences would go here (Auto-delete toggle, Default format selection).</p>
            <button onClick={() => setCurrentPage('dashboard')} className="mt-4 text-blue-600 hover:underline">Back to Dashboard</button>
          </div>
        );
      case 'login':
          // Login is handled by handleLogin directly for this demo, usually would be a form
          return null;
      default:
        return <Landing onStart={() => handleNavigate('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!auth.loading && (
        <Navbar 
          user={auth.user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      {!auth.loading && (
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ChatExport Pro. All rights reserved.</p>
            <p className="mt-2">Simulating Firebase Backend Architecture</p>
          </div>
        </footer>
      )}
    </div>
  );
}