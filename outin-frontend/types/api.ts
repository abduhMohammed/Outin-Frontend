// 1. Category Interface
export interface Category {
id: string;
name: string;
slug: string;
description: string;
isActive: boolean;
}

// 2. Faculty Drop Interface
export interface FacultyDrop {
id: string;
name: string;
slug: string;
description: string;
imageUrl: string;
displayOrder: number;
isActive: boolean;
}

//4. Product Interface
export interface Product {
id: string;
name: string;
slug: string;
minPrice: number;
maxPrice: number;
thumbnailUrl: string;
categoryName?: string;
facultyDropIds?: string[];
status?: number;
}

//5. Color Interface
export interface Color {
id: string;
name: string;
hexCode?: string;
}

//6. Size Interface
export interface Size {
id: string;
name: string;
}

//7. ProductVariant Interface
export interface ProductVariant {
id: string;
sku: string;
colorId: string;
colorName: string;
sizeId: string;
sizeName: string;
price: number;
stockQuantity: number;
}

//8. ProductDetails Interface
export interface ProductDetails {
id: string;
name: string;
slug: string;
description: string;
productStatus: string;
categoryId: string;
categoryName: string;
variants: ProductVariant[];
imageUrls: string[];
}

//9. Order Interface
export interface CartItem {
variantId: string;
productId: string;
slug: string;
name: string;
imageUrl: string;
colorName: string;
sizeName: string;
price: number;
quantity: number;
maxStock: number;
}