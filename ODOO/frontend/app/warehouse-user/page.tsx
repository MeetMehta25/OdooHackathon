"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { WarehouseUserNav } from "@/components/warehouse-user-nav";
import { ShelvingList } from "@/components/shelving-list";
import { TransferForm } from "@/components/transfers/transfer-form";

export default function WarehouseUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("transfers");
  const [transfers, setTransfers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (activeTab === "transfers") {
      fetchTransfers();
      fetchLocations();
    }
  }, [activeTab]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTransfers();
      setTransfers(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching transfers:", err);
      setError("Failed to load transfers");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await apiClient.getLocations();
      console.log("Locations response:", response.data);

      // Filter to only include locations with valid UUID format
      const allLocations = response.data.data || [];
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validLocations = allLocations.filter((loc: any) =>
        uuidRegex.test(loc.id)
      );

      console.log(
        `Filtered ${validLocations.length} valid UUID locations from ${allLocations.length} total`
      );
      setLocations(validLocations);
    } catch (err: any) {
      console.error("Error fetching locations:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handleCreateTransfer = async (formData: any) => {
    try {
      setLoading(true);
      setError("");

      console.log("Creating transfer with data:", formData);
      console.log("Source location ID:", formData.source_location_id);
      console.log("Destination location ID:", formData.destination_location_id);
      console.log("Source ID type:", typeof formData.source_location_id);
      console.log(
        "Destination ID type:",
        typeof formData.destination_location_id
      );
      console.log(
        "Source ID value length:",
        formData.source_location_id?.length
      );
      console.log(
        "Destination ID value length:",
        formData.destination_location_id?.length
      );

      // Create transfer with source and destination location IDs
      const response = await apiClient.createTransfer({
        source_location_id: formData.source_location_id,
        destination_location_id: formData.destination_location_id,
      });

      console.log("Transfer created successfully:", response.data);

      setShowTransferForm(false);
      fetchTransfers(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating transfer:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error(
        "Error details:",
        JSON.stringify(err.response?.data, null, 2)
      );
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create transfer"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (transferId: string, newStatus: string) => {
    try {
      await apiClient.updateTransferStatus(transferId, newStatus);
      fetchTransfers(); // Refresh the list
    } catch (err: any) {
      console.error("Error updating transfer status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

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

      {error && (
        <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transfer Orders</h2>
          <button
            onClick={() => setShowTransferForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition"
          >
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    Loading transfers...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    No transfers found. Click "New Transfer" to create one.
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="border-b border-card-border hover:bg-card-hover"
                  >
                    <td className="p-3 font-mono text-sm font-medium text-primary">
                      {transfer.reference_no}
                    </td>
                    <td className="p-3 text-sm">
                      {transfer.created_by_name || "N/A"}
                    </td>
                    <td className="p-3 text-sm">
                      <span className="text-muted">
                        {transfer.source_location_name ||
                          transfer.source_warehouse_name ||
                          "N/A"}
                      </span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">
                        {transfer.destination_location_name ||
                          transfer.destination_warehouse_name ||
                          "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-semibold">
                      {transfer.total_items || 0}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                          transfer.status === "done"
                            ? "bg-green-500/10 text-green-500"
                            : transfer.status === "ready"
                            ? "bg-blue-500/10 text-blue-500"
                            : transfer.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : transfer.status === "canceled"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {transfer.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {transfer.status === "draft" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(transfer.id, "pending")
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600"
                        >
                          Start
                        </button>
                      )}
                      {transfer.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(transfer.id, "ready")
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600"
                        >
                          Mark Ready
                        </button>
                      )}
                      {transfer.status === "ready" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(transfer.id, "done")
                          }
                          className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showTransferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <TransferForm
              onClose={() => setShowTransferForm(false)}
              onSubmit={handleCreateTransfer}
              locations={locations}
            />
          </div>
        </div>
      )}
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
