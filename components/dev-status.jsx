'use client';

import { useEffect, useState } from 'react';

export default function DevStatus() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // 只在开发环境显示
    if (process.env.NODE_ENV === 'development') {
      setShowStatus(true);
      checkDatabaseStatus();
    }
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setDbStatus('connected');
        console.log('✅ Database Status:', data.message);
      } else {
        setDbStatus('error');
        console.error('❌ Database connection check failed');
      }
    } catch (error) {
      setDbStatus('error');
      console.error('❌ Database connection error:', error);
    }
  };

  if (!showStatus) return null;

  return (
    <div className="fixed top-0 right-0 z-50 m-1">
      <div className={`px-3  rounded-full text-xs font-medium ${
        dbStatus === 'connected' 
          ? 'bg-green-100 text-green-800 border border-green-200'
          : dbStatus === 'error'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}>
        {dbStatus === 'connected' && '🟢 Database Connected'}
        {dbStatus === 'error' && '🔴 Database Connection Failed'}
        {dbStatus === 'checking' && '🟡 Checking Database Connection...'}
      </div>
    </div>
  );
}