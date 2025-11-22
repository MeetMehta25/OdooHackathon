"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/TopNav"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission } from "@/lib/permissions"
import { User, Bell, Shield, Palette, Database, Save, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuthStore()
  const isAdmin = hasPermission(user?.role, "manage_users")
  const [activeSection, setActiveSection] = useState("profile")

  // Load settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notificationSettings")
    const savedAppSettings = localStorage.getItem("appSettings")
    const savedSystemSettings = localStorage.getItem("systemSettings")

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
    if (savedAppSettings) {
      setAppSettings(JSON.parse(savedAppSettings))
    }
    if (savedSystemSettings && isAdmin) {
      setSystemSettings(JSON.parse(savedSystemSettings))
    }
  }, [isAdmin])

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    receiptAlerts: true,
    deliveryAlerts: true,
    transferAlerts: false,
  })

  // Application Settings
  const [appSettings, setAppSettings] = useState({
    itemsPerPage: 25,
    autoRefresh: true,
    refreshInterval: 30,
    dateFormat: "YYYY-MM-DD",
    currency: "INR",
  })

  // System Settings (Admin only)
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    sessionTimeout: 60,
    backupFrequency: "daily",
  })

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    if (profileData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!")
      return
    }
    // Handle password change
    alert("Password changed successfully!")
    setProfileData({
      ...profileData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleNotificationsSave = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notifications))
    alert("Notification settings saved!")
  }

  const handleAppSettingsSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(appSettings))
    alert("Application settings saved!")
  }

  const handleSystemSettingsSave = () => {
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings))
    alert("System settings saved!")
  }

  return (
    <>
      <TopNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-muted mt-2">Manage your account and application preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <nav className="space-y-1">
                  <button
                    onClick={() => scrollToSection("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                      activeSection === "profile"
                        ? "bg-primary text-white"
                        : "hover:bg-muted-bg text-foreground"
                    }`}
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                      activeSection === "notifications"
                        ? "bg-primary text-white"
                        : "hover:bg-muted-bg text-foreground"
                    }`}
                  >
                    <Bell size={20} />
                    <span className="font-medium">Notifications</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("application")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                      activeSection === "application"
                        ? "bg-primary text-white"
                        : "hover:bg-muted-bg text-foreground"
                    }`}
                  >
                    <Palette size={20} />
                    <span className="font-medium">Application</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => scrollToSection("system")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                        activeSection === "system"
                          ? "bg-primary text-white"
                          : "hover:bg-muted-bg text-foreground"
                      }`}
                    >
                      <Shield size={20} />
                      <span className="font-medium">System</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => scrollToSection("database")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left ${
                        activeSection === "database"
                          ? "bg-primary text-white"
                          : "hover:bg-muted-bg text-foreground"
                      }`}
                    >
                      <Database size={20} />
                      <span className="font-medium">Database</span>
                    </button>
                  )}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <section id="profile" className="card">
                <div className="flex items-center gap-3 mb-6">
                  <User size={24} />
                  <h2 className="text-2xl font-bold">Profile Settings</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value={user?.role.replace("_", " ").toUpperCase() || ""}
                      className="input-field w-full"
                      disabled
                      readOnly
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    <Save size={18} />
                    Save Profile Changes
                  </button>
                </form>

                {/* Password Change */}
                <div className="mt-8 pt-8 border-t border-card-border">
                  <h3 className="text-lg font-bold mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={profileData.currentPassword}
                          onChange={(e) =>
                            setProfileData({ ...profileData, currentPassword: e.target.value })
                          }
                          className="input-field w-full pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        className="input-field w-full"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) =>
                          setProfileData({ ...profileData, confirmPassword: e.target.value })
                        }
                        className="input-field w-full"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="btn-primary">
                      <Save size={18} />
                      Change Password
                    </button>
                  </form>
                </div>
              </section>

              {/* Notification Settings */}
              <section id="notifications" className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Bell size={24} />
                  <h2 className="text-2xl font-bold">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailNotifications: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted">Get notified when stock levels are low</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.lowStockAlerts}
                        onChange={(e) =>
                          setNotifications({ ...notifications, lowStockAlerts: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Receipt Alerts</p>
                      <p className="text-sm text-muted">Notifications for incoming receipts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.receiptAlerts}
                        onChange={(e) =>
                          setNotifications({ ...notifications, receiptAlerts: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Delivery Alerts</p>
                      <p className="text-sm text-muted">Notifications for outgoing deliveries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.deliveryAlerts}
                        onChange={(e) =>
                          setNotifications({ ...notifications, deliveryAlerts: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Transfer Alerts</p>
                      <p className="text-sm text-muted">Notifications for stock transfers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.transferAlerts}
                        onChange={(e) =>
                          setNotifications({ ...notifications, transferAlerts: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <button onClick={handleNotificationsSave} className="btn-primary mt-6">
                  <Save size={18} />
                  Save Notification Settings
                </button>
              </section>

              {/* Application Settings */}
              <section id="application" className="card">
                <div className="flex items-center gap-3 mb-6">
                  <Palette size={24} />
                  <h2 className="text-2xl font-bold">Application Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Items Per Page</label>
                      <select
                        value={appSettings.itemsPerPage}
                        onChange={(e) =>
                          setAppSettings({ ...appSettings, itemsPerPage: Number(e.target.value) })
                        }
                        className="input-field w-full"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date Format</label>
                      <select
                        value={appSettings.dateFormat}
                        onChange={(e) => setAppSettings({ ...appSettings, dateFormat: e.target.value })}
                        className="input-field w-full"
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Currency</label>
                      <select
                        value={appSettings.currency}
                        onChange={(e) => setAppSettings({ ...appSettings, currency: e.target.value })}
                        className="input-field w-full"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Auto Refresh Interval (seconds)</label>
                      <input
                        type="number"
                        value={appSettings.refreshInterval}
                        onChange={(e) =>
                          setAppSettings({ ...appSettings, refreshInterval: Number(e.target.value) })
                        }
                        className="input-field w-full"
                        min={10}
                        max={300}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                    <div>
                      <p className="font-medium">Auto Refresh</p>
                      <p className="text-sm text-muted">Automatically refresh data at intervals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appSettings.autoRefresh}
                        onChange={(e) =>
                          setAppSettings({ ...appSettings, autoRefresh: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <button onClick={handleAppSettingsSave} className="btn-primary mt-6">
                  <Save size={18} />
                  Save Application Settings
                </button>
              </section>

              {/* System Settings (Admin Only) */}
              {isAdmin && (
                <section id="system" className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield size={24} />
                    <h2 className="text-2xl font-bold">System Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted">Put the system in maintenance mode</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted-bg rounded-lg">
                      <div>
                        <p className="font-medium">Allow User Registrations</p>
                        <p className="text-sm text-muted">Allow new users to register</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.allowRegistrations}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, allowRegistrations: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, sessionTimeout: Number(e.target.value) })
                          }
                          className="input-field w-full"
                          min={5}
                          max={480}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                        <select
                          value={systemSettings.backupFrequency}
                          onChange={(e) =>
                            setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })
                          }
                          className="input-field w-full"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSystemSettingsSave} className="btn-primary mt-6">
                    <Save size={18} />
                    Save System Settings
                  </button>
                </section>
              )}

              {/* Database Settings (Admin Only) */}
              {isAdmin && (
                <section id="database" className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <Database size={24} />
                    <h2 className="text-2xl font-bold">Database Management</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted-bg rounded-lg">
                      <p className="font-medium mb-2">Database Status</p>
                      <p className="text-sm text-muted">Connected and operational</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="btn-secondary">
                        <Database size={18} />
                        Create Backup
                      </button>
                      <button className="btn-secondary">
                        <Database size={18} />
                        Restore Backup
                      </button>
                    </div>

                    <div className="pt-4 border-t border-card-border">
                      <p className="text-sm text-muted mb-4">
                        Database operations are critical. Please ensure you have proper backups before
                        performing any restore operations.
                      </p>
                      <button className="btn-secondary text-error hover:bg-error/10">
                        <Database size={18} />
                        Export Database
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

