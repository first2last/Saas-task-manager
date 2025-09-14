import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NoteForm } from '../components/NoteForm';
import { NotesList } from '../components/NotesList';
import { UpgradePrompt } from '../components/UpgradePrompt';
import { DowngradeButton } from '../components/DowngradeButton';
import api from '../api';

export const NotesPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchNoteCount();
  }, [refreshTrigger]);

  const fetchNoteCount = async () => {
    try {
      const response = await api.get('/notes');
      const count = response.data.length;

      if (user?.tenant.plan === 'free' && count >= 3) {
        setShowUpgrade(true);
      } else {
        setShowUpgrade(false);
      }
    } catch (error) {
      console.error('Failed to fetch note count:', error);
    }
  };

  const handleNoteCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SaaS Notes</h1>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <span>{user?.tenant.name}</span>
                  <span>•</span>
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {user?.role}
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user?.tenant.plan === 'pro' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {user?.tenant.plan} plan
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {showUpgrade && <UpgradePrompt />}
        {user?.tenant.plan === 'pro' && <DowngradeButton />}
        <NoteForm onNoteCreated={handleNoteCreated} />
        <NotesList refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
};
