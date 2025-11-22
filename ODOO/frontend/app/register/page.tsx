"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "warehouse_staff",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Call backend API with correct parameters: email, password, full_name, role
      const response = await apiClient.register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );

      // Backend returns: { success: true, message: "User registered successfully", data: { id, email, full_name, role, token } }
      const { data } = response.data;
      const { token, id, email: userEmail, full_name, role } = data;

      // Store user info in auth store
      const user = {
        id,
        email: userEmail,
        name: full_name,
        role,
        createdAt: new Date().toISOString(),
      };

      setAuth(user, token);

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "warehouse_staff") {
        router.push("/warehouse-user");
      } else if (role === "inventory_manager") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
    >
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
            Create Account
          </h1>
          <p className="text-muted mb-8">Join StockMaster today</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="warehouse_staff">Warehouse Staff</option>
                <option value="inventory_manager">Inventory Manager</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-muted mt-1">
                Select your role in the organization
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
