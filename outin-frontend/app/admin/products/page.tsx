'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProductsPage() {
const [products, setProducts] = useState<any[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');
const [selectedStatus, setSelectedStatus] = useState('All');
const [isLoading, setIsLoading] = useState(true);
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

useEffect(() => {
fetch('https://localhost:7114/api/v1/products')
    .then((res) => {
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
    })
    .then((data) => {
    if (data && Array.isArray(data.items)) {
        setProducts(data.items);
    } else if (Array.isArray(data)) {
        setProducts(data);
    } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
    } else {
        setProducts([]);
    }
    setIsLoading(false);
    })
    .catch((err) => {
    console.error('Error fetching products:', err);
    setProducts([]);
    setIsLoading(false);
    });
}, []);

const productList = Array.isArray(products) ? products : [];

const filteredProducts = productList.filter((product) => {
const matchesSearch = product.name
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase());

const matchesCategory =
    selectedCategory === 'All' || product.categoryName === selectedCategory;

const prodStatus = product.status !== undefined ? String(product.status) : '1';
const matchesStatus =
    selectedStatus === 'All' || prodStatus === selectedStatus;

return matchesSearch && matchesCategory && matchesStatus;
});

const handleDelete = async (productId: string) => {
if (!confirm('Are you sure you want to delete this product?')) return;
try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://localhost:7114/api/v1/products/${productId}`, {
    method: 'DELETE',
    headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    });
    if (res.ok) {
    setProducts(products.filter((p) => p.id !== productId));
    alert('Product deleted successfully.');
    } else {
    alert('Failed to delete product.');
    }
} catch (err) {
    console.error('Error deleting product:', err);
}
};

const getStatusBadge = (product: any) => {
const status = product.status;
if (status === 0 || status === 'Draft') {
    return (
    <span className="bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase whitespace-nowrap">
        Draft
    </span>
    );
}
return (
    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase whitespace-nowrap">
    Active
    </span>
);
};

return (
<AdminLayout>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Products</h2>
        <p className="text-xs font-semibold text-neutral-400 mt-0.5">
        Manage your products catalog
        </p>
    </div>
    <Link
        href="/admin/products/new"
        className="bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded transition-colors text-center w-full sm:w-auto"
    >
        + Add Product
    </Link>
    </div>

    <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center">
    <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:flex-1 min-w-[200px] border border-neutral-200 p-2 text-xs rounded outline-none focus:border-black"
    />

    <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full sm:w-auto border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
    >
        <option value="All">All Categories</option>
        <option value="Hoodies">Hoodies</option>
        <option value="T-Shirts">T-Shirts</option>
        <option value="Sweatshirts">Sweatshirts</option>
    </select>

    <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full sm:w-auto border border-neutral-200 p-2 text-xs rounded bg-white font-bold outline-none cursor-pointer"
    >
        <option value="All">All Statuses</option>
        <option value="1">Active</option>
        <option value="0">Draft</option>
    </select>
    </div>

    <div className="bg-white border border-neutral-200 rounded shadow-sm overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[650px]">
        <thead>
        <tr className="border-b border-neutral-200 text-[11px] font-black uppercase tracking-wider text-neutral-400 bg-neutral-50">
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
        </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100 text-xs font-semibold">
        {isLoading ? (
            <tr>
            <td colSpan={6} className="p-8 text-center text-neutral-400">
                Loading products...
            </td>
            </tr>
        ) : filteredProducts.length === 0 ? (
            <tr>
            <td colSpan={6} className="p-8 text-center text-neutral-400">
                No products found.
            </td>
            </tr>
        ) : (
            filteredProducts.map((product) => {
            const productId = product.id;
            const displayImage = product.thumbnailUrl || '/images/product/Basic.jpg';
            const displayPrice = product.minPrice !== undefined ? product.minPrice : 0;
            const isMenuOpen = activeDropdown === productId;

            return (
                <tr
                key={productId}
                className="hover:bg-neutral-50 transition-colors relative"
                >
                <td className="p-4">
                    <div className="relative w-10 h-12 bg-neutral-100 rounded overflow-hidden shrink-0">
                    <Image
                        src={displayImage}
                        alt={product.name || 'Product'}
                        fill
                        className="object-cover"
                    />
                    </div>
                </td>

                <td className="p-4 font-extrabold max-w-[150px] truncate">{product.name}</td>

                <td className="p-4 text-neutral-500">
                    {product.categoryName || 'Unassigned'}
                </td>

                <td className="p-4 font-bold whitespace-nowrap">EGP {displayPrice}</td>

                <td className="p-4">{getStatusBadge(product)}</td>

                <td className="p-4 text-right relative">
                    <button
                    onClick={() => setActiveDropdown(isMenuOpen ? null : productId)}
                    className="font-bold text-neutral-400 hover:text-black px-3 py-1 text-sm tracking-widest cursor-pointer inline-block"
                    >
                    ...
                    </button>

                    {isMenuOpen && (
                    <div className="absolute right-10 top-2 w-32 bg-white border border-neutral-200 rounded shadow-xl z-50 py-1 text-left">
                        <Link
                        href={`/admin/products/${productId}`}
                        className="block px-4 py-2 hover:bg-neutral-100 text-neutral-700 font-bold"
                        onClick={() => setActiveDropdown(null)}
                        >
                        Edit
                        </Link>
                        <button
                        onClick={() => {
                            setActiveDropdown(null);
                            handleDelete(productId);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold cursor-pointer"
                        >
                        Delete
                        </button>
                    </div>
                    )}
                </td>
                </tr>
            );
            })
        )}
        </tbody>
    </table>
    </div>
</AdminLayout>
);
}