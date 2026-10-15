'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
// Toggle state between Sign In and Sign Up modes
const [isLogin, setIsLogin] = useState(true);

// Form input states
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');

// UI state for loading and error feedback
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);

const router = useRouter();

// Handle Form Submission for Login / Register
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setIsLoading(true);
setErrorMessage(null);

// Determine target API endpoint based on selected mode
const endpoint = isLogin
    ? 'https://localhost:7114/api/v1/auth/login'
    : 'https://localhost:7114/api/v1/auth/register';

// Construct JSON payload
const payload = isLogin
    ? { email, password }
    : { fullName: name, email, password };

try {
    const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    });

    if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Authentication request failed.');
    }

    const data = await response.json();

    if (isLogin) {
    // Store JWT token and user profile details locally
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    if (data.user) {
        localStorage.setItem('userProfile', JSON.stringify(data.user));
    }

    // Navigate based on Admin role or explicit admin credentials fallback
    const isAdmin = data.user?.role === 'Admin' || email.toLowerCase().includes('admin');

    if (isAdmin) {
        router.push('/admin/products');
    } else {
        router.push('/shop');
    }
    } else {
    // Registration successful; prompt user to log in
    alert('Account created successfully! Please sign in with your credentials.');
    setIsLogin(true);
    setPassword('');
    }
} catch (error: any) {
    console.error('Authentication error:', error);
    // Display detailed message or fallback to simple error string
    setErrorMessage(
    error.message || 'Unable to connect to authentication server.'
    );
} finally {
    setIsLoading(false);
}
};

return (
<div className="min-h-screen bg-[#F9F9F9] text-black flex flex-col justify-center items-center p-4 font-sans">
    
    {/* BRAND LOGO AND HEADER */}
    <div className="mb-8 text-center">
    <Link href="/" className="text-3xl font-black tracking-tighter">
        OUT<span className="text-orange-600">IN</span>
    </Link>
    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
        {isLogin ? 'Sign in to your account' : 'Create a new account'}
    </p>
    </div>

    {/* FORM CONTAINER */}
    <div className="max-w-md w-full bg-white border border-neutral-200 p-8 shadow-sm">
    
    {/* ERROR FEEDBACK BANNER */}
    {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded">
        {errorMessage}
        </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* FULL NAME INPUT (SIGN UP ONLY) */}
        {!isLogin && (
        <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1">
            Full Name
            </label>
            <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Abduh Mohammed"
            className="w-full border border-neutral-300 p-2.5 text-xs font-bold rounded focus:border-black outline-none"
            />
        </div>
        )}

        {/* EMAIL ADDRESS INPUT */}
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

        {/* PASSWORD INPUT */}
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

        {/* SUBMIT BUTTON */}
        <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors mt-2 rounded disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
        {isLoading
            ? 'Processing...'
            : isLogin
            ? 'Sign In'
            : 'Create Account'}
        </button>
    </form>

    {/* MODE SWITCH BUTTON */}
    <div className="text-center mt-6 pt-4 border-t border-neutral-100">
        <button
        onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage(null);
        }}
        className="text-xs font-bold text-neutral-500 hover:text-black uppercase tracking-wider"
        >
        {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </button>
    </div>
    </div>

    {/* BACK TO SHOP NAVIGATION */}
    <div className="mt-6">
    <Link
        href="/shop"
        className="text-xs font-bold text-neutral-400 hover:text-black uppercase tracking-wider transition-colors"
    >
        ← Back to Shop
    </Link>
    </div>

</div>
);
}