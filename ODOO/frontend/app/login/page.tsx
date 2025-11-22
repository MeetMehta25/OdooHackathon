"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend API for login
      const response = await apiClient.login(email, password);

      // Backend returns: { success: true, message: "Login successful", data: { id, email, full_name, role, token } }
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
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
            Welcome to StockMaster
          </h1>
          <p className="text-muted mb-8">
            Manage your inventory with precision
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-card-border space-y-2 text-center text-sm">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary-light"
              >
                Sign up
              </Link>
            </p>
            <p>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary-light"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
