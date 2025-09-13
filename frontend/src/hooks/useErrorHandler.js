import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    console.error('API Error:', err);
    const message = err.response?.data?.error || err.message || 'An error occurred';
    setError(message);
    setLoading(false);
  };

  const clearError = () => setError('');

  const executeAsync = async (asyncFn) => {
    try {
      setLoading(true);
      setError('');
      const result = await asyncFn();
      setLoading(false);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  return { error, loading, handleError, clearError, executeAsync };
};