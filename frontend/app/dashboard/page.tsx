"use client"

import { useState } from "react"
import { TopNav } from "@/components/TopNav"
import { StatCard } from "@/components/stat-card"
import { ActivityFeed } from "@/components/activity-feed"
import { StockChart } from "@/components/stock-chart"
import { AlertsList } from "@/components/alerts-list"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 1234,
    lowStockItems: 42,
    pendingReceipts: 8,
    activeWarehouses: 5,
    totalStockValue: "₹2.5M",
    movements24h: 156,
  })

  return (
    <>
      <TopNav />
      <main className="pt-4 md:pt-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground text-balance">Dashboard</h1>
            <p className="text-muted mt-2">Welcome back! Here's your inventory overview.</p>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              change="+2.5%"
              icon="📦"
              color="primary"
            />
            <StatCard
              title="Low Stock Items"
              value={stats.lowStockItems}
              change="-5 this week"
              icon="⚠️"
              color="warning"
            />
            <StatCard title="Pending Receipts" value={stats.pendingReceipts} change="+3 today" icon="📥" color="info" />
            <StatCard
              title="Active Warehouses"
              value={stats.activeWarehouses}
              change="All operational"
              icon="🏭"
              color="success"
            />
          </div>

          {/* Charts & Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <StockChart />
            </div>
            <div>
              <AlertsList />
            </div>
          </div>

          {/* Activity & Inventory Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed />
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Inventory Summary</h2>
              <div className="space-y-4">
                {[
                  { category: "Electronics", count: 456, value: "₹85.2L" },
                  { category: "Raw Materials", count: 789, value: "₹42.5L" },
                  { category: "Finished Goods", count: "234", value: "₹120.8L" },
                  { category: "Packaging", count: "155", value: "₹12.3L" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-card-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-xs text-muted">{item.count} items</p>
                    </div>
                    <p className="font-semibold text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
