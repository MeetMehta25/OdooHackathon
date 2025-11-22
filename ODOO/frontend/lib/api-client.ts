import axios, { type AxiosInstance } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for JWT
    this.client.interceptors.request.use((config) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  login(email: string, password: string) {
    return this.client.post("/users/login", { email, password });
  }

  register(
    email: string,
    password: string,
    full_name: string,
    role: string = "warehouse_staff"
  ) {
    return this.client.post("/users/register", {
      email,
      password,
      full_name,
      role,
    });
  }

  // User Profile
  getProfile() {
    return this.client.get("/users/profile");
  }

  // Products
  getProducts() {
    return this.client.get("/products");
  }

  createProduct(data: any) {
    return this.client.post("/products", data);
  }

  updateProduct(id: string, data: any) {
    return this.client.put(`/products/${id}`, data);
  }

  deleteProduct(id: string) {
    return this.client.delete(`/products/${id}`);
  }

  // Categories
  getCategories() {
    return this.client.get("/categories");
  }

  createCategory(data: any) {
    return this.client.post("/categories", data);
  }

  updateCategory(id: string, data: any) {
    return this.client.put(`/categories/${id}`, data);
  }

  deleteCategory(id: string) {
    return this.client.delete(`/categories/${id}`);
  }

  // Warehouses
  getWarehouses() {
    return this.client.get("/warehouses");
  }

  createWarehouse(data: any) {
    return this.client.post("/warehouses", data);
  }

  updateWarehouse(id: string, data: any) {
    return this.client.put(`/warehouses/${id}`, data);
  }

  deleteWarehouse(id: string) {
    return this.client.delete(`/warehouses/${id}`);
  }

  // Stock
  getStock() {
    return this.client.get("/stock");
  }

  getStockByProduct(productId: string) {
    return this.client.get(`/stock/product/${productId}`);
  }

  // Receipts
  getReceipts() {
    return this.client.get("/receipts");
  }

  createReceipt(data: any) {
    return this.client.post("/receipts", data);
  }

  updateReceipt(id: string, data: any) {
    return this.client.put(`/receipts/${id}`, data);
  }

  // Transfers
  getTransfers(status?: string) {
    return this.client.get("/transfers", { params: { status } });
  }

  getTransferById(id: string) {
    return this.client.get(`/transfers/${id}`);
  }

  createTransfer(data: any) {
    return this.client.post("/transfers", data);
  }

  updateTransferStatus(id: string, status: string) {
    return this.client.patch(`/transfers/${id}/status`, { status });
  }

  addTransferItem(id: string, item: any) {
    return this.client.post(`/transfers/${id}/items`, item);
  }

  processTransfer(id: string) {
    return this.client.post(`/transfers/${id}/process`);
  }

  // Warehouses and Locations
  getLocations(warehouseId?: string) {
    if (warehouseId) {
      return this.client.get(`/warehouses/${warehouseId}/locations`);
    }
    return this.client.get("/warehouses/locations/all");
  }

  // Deliveries
  getDeliveries(status?: string, warehouseId?: string) {
    return this.client.get("/deliveries", {
      params: { status, warehouse_id: warehouseId },
    });
  }

  getDeliveryById(id: string) {
    return this.client.get(`/deliveries/${id}`);
  }

  createDelivery(data: any) {
    return this.client.post("/deliveries", data);
  }

  updateDeliveryStatus(id: string, status: string) {
    return this.client.patch(`/deliveries/${id}/status`, { status });
  }

  addDeliveryItem(id: string, item: any) {
    return this.client.post(`/deliveries/${id}/items`, item);
  }

  // Adjustments (Stock Counting)
  getAdjustments(productId?: string, locationId?: string) {
    return this.client.get("/adjustments", {
      params: { product_id: productId, location_id: locationId },
    });
  }

  getAdjustmentById(id: string) {
    return this.client.get(`/adjustments/${id}`);
  }

  createAdjustment(data: {
    product_id: string;
    location_id: string;
    counted_quantity: number;
    previous_quantity: number;
    reason: string;
  }) {
    return this.client.post("/adjustments", data);
  }
}

export const apiClient = new APIClient();
