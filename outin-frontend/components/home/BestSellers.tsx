import { getBestSellers } from '@/services/apiService';
import type { Product } from '@/types/api';
import ProductSection from '@/components/home/ProductSection';

export default async function BestSellers() {
let products: Product[] = [];
try {
    products = await getBestSellers(8);
} catch (error) {
    console.error('BestSellers: could not load products', error);
}

if (products.length === 0) return null;

return (
    <ProductSection
    title="BEST SELLERS"
    products={products}
    badge={(i) => (i < 3 ? { label: `#${i + 1} Best Seller`, variant: 'accent' } : null)}
    />
);
}