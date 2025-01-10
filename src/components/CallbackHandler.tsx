// src/components/CallbackHandler.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CallbackHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { setAuthState } = useAuth();
  const processedCode = useRef<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          setError('No authorization code received');
          return;
        }

        // Prevent processing the same code multiple times
        if (processedCode.current === code) {
          return;
        }
        processedCode.current = code;

        console.log('Sending code to backend:', code);

        const response = await fetch('http://localhost:8000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Only set error if it's not a duplicate token error
          if (!errorData.detail?.includes('Bad Request')) {
            throw new Error(errorData.detail || 'Login failed');
          }
          return;
        }

        const data = await response.json();
        console.log('Received response:', data);

        if (!data.user || !data.access_token || !data.refresh_token) {
          throw new Error('Invalid response data');
        }

        setAuthState(data.user, {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
        });
        
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error && !error.message.includes('Bad Request')) {
          setError(error.message || 'An unexpected error occurred');
        }
      }
    };

    handleCallback();
  }, [location.search, navigate, setAuthState]);

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p>Processing login...</p>
      </div>
    </div>
  );
};

export default CallbackHandler;