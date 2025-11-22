"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { WarehouseUserNav } from "@/components/warehouse-user-nav";
import { ShelvingList } from "@/components/shelving-list";
import { TransferForm } from "@/components/transfers/transfer-form";
import { CountingForm } from "@/components/counting/counting-form";

export default function WarehouseUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("transfers");
  const [transfers, setTransfers] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showCountingForm, setShowCountingForm] = useState(false);
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
    } else if (activeTab === "picking") {
      fetchDeliveries();
    } else if (activeTab === "counting") {
      fetchAdjustments();
      fetchLocations();
      fetchProducts();
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

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getDeliveries();
      console.log("Deliveries response:", response.data);

      // Filter to only include deliveries with valid UUID format
      const allDeliveries = response.data.data || [];
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validDeliveries = allDeliveries.filter((del: any) =>
        uuidRegex.test(del.id)
      );

      console.log(
        `Filtered ${validDeliveries.length} valid UUID deliveries from ${allDeliveries.length} total`
      );
      setDeliveries(validDeliveries);
    } catch (err: any) {
      console.error("Error fetching deliveries:", err);
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleStartPicking = async (deliveryId: string) => {
    try {
      setLoading(true);
      await apiClient.updateDeliveryStatus(deliveryId, "ready");
      fetchDeliveries(); // Refresh the list
    } catch (err: any) {
      console.error("Error starting picking:", err);
      setError(err.response?.data?.message || "Failed to start picking");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjustments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdjustments();
      console.log("Adjustments response:", response.data);

      // Filter to only include adjustments with valid UUID format
      const allAdjustments = response.data.data || [];
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validAdjustments = allAdjustments.filter((adj: any) =>
        uuidRegex.test(adj.id)
      );

      console.log(
        `Filtered ${validAdjustments.length} valid UUID adjustments from ${allAdjustments.length} total`
      );
      setAdjustments(validAdjustments);
    } catch (err: any) {
      console.error("Error fetching adjustments:", err);
      setError("Failed to load adjustments");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts();
      console.log("Products response:", response.data);

      // Filter to only include products with valid UUID format
      const allProducts = response.data.data || [];
      console.log("All products fetched:", allProducts);

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validProducts = allProducts.filter((prod: any) =>
        uuidRegex.test(prod.id)
      );

      console.log(
        `Filtered ${validProducts.length} valid UUID products from ${allProducts.length} total`
      );
      console.log("Valid products:", validProducts);
      setProducts(validProducts);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handleCreateAdjustment = async (formData: any) => {
    try {
      setLoading(true);
      setError("");

      console.log("Creating adjustment with data:", formData);

      const response = await apiClient.createAdjustment({
        product_id: formData.product_id,
        location_id: formData.location_id,
        counted_quantity: formData.counted_quantity,
        previous_quantity: formData.previous_quantity,
        reason: formData.reason || "Physical count",
      });

      console.log("Adjustment created successfully:", response.data);
      setShowCountingForm(false);
      fetchAdjustments(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating adjustment:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create adjustment"
      );
    } finally {
      setLoading(false);
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
        <h2 className="text-xl font-semibold mb-6">Pick Lists (Deliveries)</h2>
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-muted">
              Loading deliveries...
            </div>
          ) : deliveries.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No deliveries found.
            </div>
          ) : (
            deliveries.map((pick) => (
              <div
                key={pick.id}
                className="flex items-center justify-between p-4 border border-card-border rounded-lg hover:bg-card-hover transition"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary">
                      {pick.delivery_number || pick.id}
                    </p>
                    <p className="text-sm text-muted">
                      {pick.customer_name || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">
                      {pick.total_items || 0} items
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
                    <button
                      onClick={() => handleStartPicking(pick.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      Start Picking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
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
          <p className="text-sm text-muted">Total Adjustments</p>
          <p className="text-2xl font-bold text-foreground">
            {adjustments.length}
          </p>
        </div>
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-muted">Products</p>
          <p className="text-2xl font-bold text-foreground">
            {products.length}
          </p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-muted">Locations</p>
          <p className="text-2xl font-bold text-foreground">
            {locations.length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Stock Adjustments</h2>
          <button
            onClick={() => {
              // Fetch fresh data when opening the form
              if (products.length === 0) fetchProducts();
              if (locations.length === 0) fetchLocations();
              setShowCountingForm(true);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            New Count
          </button>
        </div>
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-muted">
              Loading adjustments...
            </div>
          ) : adjustments.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No stock adjustments found. Create your first count to track
              inventory accuracy.
            </div>
          ) : (
            adjustments.map((adj) => (
              <div
                key={adj.id}
                className="p-4 border border-card-border rounded-lg hover:bg-card-hover transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold text-primary">
                      {adj.product_name} ({adj.sku})
                    </p>
                    <p className="text-sm text-muted mt-1">
                      {adj.warehouse_name} - {adj.location_name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      By: {adj.created_by_name} •{" "}
                      {new Date(adj.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted">Previous</p>
                      <p className="text-sm font-semibold">
                        {adj.previous_quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">Counted</p>
                      <p className="text-sm font-semibold">
                        {adj.counted_quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">Difference</p>
                      <p
                        className={`text-sm font-semibold ${
                          adj.difference === 0
                            ? "text-green-500"
                            : adj.difference > 0
                            ? "text-blue-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {adj.difference > 0 ? "+" : ""}
                        {adj.difference}
                      </p>
                    </div>
                    {adj.reason && (
                      <div className="text-right max-w-[200px]">
                        <p className="text-sm text-muted">Reason</p>
                        <p className="text-xs text-muted truncate">
                          {adj.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TransferForm
              locations={locations}
              onClose={() => setShowTransferForm(false)}
              onSubmit={handleCreateTransfer}
            />
          </div>
        </div>
      )}

      {/* Counting Form Modal */}
      {showCountingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CountingForm
              products={products}
              locations={locations}
              onClose={() => setShowCountingForm(false)}
              onSubmit={handleCreateAdjustment}
            />
          </div>
        </div>
      )}
    </>
  );
}
