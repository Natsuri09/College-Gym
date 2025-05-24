'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  type: 'login' | 'register';
  role?: string;
};

export default function AuthForm({ type, role }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = type === 'login' ? '/api/register/login' : '/api/register';

    const body =
      type === 'login'
        ? { emailOrUsername: formData.username, password: formData.password }
        : { ...formData, role: role || 'GymMember' };

    try {
      console.log('Sending request to:', endpoint);
      console.log('Request body:', body);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        setError(data.error || data.message || 'An error occurred');
        return;
      }

      if (type === 'login') {
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        // Save user data if needed
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to home page
        router.push('/home');
        router.refresh(); // Force a refresh to update the UI
      } else {
        // For registration, redirect to login page
        router.push('/gymmember/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error-message">{error}</div>}
      {type === 'register' && (
        <>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </>
      )}
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        disabled={loading}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Register'}
      </button>

      <style jsx>{`
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }
        input, button {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          background-color: #0070f3;
          color: white;
          cursor: pointer;
        }
        button:hover:not(:disabled) {
          background-color: #0051c3;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .error-message {
          color: #dc3545;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          text-align: center;
        }
      `}</style>
    </form>
  );
}