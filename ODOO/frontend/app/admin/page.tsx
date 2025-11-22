"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { AdminNav } from "@/components/admin-nav";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { StockChart } from "@/components/stock-chart";
import { AlertsList } from "@/components/alerts-list";
import { Search, Download, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  columns as inventoryColumns,
  InventoryItem,
} from "@/components/inventory/columns";
import {
  columns as receiptColumns,
  Receipt,
} from "@/components/receipts/columns";
import {
  columns as deliveryColumns,
  Delivery,
} from "@/components/deliveries/columns";
import {
  columns as ledgerColumns,
  LedgerEntry,
} from "@/components/ledger/columns";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { ReceiptForm } from "@/components/receipts/receipt-form";
import { DeliveryForm } from "@/components/deliveries/delivery-form";
import { WarehouseForm } from "@/components/warehouses/warehouse-form";
import { hasPermission } from "@/lib/permissions";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== "admin") {
      router.push("/warehouse-user");
    }
  }, [user, router]);

  useEffect(() => {
    const tab = searchParams.get("tab") || "dashboard";
    setActiveTab(tab);
  }, [searchParams]);

  const [stats, setStats] = useState({
    totalProducts: 1234,
    lowStockItems: 42,
    pendingReceipts: 8,
    activeWarehouses: 5,
    totalStockValue: "₹2.5M",
    movements24h: 156,
  });

  // Warehouses state
  const [warehouses, setWarehouses] = useState([
    {
      id: "1",
      name: "Main Warehouse",
      location: "Mumbai",
      capacity: "85%",
      items: 4520,
      status: "active",
    },
    {
      id: "2",
      name: "North Hub",
      location: "Delhi",
      capacity: "62%",
      items: 3210,
      status: "active",
    },
    {
      id: "3",
      name: "South Depot",
      location: "Bangalore",
      capacity: "78%",
      items: 2890,
      status: "active",
    },
  ]);

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      product: "Widget Pro",
      sku: "SKU-001",
      warehouse: "Main WH",
      location: "A1",
      quantity: 245,
      reorderLevel: 50,
      status: "in-stock",
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      product: "Gadget X",
      sku: "SKU-002",
      warehouse: "Main WH",
      location: "A2",
      quantity: 12,
      reorderLevel: 50,
      status: "low",
      lastUpdate: "1 hour ago",
    },
    {
      id: "3",
      product: "Component Y",
      sku: "SKU-003",
      warehouse: "Secondary",
      location: "B1",
      quantity: 0,
      reorderLevel: 100,
      status: "out",
      lastUpdate: "30 minutes ago",
    },
  ]);

  // Receipts state
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: "1",
      number: "REC-2024-001",
      supplier: "ABC Suppliers",
      status: "done",
      expectedDate: "2024-12-15",
      items: 5,
      createdDate: "2024-12-10",
    },
    {
      id: "2",
      number: "REC-2024-002",
      supplier: "XYZ Corp",
      status: "ready",
      expectedDate: "2024-12-18",
      items: 3,
      createdDate: "2024-12-12",
    },
    {
      id: "3",
      number: "REC-2024-003",
      supplier: "Global Supply",
      status: "pending",
      expectedDate: "2024-12-20",
      items: 8,
      createdDate: "2024-12-14",
    },
  ]);

  // Deliveries state
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "1",
      number: "DEL-2024-001",
      customer: "Customer A Ltd",
      status: "done",
      expectedDate: "2024-12-15",
      items: 4,
      createdDate: "2024-12-10",
    },
    {
      id: "2",
      number: "DEL-2024-002",
      customer: "Business Corp",
      status: "ready",
      expectedDate: "2024-12-17",
      items: 6,
      createdDate: "2024-12-12",
    },
    {
      id: "3",
      number: "DEL-2024-003",
      customer: "Retail Store",
      status: "pending",
      expectedDate: "2024-12-19",
      items: 2,
      createdDate: "2024-12-14",
    },
  ]);

  // Ledger state
  const [ledger] = useState<LedgerEntry[]>([
    {
      id: "1",
      date: "2024-12-14",
      document: "REC-2024-001",
      type: "receipt",
      product: "Widget Pro",
      warehouse: "Main WH",
      before: 200,
      movement: 50,
      after: 250,
      notes: "Stock received from supplier",
    },
    {
      id: "2",
      date: "2024-12-14",
      document: "DEL-2024-001",
      type: "delivery",
      product: "Widget Pro",
      warehouse: "Main WH",
      before: 250,
      movement: -30,
      after: 220,
      notes: "Order shipped to customer",
    },
    {
      id: "3",
      date: "2024-12-13",
      document: "TRF-2024-001",
      type: "transfer",
      product: "Gadget X",
      warehouse: "Secondary WH",
      before: 100,
      movement: 25,
      after: 125,
      notes: "Transfer from Main WH",
    },
  ]);

  // Form states
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [viewingInventoryItem, setViewingInventoryItem] =
    useState<InventoryItem | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [viewingDelivery, setViewingDelivery] = useState<Delivery | null>(null);

  // Search and filter states
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [receiptSearch, setReceiptSearch] = useState("");
  const [receiptFilter, setReceiptFilter] = useState("all");
  const [deliverySearch, setDeliverySearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerFilter, setLedgerFilter] = useState("all");

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground text-balance">
          Admin Dashboard
        </h1>
        <p className="text-muted mt-2">
          Complete inventory overview and management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <StatCard
          title="Pending Receipts"
          value={stats.pendingReceipts}
          change="+3 today"
          icon="📥"
          color="info"
        />
        <StatCard
          title="Active Warehouses"
          value={stats.activeWarehouses}
          change="All operational"
          icon="🏭"
          color="success"
        />
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart />
        </div>
        <AlertsList />
      </div>

      {/* Activity + Inventory Summary */}
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
  );

  const renderWarehouses = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
        <p className="text-muted mt-2">
          Manage warehouse locations and capacity
        </p>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Warehouses</h2>
          <button
            onClick={() => setShowWarehouseForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Add Warehouse
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="card hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{warehouse.name}</h3>
              <p className="text-sm text-muted mb-4">{warehouse.location}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Capacity</span>
                  <span className="font-semibold">{warehouse.capacity}</span>
                </div>
                <div className="w-full bg-card-border rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: warehouse.capacity }}
                  />
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-muted">Items</span>
                  <span className="font-semibold">{warehouse.items}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => {
    const canAdjust = hasPermission(user?.role, "adjust_inventory");

    const filteredInventory = inventory.filter((item) => {
      const matchesSearch =
        item.product.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesStatus =
        inventoryFilter === "all" || item.status === inventoryFilter;
      return matchesSearch && matchesStatus;
    });

    const handleAdjustStock = () => {
      setViewingInventoryItem(null);
      setShowInventoryForm(true);
    };

    const handleView = (item: InventoryItem) => {
      setViewingInventoryItem(item);
      setShowInventoryForm(true);
    };

    const handleDeleteSelected = (selectedIds: string[]) => {
      if (
        confirm(
          `Are you sure you want to delete ${selectedIds.length} item(s)?`
        )
      ) {
        setInventory((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
      }
    };

    const handleFormClose = () => {
      setShowInventoryForm(false);
      setViewingInventoryItem(null);
    };

    const handleFormSubmit = (formData: Partial<InventoryItem>) => {
      if (viewingInventoryItem) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === viewingInventoryItem.id
              ? {
                  ...item,
                  ...formData,
                  status:
                    (formData.quantity || 0) === 0
                      ? "out"
                      : (formData.quantity || 0) < (formData.reorderLevel || 0)
                      ? "low"
                      : "in-stock",
                  lastUpdate: "Just now",
                }
              : item
          )
        );
      }
      handleFormClose();
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted mt-2">
            Real-time stock levels across all locations
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search by product or SKU..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={inventoryFilter}
            onChange={(e) => setInventoryFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          {canAdjust && (
            <button
              onClick={handleAdjustStock}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus size={16} />
              Adjust Stock
            </button>
          )}
        </div>

        <div className="card">
          <DataTable
            columns={inventoryColumns({ onView: handleView })}
            data={filteredInventory}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>

        {showInventoryForm && (
          <InventoryForm
            item={viewingInventoryItem}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    );
  };

  const renderReceipts = () => {
    const canCreate = hasPermission(user?.role, "create_receipts");
    const canEdit = hasPermission(user?.role, "edit_receipts");
    const canDelete = hasPermission(user?.role, "delete_receipts");

    const filteredReceipts = receipts.filter((r) => {
      const matchesSearch =
        r.number.toLowerCase().includes(receiptSearch.toLowerCase()) ||
        r.supplier.toLowerCase().includes(receiptSearch.toLowerCase());
      const matchesStatus =
        receiptFilter === "all" || r.status === receiptFilter;
      return matchesSearch && matchesStatus;
    });

    const handleNewReceipt = () => {
      setEditingReceipt(null);
      setShowReceiptForm(true);
    };

    const handleView = (receipt: Receipt) => {
      setViewingReceipt(receipt);
      setShowReceiptForm(true);
    };

    const handleEdit = (receipt: Receipt) => {
      setEditingReceipt(receipt);
      setViewingReceipt(null);
      setShowReceiptForm(true);
    };

    const handleDelete = (receipt: Receipt) => {
      if (
        confirm(`Are you sure you want to delete receipt ${receipt.number}?`)
      ) {
        setReceipts((prev) => prev.filter((r) => r.id !== receipt.id));
      }
    };

    const handleDeleteSelected = (selectedIds: string[]) => {
      if (
        confirm(
          `Are you sure you want to delete ${selectedIds.length} receipt(s)?`
        )
      ) {
        setReceipts((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      }
    };

    const handleFormClose = () => {
      setShowReceiptForm(false);
      setEditingReceipt(null);
      setViewingReceipt(null);
    };

    const handleFormSubmit = (formData: Partial<Receipt>) => {
      if (editingReceipt) {
        setReceipts((prev) =>
          prev.map((r) =>
            r.id === editingReceipt.id ? { ...r, ...formData } : r
          )
        );
      } else {
        const newReceipt: Receipt = {
          id: String(receipts.length + 1),
          number: `REC-2024-${String(receipts.length + 1).padStart(3, "0")}`,
          createdDate: new Date().toISOString().split("T")[0],
          ...(formData as Omit<Receipt, "id" | "number" | "createdDate">),
        };
        setReceipts((prev) => [...prev, newReceipt]);
      }
      handleFormClose();
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
          <p className="text-muted mt-2">Incoming stock and purchase orders</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search by number or supplier..."
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={receiptFilter}
            onChange={(e) => setReceiptFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
          </select>
          {canCreate && (
            <button
              onClick={handleNewReceipt}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus size={16} />
              New Receipt
            </button>
          )}
        </div>

        <div className="card">
          <DataTable
            columns={receiptColumns({
              onView: handleView,
              onEdit: canEdit ? handleEdit : undefined,
              onDelete: canDelete ? handleDelete : undefined,
            })}
            data={filteredReceipts}
            onDeleteSelected={canDelete ? handleDeleteSelected : undefined}
          />
        </div>

        {showReceiptForm && (
          <ReceiptForm
            receipt={editingReceipt || viewingReceipt}
            viewOnly={!!viewingReceipt}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    );
  };

  const renderDeliveries = () => {
    const canCreate = hasPermission(user?.role, "create_deliveries");
    const canEdit = hasPermission(user?.role, "edit_deliveries");
    const canDelete = hasPermission(user?.role, "delete_deliveries");

    const filteredDeliveries = deliveries.filter((d) => {
      const matchesSearch =
        d.number.toLowerCase().includes(deliverySearch.toLowerCase()) ||
        d.customer.toLowerCase().includes(deliverySearch.toLowerCase());
      const matchesStatus =
        deliveryFilter === "all" || d.status === deliveryFilter;
      return matchesSearch && matchesStatus;
    });

    const handleNewDelivery = () => {
      setEditingDelivery(null);
      setShowDeliveryForm(true);
    };

    const handleView = (delivery: Delivery) => {
      setViewingDelivery(delivery);
      setShowDeliveryForm(true);
    };

    const handleEdit = (delivery: Delivery) => {
      setEditingDelivery(delivery);
      setViewingDelivery(null);
      setShowDeliveryForm(true);
    };

    const handleDelete = (delivery: Delivery) => {
      if (
        confirm(`Are you sure you want to delete delivery ${delivery.number}?`)
      ) {
        setDeliveries((prev) => prev.filter((d) => d.id !== delivery.id));
      }
    };

    const handleDeleteSelected = (selectedIds: string[]) => {
      if (
        confirm(
          `Are you sure you want to delete ${selectedIds.length} delivery(ies)?`
        )
      ) {
        setDeliveries((prev) =>
          prev.filter((d) => !selectedIds.includes(d.id))
        );
      }
    };

    const handleFormClose = () => {
      setShowDeliveryForm(false);
      setEditingDelivery(null);
      setViewingDelivery(null);
    };

    const handleFormSubmit = (formData: Partial<Delivery>) => {
      if (editingDelivery) {
        setDeliveries((prev) =>
          prev.map((d) =>
            d.id === editingDelivery.id ? { ...d, ...formData } : d
          )
        );
      } else {
        const newDelivery: Delivery = {
          id: String(deliveries.length + 1),
          number: `DEL-2024-${String(deliveries.length + 1).padStart(3, "0")}`,
          createdDate: new Date().toISOString().split("T")[0],
          ...(formData as Omit<Delivery, "id" | "number" | "createdDate">),
        };
        setDeliveries((prev) => [...prev, newDelivery]);
      }
      handleFormClose();
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
          <p className="text-muted mt-2">Outgoing shipments and orders</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search by number or customer..."
              value={deliverySearch}
              onChange={(e) => setDeliverySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
          </select>
          {canCreate && (
            <button
              onClick={handleNewDelivery}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus size={16} />
              New Delivery
            </button>
          )}
        </div>

        <div className="card">
          <DataTable
            columns={deliveryColumns({
              onView: handleView,
              onEdit: canEdit ? handleEdit : undefined,
              onDelete: canDelete ? handleDelete : undefined,
            })}
            data={filteredDeliveries}
            onDeleteSelected={canDelete ? handleDeleteSelected : undefined}
          />
        </div>

        {showDeliveryForm && (
          <DeliveryForm
            delivery={editingDelivery || viewingDelivery}
            viewOnly={!!viewingDelivery}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    );
  };

  const renderLedger = () => {
    const filteredLedger = ledger.filter((entry) => {
      const matchesSearch =
        entry.product.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        entry.document.toLowerCase().includes(ledgerSearch.toLowerCase());
      const matchesType = ledgerFilter === "all" || entry.type === ledgerFilter;
      return matchesSearch && matchesType;
    });

    const handleDeleteSelected = (selectedIds: string[]) => {
      if (
        confirm(
          `Are you sure you want to delete ${selectedIds.length} entry(ies)?`
        )
      ) {
        console.log("Delete entries:", selectedIds);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Ledger</h1>
          <p className="text-muted mt-2">Complete history of stock movements</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search by product or document..."
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={ledgerFilter}
            onChange={(e) => setLedgerFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="receipt">Receipt</option>
            <option value="delivery">Delivery</option>
            <option value="transfer">Transfer</option>
            <option value="adjustment">Adjustment</option>
          </select>
        </div>

        <div className="card">
          <DataTable
            columns={ledgerColumns}
            data={filteredLedger}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted mt-2">System configuration and preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-lg mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Company Name
              </label>
              <input
                type="text"
                value="StockMaster Inc."
                className="w-full mt-1 px-3 py-2 bg-background border border-card-border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Currency
              </label>
              <select className="w-full mt-1 px-3 py-2 bg-background border border-card-border rounded-md text-sm">
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Low stock alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">New receipts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Delivery updates</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminNav />
      <main className="p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "warehouses" && renderWarehouses()}
          {activeTab === "inventory" && renderInventory()}
          {activeTab === "receipts" && renderReceipts()}
          {activeTab === "deliveries" && renderDeliveries()}
          {activeTab === "ledger" && renderLedger()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </main>

      {/* Warehouse Form Modal */}
      {showWarehouseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <WarehouseForm
              onClose={() => setShowWarehouseForm(false)}
              onSubmit={(formData) => {
                // Create new warehouse object
                const newWarehouse = {
                  id: (warehouses.length + 1).toString(),
                  name: formData.name || "",
                  location: formData.location || "",
                  capacity: "0%",
                  items: 0,
                  status: formData.status || "active",
                };
                
                // Add to warehouses state
                setWarehouses([...warehouses, newWarehouse]);
                
                // Update stats
                setStats(prev => ({
                  ...prev,
                  activeWarehouses: prev.activeWarehouses + 1
                }));
                
                console.log("Warehouse added:", newWarehouse);
                setShowWarehouseForm(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
