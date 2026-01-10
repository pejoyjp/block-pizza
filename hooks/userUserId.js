import { useState, useEffect } from 'react';
import useSWR from 'swr';

const useUserId = () => {
  const [userId, setUserId] = useState(null);
  
  const { data, error, mutate } = useSWR('/api/auth/me', async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    const result = await response.json();
    return result;
  });

  useEffect(() => {
    if (data && data.success && data.user) {
      setUserId(data.user.id);
    } else if (error) {
      setUserId(null);
    }
  }, [data, error]);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      if (result.success) {
        setUserId(result.userId);
        mutate(); // Refresh auth state
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUserId(null);
      mutate(); // Refresh auth state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { userId, setUserId, login, logout, isAuthenticated: !!userId };
};

export default useUserId;
