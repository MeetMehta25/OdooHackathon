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
      // Mock login for testing - admin/admin
      if (email.toLowerCase() === "admin" && password === "admin") {
        const mockUser = {
          id: "1",
          email: "admin@stockmaster.com",
          name: "Admin User",
          role: "admin" as const,
          createdAt: new Date().toISOString(),
        };
        const mockToken = "mock-jwt-token-" + Date.now();
        setAuth(mockUser, mockToken);
        router.push("/admin");
        setLoading(false);
        return;
      }

      // Mock login for testing - warehouse/warehouse (warehouse staff)
      if (email.toLowerCase() === "warehouse" && password === "warehouse") {
        const mockUser = {
          id: "2",
          email: "warehouse@stockmaster.com",
          name: "Warehouse Staff",
          role: "warehouse_staff" as const,
          createdAt: new Date().toISOString(),
        };
        const mockToken = "mock-jwt-token-warehouse-" + Date.now();
        setAuth(mockUser, mockToken);
        router.push("/warehouse-user");
        setLoading(false);
        return;
      }

      // Mock login for testing - manager/manager (inventory manager)
      if (email.toLowerCase() === "manager" && password === "manager") {
        const mockUser = {
          id: "3",
          email: "manager@stockmaster.com",
          name: "Inventory Manager",
          role: "inventory_manager" as const,
          createdAt: new Date().toISOString(),
        };
        const mockToken = "mock-jwt-token-manager-" + Date.now();
        setAuth(mockUser, mockToken);
        router.push("/dashboard");
        setLoading(false);
        return;
      }

      // Try API login for other users
      const response = await apiClient.login(email, password);
      const { token, user } = response.data;
      setAuth(user, token);

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "warehouse_staff") {
        router.push("/warehouse-user");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Try admin/admin, warehouse/warehouse, or manager/manager for testing."
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
<<<<<<< HEAD
        <div className="card glass-card">
          <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">Welcome to StockMaster</h1>
          <p className="text-muted mb-8">Manage your inventory with precision</p>
          
            <div className="mb-4 space-y-3">
            <div className="p-3 bg-info/10 border border-info/20 rounded-md text-sm backdrop-blur-sm">
=======
        <div className="card">
          <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">
            Welcome to StockMaster
          </h1>
          <p className="text-muted mb-8">
            Manage your inventory with precision
          </p>

          <div className="mb-4 space-y-3">
            <div className="p-3 bg-info/10 border border-info/20 rounded-md text-sm">
>>>>>>> 3bf3d6847e77c1b28f79bf8ef8e9a040ff4be9a9
              <p className="font-medium text-info mb-2">Test Credentials:</p>
              <div className="space-y-1">
                <div>
                  <p className="text-muted text-xs mb-1">
                    Admin (Full Access):
                  </p>
                  <p className="text-muted">
                    Username: <span className="font-mono">admin</span> |
                    Password: <span className="font-mono">admin</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-info/20">
                  <p className="text-muted text-xs mb-1">
                    Warehouse Staff (Limited Access):
                  </p>
                  <p className="text-muted">
                    Username: <span className="font-mono">warehouse</span> |
                    Password: <span className="font-mono">warehouse</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-info/20">
                  <p className="text-muted text-xs mb-1">
                    Inventory Manager (Management Access):
                  </p>
                  <p className="text-muted">
                    Username: <span className="font-mono">manager</span> |
                    Password: <span className="font-mono">manager</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
<<<<<<< HEAD
              <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm backdrop-blur-sm">{error}</div>
=======
              <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm">
                {error}
              </div>
>>>>>>> 3bf3d6847e77c1b28f79bf8ef8e9a040ff4be9a9
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin / warehouse (for testing) or you@example.com"
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

          <div className="mt-6 pt-6 border-t border-white/20 space-y-2 text-center text-sm">
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
