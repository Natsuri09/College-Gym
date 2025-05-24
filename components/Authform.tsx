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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = type === 'login' ? '/api/register/login' : '/api/register';

    const body =
      type === 'login'
        ? { emailOrUsername: formData.username, password: formData.password }
        : { ...formData, role: role || 'GymMember' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error || data.message}`);
      } else {
        if (type === 'login') {
          // Save the token to localStorage
          localStorage.setItem('token', data.token);
          // Save user data if needed
          localStorage.setItem('user', JSON.stringify(data.user));
          // Redirect to home page
          router.push('/home');
          router.refresh(); // Force a refresh to update the UI
        } else {
          alert(`${data.message}`);
          // For registration, redirect to login page
          router.push('/gymmember/login');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {type === 'register' && (
        <>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </>
      )}
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>

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
        button:hover {
          background-color: #0051c3;
        }
      `}</style>
    </form>
  );
}