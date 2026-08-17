import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem, Product, StockStatus } from '@/types/product'
import { seedProducts } from '@/data/seed'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { nowIso } from '@/utils/id'
import { clampQty } from '@/utils/money'

export function stockStatus(product: Product): StockStatus {
  if (product.stock <= 0) return 'out'
  if (product.stock <= 3) return 'low'
  return 'in-stock'
}

export const useCatalogStore = defineStore('catalog', () => {
  const products = ref<Product[]>(seedProducts)
  const cart = ref<CartItem[]>([])

  usePersistedRef('typeboard.cart', cart)

  const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0))

  const cartTotalCents = computed(() =>
    cart.value.reduce((sum, item) => {
      const product = products.value.find((entry) => entry.id === item.productId)
      if (!product) return sum
      return sum + product.priceCents * item.qty
    }, 0),
  )

  const cartLines = computed(() =>
    cart.value.flatMap((item) => {
      const product = products.value.find((entry) => entry.id === item.productId)
      if (!product) return []
      return [{ item, product, lineTotal: product.priceCents * item.qty }]
    }),
  )

  function addToCart(productId: string): void {
    const product = products.value.find((entry) => entry.id === productId)
    if (!product || product.stock <= 0) return

    const existing = cart.value.find((entry) => entry.productId === productId)
    if (existing) {
      existing.qty = clampQty(existing.qty + 1, product.stock)
      cart.value = [...cart.value]
      return
    }

    cart.value = [...cart.value, { productId, qty: 1, addedAt: nowIso() }]
  }

  function setQty(productId: string, qty: number): void {
    const product = products.value.find((entry) => entry.id === productId)
    if (!product) return
    cart.value = cart.value
      .map((item) =>
        item.productId === productId ? { ...item, qty: clampQty(qty, product.stock) } : item,
      )
      .filter((item) => item.qty > 0)
  }

  function removeFromCart(productId: string): void {
    cart.value = cart.value.filter((item) => item.productId !== productId)
  }

  function clearCart(): void {
    cart.value = []
  }

  return {
    products,
    cart,
    cartCount,
    cartTotalCents,
    cartLines,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
  }
})
