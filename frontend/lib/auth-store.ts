import { create } from "zustand"
import type { User } from "@/types"

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user: User, token: string) => {
    set({ user, token, isAuthenticated: true })
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    }
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  },
  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")
      if (token && user) {
        set({ token, user: JSON.parse(user), isAuthenticated: true })
      }
    }
  },
}))
