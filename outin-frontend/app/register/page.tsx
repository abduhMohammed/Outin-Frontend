
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
const router = useRouter();

// Form states
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// UI states
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password,
    };

    try {
    const response = await fetch(
        'https://localhost:7114/api/v1/auth/register',
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed.');
    }

    setSuccessMessage(
        'Account created successfully! Redirecting to login...'
    );

    setTimeout(() => {
        router.push('/login');
    }, 2000);

    } catch (error) {
    console.error('Registration error:', error);

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

    {/* BRAND HEADER */}
    <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-black tracking-tighter">
        OUT<span className="text-orange-600">IN</span>
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
        Create a new account
        </p>
    </div>

    {/* REGISTER FORM */}
    <div className="max-w-md w-full bg-white border border-neutral-200 p-8 shadow-sm">

        {/* ERROR MESSAGE */}
        {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded">
            {errorMessage}
        </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded">
            {successMessage}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

        {/* FIRST NAME */}
        <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
            First Name
            </label>

            <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Abdo"
            className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
        </div>

        {/* LAST NAME */}
        <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
            Last Name
            </label>

            <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Mohamed"
            className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
        </div>

        {/* EMAIL */}
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

        {/* PASSWORD */}
        <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
            Password
            </label>

            <input
            type="password"
            required
            minLength={8}
            pattern="(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Password must contain at least 8 characters, one lowercase and one uppercase letter."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
        </div>

        {/* SUBMIT BUTTON */}
        <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
            {isLoading
            ? 'Creating Account...'
            : successMessage
                ? 'Account Created'
                : 'Create Account'}
        </button>

        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-6 pt-4 border-t border-neutral-100">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Already have an account?{' '}
            <Link
            href="/login"
            className="text-black hover:text-orange-600"
            >
            Sign In
            </Link>
        </p>
        </div>

    </div>

    {/* BACK TO SHOP */}
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
