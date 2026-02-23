

// Products
export async function fetchProducts() {
  const res = await fetch('/api/products')
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

// Categories
export async function fetchCategories() {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

export async function fetchCategory(slug) {
  const res = await fetch(`/api/categories/${slug}`)
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

// Cart
export async function fetchCart() {
  const res = await fetch('/api/cart')
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

export async function addToCart(productId, quantity = 1) {
  const res = await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  })
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
  return res.json()
}

// Default export for backward compatibility
const prismaClient = {
  fetchProducts,
  fetchProduct,
  fetchCategories,
  fetchCategory,
  fetchCart,
  addToCart
}

export default prismaClient