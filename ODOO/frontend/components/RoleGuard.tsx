"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { canAccessPage } from "@/lib/permissions"

interface RoleGuardProps {
  children: React.ReactNode
  page: string
  fallback?: React.ReactNode
}

export function RoleGuard({ children, page, fallback }: RoleGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Wait for auth to load from storage
    const timer = setTimeout(() => {
      setHasChecked(true)
      
      // Only redirect if we're not already on login page
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login")
        return
      }

      // Only redirect if user exists and doesn't have access, and we're not already redirecting
      if (user && !canAccessPage(user.role, page) && pathname !== "/dashboard") {
        router.push("/dashboard")
        return
      }

      setIsChecking(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, page, router, pathname])

  // Show loading only on initial check
  if (!hasChecked || (isChecking && !isAuthenticated)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, let the redirect happen (don't render children)
  if (!isAuthenticated || !user) {
    return null
  }

  // If user doesn't have access, show access denied
  if (!canAccessPage(user.role, page)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted">You don't have permission to access this page.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

