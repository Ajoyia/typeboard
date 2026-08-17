export type ProductCategory = 'keyboard' | 'desk' | 'lighting' | 'audio'

export type Product = {
  id: string
  name: string
  category: ProductCategory
  priceCents: number
  stock: number
  rating: number
}

export type CartItem = {
  productId: string
  qty: number
  addedAt: string
}

export type StockStatus = 'in-stock' | 'low' | 'out'

export const PRODUCT_CATEGORIES: ProductCategory[] = ['keyboard', 'desk', 'lighting', 'audio']
