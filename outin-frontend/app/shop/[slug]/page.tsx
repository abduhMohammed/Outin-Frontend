'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/services/apiService';
import { ProductDetails } from '@/types/api';
import { useCart } from '@/lib/useCartStore';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
const resolvedParams = use(params);
const slug = resolvedParams?.slug;
const router = useRouter();
const { addItem } = useCart();

const [product, setProduct] = useState<ProductDetails | null>(null);
const [selectedImage, setSelectedImage] = useState<string>('');
const [selectedColor, setSelectedColor] = useState<string>('');
const [selectedSize, setSelectedSize] = useState<string>('');
const [quantity, setQuantity] = useState<number>(1);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [toastMessage, setToastMessage] = useState<string | null>(null);
const [openAccordion, setOpenAccordion] = useState<string | null>(null);

useEffect(() => {
    async function fetchProduct() {
    if (!slug) return;
    setIsLoading(true);
    const data = await getProductById(slug);

    if (data) {
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
        setSelectedImage(data.imageUrls[0]);
        }
        if (data.variants && data.variants.length > 0) {
        setSelectedColor(data.variants[0].colorName);
        setSelectedSize(data.variants[0].sizeName);
        }
    }
    setIsLoading(false);
    }

    fetchProduct();
}, [slug]);

if (isLoading) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-12">
        <p className="text-xs font-bold text-neutral-400 animate-pulse">Loading Product Details...</p>
    </div>
    );
}

if (!product) {
    return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-12 space-y-4">
        <p className="text-sm font-bold text-neutral-500">Product Not Found</p>
        <Link href="/shop" className="bg-black text-white px-6 py-2 text-xs font-bold uppercase tracking-wider">
        Back to Shop
        </Link>
    </div>
    );
}

const availableColors = Array.from(new Set(product.variants.map((v) => v.colorName)));
const availableSizes = Array.from(new Set(product.variants.map((v) => v.sizeName)));

const activeVariant =
    product.variants.find(
    (v) =>
        v.colorName.toLowerCase() === selectedColor.toLowerCase() &&
        v.sizeName.toLowerCase() === selectedSize.toLowerCase()
    ) ||
    product.variants.find((v) => v.colorName.toLowerCase() === selectedColor.toLowerCase()) ||
    product.variants[0];

const currentPrice = activeVariant?.price ?? 0;
const currentStock = activeVariant?.stockQuantity ?? 0;
const isOutOfStock = currentStock <= 0 || product.productStatus === 'OutOfStock';

const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
    setToastMessage(null);
    }, 3000);
};

