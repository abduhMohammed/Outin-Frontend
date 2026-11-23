import { getCategories, getProducts } from '@/services/apiService';
import CategoryTilesView, { type Tile } from '@/components/home/CategoryTilesView';

export default async function CategoryTiles() {
let tiles: Tile[] = [];

try {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);

    tiles = categories.flatMap((cat) => {
    const product = products.find(
        (p) => p.categoryName?.toLowerCase() === cat.name.toLowerCase()
    );
    return product
        ? [{ id: cat.id, name: cat.name, slug: cat.slug, imageUrl: product.thumbnailUrl }]
        : [];
    });
} catch (error) {
    console.error('CategoryTiles: could not load categories', error);
}

if (tiles.length === 0) return null;

return <CategoryTilesView tiles={tiles} />;
}