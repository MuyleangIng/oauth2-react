import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CallbackHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the full search string including query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          setError('No authorization code received');
          return;
        }

        console.log('Received code:', code); // Debug log

        const response = await fetch('http://localhost:8000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        const userData = await response.json();
        console.log('Received user data:', userData); // Debug log

        if (!userData.id || !userData.email || !userData.name) {
          throw new Error('Invalid user data received');
        }

        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Login error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [location.search, navigate]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Processing login...</p>
      </div>
    </div>
  );
};

export default CallbackHandler;