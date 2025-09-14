import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export const UpgradePrompt: React.FC = () => {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user || user.tenant.plan === 'pro' || user.role !== 'admin') {
    return null;
  }

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await api.post(`/tenants/${user.tenant.slug}/upgrade`);
      setSuccess(true);
      
      const updatedUser = { ...user, tenant: { ...user.tenant, plan: 'pro' as const } };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold">Upgrade Successful!</h3>
            <p className="text-sm text-green-300">You can now create unlimited notes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-200 text-lg">Upgrade to Pro</h3>
            <p className="text-yellow-300/80">You've reached the 3-note limit. Upgrade for unlimited notes!</p>
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {upgrading ? 'Upgrading...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
};
