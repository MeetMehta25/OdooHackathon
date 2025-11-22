import axios, { type AxiosInstance } from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for JWT
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // Auth
  login(email: string, password: string) {
    return this.client.post("/auth/login", { email, password })
  }

  register(email: string, password: string, name: string) {
    return this.client.post("/auth/register", { email, password, name })
  }

  forgotPassword(email: string) {
    return this.client.post("/auth/forgot-password", { email })
  }

  verifyOTP(email: string, otp: string, newPassword: string) {
    return this.client.post("/auth/verify-otp", { email, otp, newPassword })
  }

  // Products
  getProducts() {
    return this.client.get("/products")
  }

  createProduct(data: any) {
    return this.client.post("/products", data)
  }

  updateProduct(id: string, data: any) {
    return this.client.put(`/products/${id}`, data)
  }

  deleteProduct(id: string) {
    return this.client.delete(`/products/${id}`)
  }

  // Categories
  getCategories() {
    return this.client.get("/categories")
  }

  createCategory(data: any) {
    return this.client.post("/categories", data)
  }

  updateCategory(id: string, data: any) {
    return this.client.put(`/categories/${id}`, data)
  }

  deleteCategory(id: string) {
    return this.client.delete(`/categories/${id}`)
  }

  // Warehouses
  getWarehouses() {
    return this.client.get("/warehouses")
  }

  createWarehouse(data: any) {
    return this.client.post("/warehouses", data)
  }

  updateWarehouse(id: string, data: any) {
    return this.client.put(`/warehouses/${id}`, data)
  }

  deleteWarehouse(id: string) {
    return this.client.delete(`/warehouses/${id}`)
  }

  // Stock
  getStock() {
    return this.client.get("/stock")
  }

  getStockByProduct(productId: string) {
    return this.client.get(`/stock/product/${productId}`)
  }

  // Receipts
  getReceipts() {
    return this.client.get("/receipts")
  }

  createReceipt(data: any) {
    return this.client.post("/receipts", data)
  }

  updateReceipt(id: string, data: any) {
    return this.client.put(`/receipts/${id}`, data)
  }
}

export const apiClient = new APIClient()
