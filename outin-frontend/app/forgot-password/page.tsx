'use client';

import { useState } from 'react';
import Link from 'next/link';

const API =
process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

export default function ForgotPasswordPage() {
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [sent, setSent] = useState(false);
const [error, setError] = useState<string | null>(null);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = email.trim();

    if (!value) {
    setError('Please enter your email.');
    return;
    }

    if (value.length > 254 || !EMAIL_REGEX.test(value)) {
    setError(
        'Please enter a valid email address (e.g. name@example.com).'
    );
    return;
    }

    setIsLoading(true);

    try {
    const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
    });

    if (res.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
        return;
    }

    if (res.status === 400) {
        setError('Please enter a valid email address.');
        return;
    }

    if (!res.ok) {
        setError('Something went wrong. Please try again later.');
        return;
    }

    setSent(true);
    } catch {
    setError(
        'Could not reach the server. Check your connection and try again.'
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
        Password Recovery
        </p>
    </div>

    <div className="max-w-md w-full bg-white border border-neutral-200 p-8 shadow-sm">
        {sent ? (
        <div className="text-center space-y-4">
            <h1 className="text-lg font-black uppercase tracking-tight">
            Check your email
            </h1>

            <p className="text-xs font-bold text-neutral-500 leading-relaxed">
            If an account exists for{' '}
            <span className="text-black break-all">{email.trim()}</span>, we
            sent a link to reset your password. The link expires in 1 hour.
            </p>

            <p className="text-[11px] font-bold text-neutral-400">
            Nothing in your inbox? Check your spam folder.
            </p>

            <Link
            href="/login"
            className="block w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded text-center"
            >
            Back to Login
            </Link>
        </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
            <h1 className="text-lg font-black uppercase tracking-tight">
                Forgot Password?
            </h1>
            <p className="text-xs font-bold text-neutral-500 mt-1 leading-relaxed">
                Enter your registered email and we will send you a reset link.
            </p>
            </div>

            {error && (
            <div
                role="alert"
                className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded"
            >
                {error}
            </div>
            )}

            <div>
            <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider block mb-1"
            >
                Email Address
            </label>

            <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer"
            >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-6 pt-4 border-t border-neutral-100">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Remember your password?{' '}
                <Link href="/login" className="text-black hover:text-orange-600">
                Sign In
                </Link>
            </p>
            </div>
        </form>
        )}
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