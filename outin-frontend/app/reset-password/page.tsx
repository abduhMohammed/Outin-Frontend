'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:7114/api/v1';

function ResetPasswordForm() {
const searchParams = useSearchParams();
const router = useRouter();

const email = searchParams.get('email') ?? '';
const token = searchParams.get('token') ?? '';
const linkIsMissingData = !email || !token;

const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [done, setDone] = useState(false);
const [error, setError] = useState<string | null>(null);

const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
useEffect(() => {
    return () => {
    if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
}, []);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
    setError('Password must be at least 8 characters.');
    return;
    }
    if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    return;
    }

    setIsLoading(true);
    try {
    const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
    });

    if (res.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
        return;
    }

    if (!res.ok) {
        let message =
        'This reset link is invalid or has expired. Please request a new one.';
        try {
        const data = await res.json();
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
            message = data.errors.join(' ');
        }
        } catch {
        /* keep default message */
        }
        setError(message);
        return;
    }

    setDone(true);
    redirectTimer.current = setTimeout(() => router.push('/login'), 3000);
    } catch {
    setError(
        'Could not reach the server. Check your connection and try again.'
    );
    } finally {
    setIsLoading(false);
    }
};

if (linkIsMissingData) {
    return (
    <div className="text-center space-y-4">
        <h1 className="text-lg font-black uppercase tracking-tight">
        Invalid link
        </h1>
        <p className="text-xs font-bold text-neutral-500">
        This reset link is incomplete. Please request a new one.
        </p>
        <Link
        href="/forgot-password"
        className="block w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors rounded text-center"
        >
        Request New Link
        </Link>
    </div>
    );
}

if (done) {
    return (
    <div className="text-center space-y-4">
        <h1 className="text-lg font-black uppercase tracking-tight">
        Password updated
        </h1>
        <p className="text-xs font-bold text-neutral-500">
        You can now log in with your new password. Redirecting...
        </p>
        <Link
        href="/login"
        className="block w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors rounded text-center"
        >
        Go to Login
        </Link>
    </div>
    );
}

return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
    <div>
        <h1 className="text-lg font-black uppercase tracking-tight">
        Set a new password
        </h1>
        <p className="text-xs font-bold text-neutral-500 mt-1 break-all">
        For <span className="text-black">{email}</span>
        </p>
    </div>

    {error && (
        <div
        role="alert"
        className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded"
        >
        {error}{' '}
        <Link href="/forgot-password" className="underline">
            Request a new link
        </Link>
        </div>
    )}

    <div>
        <label
        htmlFor="newPassword"
        className="text-xs font-bold uppercase tracking-wider block mb-1"
        >
        New Password
        </label>
        <input
        id="newPassword"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
        />
    </div>

    <div>
        <label
        htmlFor="confirmPassword"
        className="text-xs font-bold uppercase tracking-wider block mb-1"
        >
        Confirm Password
        </label>
        <input
        id="confirmPassword"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
        />
    </div>

    <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black cursor-pointer w-fit">
        <input
        type="checkbox"
        checked={showPassword}
        onChange={(e) => setShowPassword(e.target.checked)}
        />
        Show password
    </label>

    <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded disabled:bg-neutral-300 disabled:cursor-not-allowed cursor-pointer"
    >
        {isLoading ? 'Saving...' : 'Reset Password'}
    </button>

    <div className="text-center mt-6 pt-4 border-t border-neutral-100">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
        Back to{' '}
        <Link href="/login" className="text-black hover:text-orange-600">
            Sign In
        </Link>
        </p>
    </div>
    </form>
);
}

export default function ResetPasswordPage() {
return (
    <div className="min-h-screen bg-[#F9F9F9] text-black flex flex-col justify-center items-center p-4 font-sans">
    <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-black tracking-tighter">
        OUT<span className="text-orange-600">IN</span>
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
        Reset Your Password
        </p>
    </div>

    <div className="max-w-md w-full bg-white border border-neutral-200 p-8 shadow-sm">
        <Suspense
        fallback={
            <p className="text-center text-xs font-bold text-neutral-400">
            Loading...
            </p>
        }
        >
        <ResetPasswordForm />
        </Suspense>
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