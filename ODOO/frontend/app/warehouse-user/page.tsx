"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { WarehouseUserNav } from "@/components/warehouse-user-nav";
import { ShelvingList } from "@/components/shelving-list";

export default function WarehouseUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("transfers");

  useEffect(() => {
    // Redirect if not warehouse staff
    if (user && user.role !== "warehouse_staff") {
      router.push("/admin");
    }
  }, [user, router]);

  useEffect(() => {
    const tab = searchParams.get("tab") || "transfers";
    setActiveTab(tab);
  }, [searchParams]);

  const renderTransfers = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Internal Transfers
        </h1>
        <p className="text-muted mt-2">
          Move stock between warehouse locations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-muted">Pending Transfers</p>
          <p className="text-2xl font-bold text-foreground">12</p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-muted">In Transit</p>
          <p className="text-2xl font-bold text-foreground">8</p>
        </div>
        <div className="card bg-purple-500/10 border-purple-500/20">
          <p className="text-sm text-muted">Completed Today</p>
          <p className="text-2xl font-bold text-foreground">24</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transfer Orders</h2>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition">
            New Transfer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left p-3 text-sm font-semibold">
                  Transfer ID
                </th>
                <th className="text-left p-3 text-sm font-semibold">Product</th>
                <th className="text-left p-3 text-sm font-semibold">
                  From → To
                </th>
                <th className="text-left p-3 text-sm font-semibold">
                  Quantity
                </th>
                <th className="text-left p-3 text-sm font-semibold">Status</th>
                <th className="text-left p-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "TR-001",
                  product: "Steel Rods",
                  from: "A-01",
                  to: "B-05",
                  qty: 50,
                  status: "pending",
                },
                {
                  id: "TR-002",
                  product: "Bearings",
                  from: "C-02",
                  to: "A-03",
                  qty: 120,
                  status: "in-transit",
                },
                {
                  id: "TR-003",
                  product: "Fasteners",
                  from: "B-04",
                  to: "C-01",
                  qty: 200,
                  status: "completed",
                },
              ].map((transfer) => (
                <tr
                  key={transfer.id}
                  className="border-b border-card-border hover:bg-card-hover"
                >
                  <td className="p-3 font-mono text-sm font-medium text-primary">
                    {transfer.id}
                  </td>
                  <td className="p-3 text-sm">{transfer.product}</td>
                  <td className="p-3 text-sm">
                    <span className="text-muted">{transfer.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{transfer.to}</span>
                  </td>
                  <td className="p-3 text-sm font-semibold">{transfer.qty}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        transfer.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : transfer.status === "in-transit"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {transfer.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-3">
                    {transfer.status === "pending" && (
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600">
                        Start
                      </button>
                    )}
                    {transfer.status === "in-transit" && (
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPicking = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Picking Operations
        </h1>
        <p className="text-muted mt-2">Pick items for outbound deliveries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-muted">To Pick</p>
          <p className="text-2xl font-bold text-foreground">18</p>
        </div>
        <div className="card bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-muted">In Progress</p>
          <p className="text-2xl font-bold text-foreground">5</p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-muted">Ready to Ship</p>
          <p className="text-2xl font-bold text-foreground">12</p>
        </div>
        <div className="card bg-purple-500/10 border-purple-500/20">
          <p className="text-sm text-muted">Picked Today</p>
          <p className="text-2xl font-bold text-foreground">32</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Pick Lists</h2>
        <div className="space-y-3">
          {[
            {
              id: "PL-001",
              customer: "ABC Corp",
              items: 15,
              priority: "high",
              status: "pending",
            },
            {
              id: "PL-002",
              customer: "XYZ Ltd",
              items: 8,
              priority: "medium",
              status: "picking",
            },
            {
              id: "PL-003",
              customer: "DEF Inc",
              items: 22,
              priority: "low",
              status: "ready",
            },
          ].map((pick) => (
            <div
              key={pick.id}
              className="flex items-center justify-between p-4 border border-card-border rounded-lg hover:bg-card-hover transition"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">
                    {pick.id}
                  </p>
                  <p className="text-sm text-muted">{pick.customer}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">{pick.items} items</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      pick.priority === "high"
                        ? "bg-red-500/10 text-red-500"
                        : pick.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {pick.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${
                    pick.status === "ready"
                      ? "bg-green-500/10 text-green-500"
                      : pick.status === "picking"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {pick.status}
                </span>
                {pick.status === "pending" && (
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
                    Start Picking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCounting = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock Counting</h1>
        <p className="text-muted mt-2">
          Physical inventory verification and cycle counting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-muted">Scheduled Counts</p>
          <p className="text-2xl font-bold text-foreground">6</p>
        </div>
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-muted">In Progress</p>
          <p className="text-2xl font-bold text-foreground">3</p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-muted">Completed This Week</p>
          <p className="text-2xl font-bold text-foreground">15</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Count Sessions</h2>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition">
            New Count
          </button>
        </div>
        <div className="space-y-3">
          {[
            {
              id: "CNT-001",
              zone: "Zone A",
              items: 45,
              counted: 32,
              variance: "+2",
              status: "in-progress",
            },
            {
              id: "CNT-002",
              zone: "Zone B",
              items: 38,
              counted: 38,
              variance: "0",
              status: "completed",
            },
            {
              id: "CNT-003",
              zone: "Zone C",
              items: 52,
              counted: 0,
              variance: "-",
              status: "scheduled",
            },
          ].map((count) => (
            <div
              key={count.id}
              className="p-4 border border-card-border rounded-lg hover:bg-card-hover transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary">
                    {count.id}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    {count.zone} • {count.items} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted">Progress</p>
                    <p className="text-sm font-semibold">
                      {count.counted}/{count.items}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted">Variance</p>
                    <p
                      className={`text-sm font-semibold ${
                        count.variance === "0"
                          ? "text-green-500"
                          : count.variance === "-"
                          ? "text-muted"
                          : "text-yellow-500"
                      }`}
                    >
                      {count.variance}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${
                      count.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : count.status === "in-progress"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {count.status.replace("-", " ")}
                  </span>
                  {count.status === "scheduled" && (
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
                      Start
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <WarehouseUserNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {activeTab === "transfers" && renderTransfers()}
          {activeTab === "picking" && renderPicking()}
          {activeTab === "counting" && renderCounting()}
          {activeTab === "shelving" && <ShelvingList />}
        </div>
      </main>
    </>
  );
}
