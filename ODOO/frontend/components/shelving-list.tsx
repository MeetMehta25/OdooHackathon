"use client";

import { useState } from "react";
import { PackageCheck, Search, Filter, ArrowUpDown } from "lucide-react";

export function ShelvingList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Mock data - replace with actual API calls
  const shelvingTasks = [
    {
      id: "SH-001",
      productName: "Industrial Bearings",
      sku: "BRG-001",
      quantity: 50,
      location: "A-01-02",
      source: "Receiving Bay",
      priority: "high",
      assignedTo: "John Doe",
      status: "pending",
      createdAt: "2024-11-22 10:30",
    },
    {
      id: "SH-002",
      productName: "Steel Pipes",
      sku: "PIP-205",
      quantity: 120,
      location: "B-03-01",
      source: "Quality Check",
      priority: "medium",
      assignedTo: "Jane Smith",
      status: "in-progress",
      createdAt: "2024-11-22 09:15",
    },
    {
      id: "SH-003",
      productName: "Electrical Components",
      sku: "ELC-432",
      quantity: 200,
      location: "C-02-05",
      source: "Receiving Bay",
      priority: "low",
      assignedTo: "Mike Johnson",
      status: "completed",
      createdAt: "2024-11-22 08:00",
    },
    {
      id: "SH-004",
      productName: "Plastic Containers",
      sku: "CON-108",
      quantity: 300,
      location: "A-05-03",
      source: "Receiving Bay",
      priority: "high",
      assignedTo: "Sarah Williams",
      status: "pending",
      createdAt: "2024-11-22 11:45",
    },
  ];

  const filteredTasks = shelvingTasks.filter((task) => {
    const matchesSearch =
      task.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleStartShelving = (taskId: string) => {
    console.log("Start shelving:", taskId);
    // Add your shelving logic here
  };

  const handleCompleteShelving = (taskId: string) => {
    console.log("Complete shelving:", taskId);
    // Add your shelving completion logic here
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <PackageCheck className="text-primary" size={28} />
            Shelving Tasks
          </h2>
          <p className="text-muted text-sm mt-1">
            Move products from staging to storage locations
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition">
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product, SKU, or task ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-card-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-500/10 border-blue-500/20">
          <p className="text-sm text-muted">Total Tasks</p>
          <p className="text-2xl font-bold text-foreground">
            {shelvingTasks.length}
          </p>
        </div>
        <div className="card bg-yellow-500/10 border-yellow-500/20">
          <p className="text-sm text-muted">Pending</p>
          <p className="text-2xl font-bold text-foreground">
            {shelvingTasks.filter((t) => t.status === "pending").length}
          </p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-muted">In Progress</p>
          <p className="text-2xl font-bold text-foreground">
            {shelvingTasks.filter((t) => t.status === "in-progress").length}
          </p>
        </div>
        <div className="card bg-purple-500/10 border-purple-500/20">
          <p className="text-sm text-muted">Completed</p>
          <p className="text-2xl font-bold text-foreground">
            {shelvingTasks.filter((t) => t.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  <div className="flex items-center gap-1">
                    Task ID
                    <ArrowUpDown size={14} className="text-muted" />
                  </div>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Product
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Quantity
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  From → To
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Priority
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Assigned To
                </th>
                <th className="text-left p-3 text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-card-border hover:bg-card-hover transition"
                >
                  <td className="p-3">
                    <span className="font-mono text-sm font-medium text-primary">
                      {task.id}
                    </span>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {task.productName}
                      </p>
                      <p className="text-xs text-muted">{task.sku}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-semibold text-foreground">
                      {task.quantity}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">{task.source}</span>
                      <span className="text-muted">→</span>
                      <span className="text-sm font-medium text-foreground">
                        {task.location}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border capitalize ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground">
                      {task.assignedTo}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {task.status === "pending" && (
                        <button
                          onClick={() => handleStartShelving(task.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition"
                        >
                          Start
                        </button>
                      )}
                      {task.status === "in-progress" && (
                        <button
                          onClick={() => handleCompleteShelving(task.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition"
                        >
                          Complete
                        </button>
                      )}
                      {task.status === "completed" && (
                        <span className="text-xs text-muted">✓ Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <PackageCheck size={48} className="mx-auto text-muted mb-3" />
            <p className="text-muted">No shelving tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
