import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export const DowngradeButton: React.FC = () => {
  const { user } = useAuth();
  const [downgrading, setDowngrading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user || user.tenant.plan === 'free' || user.role !== 'admin') {
    return null;
  }

  const handleDowngrade = async () => {
    if (!confirm('Are you sure you want to downgrade to Free plan? This will limit you to 3 notes maximum.')) {
      return;
    }

    setDowngrading(true);
    try {
      await api.post(`/tenants/${user.tenant.slug}/downgrade`);
      setSuccess(true);
      
      const updatedUser = { ...user, tenant: { ...user.tenant, plan: 'free' as const } };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Refresh page to update UI
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Downgrade failed');
    } finally {
      setDowngrading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-blue-500/20 border border-blue-500/30 text-blue-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold">Downgrade Successful!</h3>
            <p className="text-sm text-blue-300">You're now on the Free plan with a 3-note limit.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-500/20 border border-gray-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-lg">Pro Plan Active</h3>
            <p className="text-gray-300/80">Currently enjoying unlimited notes. Want to test limits?</p>
          </div>
        </div>
        <button
          onClick={handleDowngrade}
          disabled={downgrading}
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {downgrading ? 'Downgrading...' : 'Downgrade to Free'}
        </button>
      </div>
    </div>
  );
};
