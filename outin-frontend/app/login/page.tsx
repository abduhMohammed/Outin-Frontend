'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid email or password.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles ?? [],
        })
      );

      const isAdmin = Array.isArray(data.roles) && data.roles.includes('Admin');

      router.push(isAdmin ? '/admin/products' : '/shop');

    } catch (error) {
      console.error('Login error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to connect to authentication server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black flex flex-col justify-center items-center p-4 font-sans">

      <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-black tracking-tighter">
          OUT<span className="text-orange-600">IN</span>
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
          Sign in to your account
        </p>
      </div>

      <div className="max-w-md w-full bg-white border border-neutral-200 p-8 shadow-sm">

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-bold text-neutral-500 hover:text-black underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <div className="text-center mt-6 pt-4 border-t border-neutral-100">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Don't have an account?{' '}
            <Link href="/register" className="text-black hover:text-orange-600">
              Sign Up
            </Link>
          </p>
        </div>

      </div>

      <div className="mt-6">
        <Link
          href="/shop"
          className="text-xs font-bold text-neutral-400 hover:text-black uppercase tracking-wider"
        >
          ← Back to Shop
        </Link>
      </div>

    </div>
  );
}