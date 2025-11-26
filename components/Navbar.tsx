import React from 'react';
import { FileText, LogOut, Settings, User } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPage }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">ChatExport Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <User size={16} />
                  <span>{user.email}</span>
                  <span className="ml-1 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                    {user.subscription}
                  </span>
                </div>
                
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-medium transition-colors ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Dashboard
                </button>

                <button 
                  onClick={() => onNavigate('settings')}
                  className={`p-2 rounded-full transition-colors ${currentPage === 'settings' ? 'bg-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => onNavigate('login')}
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onNavigate('login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};