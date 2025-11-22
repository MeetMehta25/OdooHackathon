"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await apiClient.forgotPassword(email)
      setSuccess("OTP sent to your email")
      setStep("otp")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await apiClient.verifyOTP(email, otp, newPassword)
      setSuccess("Password reset successfully")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
    >
      <div className="w-full max-w-md">
        <div className="card glass-card">
          <h1 className="text-3xl font-bold mb-2 text-foreground text-balance">Reset Password</h1>
          <p className="text-muted mb-8">Enter your email to receive an OTP</p>

          <form onSubmit={step === "email" ? handleSendOTP : handleVerifyOTP} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm backdrop-blur-sm">{error}</div>
            )}

            {success && (
              <div className="bg-success/10 border border-success text-success px-4 py-2 rounded-md text-sm backdrop-blur-sm">
                {success}
              </div>
            )}

            {step === "email" ? (
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
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Processing..." : step === "email" ? "Send OTP" : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-muted">
            <Link href="/login" className="text-primary hover:text-primary-light">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
