import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLayout from '../layout/PageLayout';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <PageLayout>
      <div className="bg-saasha-cream dark:bg-dark-primary">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-saasha-brown dark:text-dark-text">
                Admin Login
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose focus:z-10 sm:text-sm dark:bg-dark-primary dark:border-gray-600 dark:text-dark-text dark:placeholder-gray-400"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-saasha-rose focus:border-saasha-rose focus:z-10 sm:text-sm dark:bg-dark-primary dark:border-gray-600 dark:text-dark-text dark:placeholder-gray-400"
                    placeholder="Password"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saasha-rose hover:bg-saasha-rose/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saasha-rose"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminLogin;
