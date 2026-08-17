<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type StockStatus,
} from '@/types/product'
import { stockStatus, useCatalogStore } from '@/stores/catalog'
import { formatCents } from '@/utils/money'
import { sortBy } from '@/utils/sort'

const store = useCatalogStore()
const category = ref<ProductCategory | 'all'>('all')
const sortKey = ref<'name' | 'priceCents' | 'rating'>('name')

const products = computed(() => {
  const filtered =
    category.value === 'all'
      ? store.products
      : store.products.filter((product) => product.category === category.value)
  return sortBy(filtered, sortKey.value, sortKey.value === 'name' ? 'asc' : 'desc')
})

function isCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory)
}

function setCategory(value: string): void {
  category.value = value === 'all' || isCategory(value) ? value : 'all'
}

function statusLabel(status: StockStatus): string {
  if (status === 'in-stock') return 'In stock'
  if (status === 'low') return 'Low stock'
  return 'Out of stock'
}

function canAdd(product: Product): boolean {
  return stockStatus(product) !== 'out'
}

function onQty(productId: string, event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  store.setQty(productId, value)
}
</script>

<template>
  <section class="page layout">
    <div>
      <h1>Catalog</h1>
      <p class="lede">
        Products, stock unions, and a typed cart. Practice generics, money helpers, and filters.
      </p>
      <div class="focus">
        <span>ProductCategory</span>
        <span>StockStatus</span>
        <span>CartItem</span>
        <span>formatCents</span>
      </div>

      <div class="row">
        <button
          class="btn"
          :class="{ ghost: category !== 'all' }"
          type="button"
          @click="setCategory('all')"
        >
          all
        </button>
        <button
          v-for="item in PRODUCT_CATEGORIES"
          :key="item"
          class="btn"
          :class="{ ghost: category !== item }"
          type="button"
          @click="setCategory(item)"
        >
          {{ item }}
        </button>
        <label class="field sort">
          <span>Sort</span>
          <select v-model="sortKey">
            <option value="name">name</option>
            <option value="priceCents">price</option>
            <option value="rating">rating</option>
          </select>
        </label>
      </div>

      <ul class="products">
        <li v-for="product in products" :key="product.id" class="card">
          <p class="pill">{{ product.category }}</p>
          <h2>{{ product.name }}</h2>
          <p>{{ formatCents(product.priceCents) }} · {{ product.rating.toFixed(1) }}★</p>
          <p class="stock" :data-status="stockStatus(product)">
            {{ statusLabel(stockStatus(product)) }} · {{ product.stock }} left
          </p>
          <button
            class="btn"
            type="button"
            :disabled="!canAdd(product)"
            @click="store.addToCart(product.id)"
          >
            Add to cart
          </button>
        </li>
      </ul>
    </div>

    <aside class="card cart">
      <h2>Cart</h2>
      <p class="muted">{{ store.cartCount }} items</p>
      <ul>
        <li v-for="line in store.cartLines" :key="line.item.productId">
          <div>
            <strong>{{ line.product.name }}</strong>
            <p>{{ formatCents(line.lineTotal) }}</p>
          </div>
          <div class="row">
            <input
              :value="line.item.qty"
              type="number"
              min="1"
              :max="line.product.stock"
              @change="onQty(line.item.productId, $event)"
            />
            <button
              class="btn ghost"
              type="button"
              @click="store.removeFromCart(line.item.productId)"
            >
              Remove
            </button>
          </div>
        </li>
      </ul>
      <p v-if="!store.cartLines.length" class="empty">Cart is empty.</p>
      <div class="total">
        <span>Total</span>
        <strong>{{ formatCents(store.cartTotalCents) }}</strong>
      </div>
      <button
        class="btn ghost"
        type="button"
        :disabled="!store.cart.length"
        @click="store.clearCart()"
      >
        Clear cart
      </button>
    </aside>
  </section>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 1rem;
  align-items: start;
}

.products {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
}

.products h2 {
  font-size: 1rem;
  margin: 0.4rem 0;
}

.stock[data-status='low'] {
  color: var(--warn);
}

.stock[data-status='out'] {
  color: var(--danger);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.cart ul {
  list-style: none;
  display: grid;
  gap: 0.8rem;
  margin: 0.8rem 0;
}

.cart input {
  width: 4.2rem;
}

.muted,
.total span {
  color: var(--muted);
}

.total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

.sort {
  min-width: 8rem;
}

@media (max-width: 840px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