const handleAddToCart = (redirectCheckout = false) => {
    if (!activeVariant) return;

    addItem({
    variantId: activeVariant.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: selectedImage || product.imageUrls[0] || '/images/product/Basic.jpg',
    colorName: activeVariant.colorName,
    sizeName: activeVariant.sizeName,
    price: activeVariant.price,
    quantity: quantity,
    maxStock: activeVariant.stockQuantity,
    });

    if (redirectCheckout) {
    router.push('/checkout');
    } else {
    showToast(`Added ${quantity} x ${product.name} (${selectedColor} / ${selectedSize}) to cart!`);
    }
};

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans pb-20 relative">
    {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white text-xs font-bold px-5 py-3 rounded shadow-xl flex items-center gap-2 border border-neutral-700 animate-bounce">
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
        <span>{toastMessage}</span>
        </div>
    )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 pb-4">
        <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-black transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">SHOP</Link>
        <span>/</span>
        <span className="text-neutral-700">OUTIN {product.name}</span>
        </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col items-center gap-3 order-2 lg:order-1">
            <div className="flex lg:flex-col gap-3 overflow-y-auto max-h-[500px] no-scrollbar w-full">
            {product.imageUrls.map((img, idx) => (
                <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 flex-shrink-0 border transition-all ${
                    selectedImage === img
                    ? 'border-black ring-1 ring-black'
                    : 'border-neutral-200 opacity-70 hover:opacity-100'
                }`}
                >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="96px" className="object-cover" />
                </button>
            ))}
            </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
            <Image
                src={selectedImage || '/images/product/Basic.jpg'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
            />
            </div>
        </div>

        <div className="lg:col-span-5 order-3 space-y-6">
            <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
                {product.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                OUTIN <br /> {product.name}
            </h1>
            <p className="text-xl font-extrabold mt-3 text-black">
                EGP {currentPrice}
            </p>
            </div>

            <div className="space-y-2 text-xs font-semibold text-neutral-600 border-b border-neutral-200 pb-5">
            <p className="whitespace-pre-line leading-relaxed italic">
                {product.description}
            </p>
            </div>

            {availableColors.length > 0 && (
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider block">
                COLOR: <span className="text-neutral-500 font-bold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                {availableColors.map((colorName) => {
                    const isSelected = selectedColor.toLowerCase() === colorName.toLowerCase();
                    return (
                    <button
                        key={colorName}
                        onClick={() => {
                        setSelectedColor(colorName);
                        const firstMatchingVariant = product.variants.find(
                            (v) =>
                            v.colorName.toLowerCase() === colorName.toLowerCase() &&
                            v.stockQuantity > 0
                        );
                        if (firstMatchingVariant) {
                            setSelectedSize(firstMatchingVariant.sizeName);
                        }
                        const matchingImg = product.imageUrls.find((url) =>
                            url.toLowerCase().includes(colorName.toLowerCase())
                        );
                        if (matchingImg) setSelectedImage(matchingImg);
                        }}
                        className={`px-4 py-2 text-xs font-bold border transition-all uppercase ${
                        isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                        }`}
                    >
                        {colorName}
                    </button>
                    );
                })}
                </div>
            </div>
            )}

            {availableSizes.length > 0 && (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-wider block">
                    SIZE: <span className="text-neutral-500 font-bold">{selectedSize}</span>
                </label>
                <button className="text-[11px] font-bold text-neutral-400 hover:text-black underline">
                    Size Guide
                </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                {availableSizes.map((sizeName) => {
                    const isSelected = selectedSize.toLowerCase() === sizeName.toLowerCase();
                    const isAvailableForColor = product.variants.some(
                    (v) =>
                        v.colorName.toLowerCase() === selectedColor.toLowerCase() &&
                        v.sizeName.toLowerCase() === sizeName.toLowerCase() &&
                        v.stockQuantity > 0
                    );

                    return (
                    <button
                        key={sizeName}
                        disabled={!isAvailableForColor}
                        onClick={() => setSelectedSize(sizeName)}
                        className={`min-w-[42px] h-10 text-xs font-black border transition-all ${
                        isSelected
                            ? 'bg-black text-white border-black'
                            : isAvailableForColor
                            ? 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                            : 'bg-neutral-100 text-neutral-300 border-neutral-200 line-through cursor-not-allowed opacity-50'
                        }`}
                    >
                        {sizeName}
                    </button>
                    );
                })}
                </div>
            </div>
            )}

            <div className="flex items-center border border-neutral-200 bg-white w-fit">
            <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-sm font-bold hover:bg-neutral-100 transition-colors"
            >
                -
            </button>
            <span className="px-4 py-2 text-xs font-black min-w-[36px] text-center">
                {quantity}
            </span>
            <button
                onClick={() => setQuantity((q) => Math.min(currentStock || 1, q + 1))}
                className="px-3 py-2 text-sm font-bold hover:bg-neutral-100 transition-colors"
            >
                +
            </button>
            </div>

            <div className="space-y-3 pt-2">
            <button
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(false)}
                className="w-full bg-[#FF4500] hover:bg-[#e03d00] text-white text-xs font-black uppercase tracking-widest py-4 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <button
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(true)}
                className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-4 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
                BUY NOW
            </button>
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="border-b border-neutral-100 pb-3">
                <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="w-full flex justify-between items-center text-xs font-black uppercase tracking-wider text-neutral-800"
                >
                <span>SHIPPING & DELIVERY</span>
                <span>{openAccordion === 'shipping' ? '-' : '+'}</span>
                </button>
                {openAccordion === 'shipping' && (
                <p className="text-[11px] text-neutral-500 font-semibold mt-2 leading-relaxed">
                    Standard delivery takes 2-4 business days across Egypt. Express shipping options available at checkout.
                </p>
                )}
            </div>

            <div className="border-b border-neutral-100 pb-3">
                <button
                onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                className="w-full flex justify-between items-center text-xs font-black uppercase tracking-wider text-neutral-800"
                >
                <span>EXCHANGE & RETURN POLICY</span>
                <span>{openAccordion === 'returns' ? '-' : '+'}</span>
                </button>
                {openAccordion === 'returns' && (
                <p className="text-[11px] text-neutral-500 font-semibold mt-2 leading-relaxed">
                    Free returns and size exchanges within 14 days of purchase. Items must be unworn with original tags attached.
                </p>
                )}
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
);
}