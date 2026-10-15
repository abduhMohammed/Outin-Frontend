'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/apiService';
import { Category } from '@/types/api';

export default function AdminCategoriesPage() {
const [categories, setCategories] = useState<Category[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
    setIsLoading(false);
}

loadCategories();
}, []);

return (
<div className="min-h-screen bg-[#F9F9F9] text-black flex">
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col justify-between p-6">
    <div className="space-y-8">
        <Link href="/" className="text-xl font-black tracking-tighter block">
        OUT<span className="text-orange-600">IN</span>
        </Link>
        <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
        <Link href="/admin" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">Dashboard</Link>
        <Link href="/admin/products" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">Products</Link>
        <Link href="/admin/orders" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">Orders</Link>
        <Link href="/admin/categories" className="block px-3 py-2.5 rounded bg-orange-50 text-orange-600">Categories</Link>
        </nav>
    </div>
    </aside>

    <main className="flex-1 p-8 overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
        <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Categories</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">Manage product categories</p>
        </div>
        <button className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded transition-colors">
        + Add Category
        </button>
    </div>

    <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-hidden">
        {isLoading ? (
        <div className="p-8 text-center text-xs font-bold text-neutral-400 animate-pulse">
            Loading Categories...
        </div>
        ) : categories.length === 0 ? (
        <div className="p-8 text-center text-xs font-bold text-neutral-400">
            No categories found.
        </div>
        ) : (
        <table className="w-full text-left border-collapse">
            <thead>
            <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
                <th className="p-4">Name</th>
                <th className="p-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
            {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4">
                    <p className="font-extrabold text-sm">{cat.name}</p>
                    <p className="text-[11px] text-neutral-400 font-normal">
                    {cat.isActive ? 'Active' : 'Inactive'}
                    </p>
                </td>
                <td className="p-4 text-right font-bold text-neutral-400 hover:text-black cursor-pointer">...</td>
                </tr>
            ))}
            </tbody>
        </table>
        )}
    </div>
    </main>
</div>
);
}