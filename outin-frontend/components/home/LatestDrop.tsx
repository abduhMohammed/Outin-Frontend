import { getLatestDropProducts } from '@/services/apiService';
import type { Product } from '@/types/api';
import ProductSection from '@/components/home/ProductSection';

export default async function LatestDrop() {
let products: Product[] = [];
try {
    products = await getLatestDropProducts();
} catch (error) {
    console.error('LatestDrop: could not load products', error);
}

if (products.length === 0) return null;

return (
    <ProductSection
    title="LATEST DROP"
    products={products}
    badge={() => ({ label: 'NEW', variant: 'dark' })}
    />
);
}