import { AlertCircle, CheckCircle } from "lucide-react"

export function AlertsList() {
  const alerts = [
    { id: 1, product: "SKU-001", message: "Low stock", severity: "high" },
    { id: 2, product: "SKU-045", message: "Expiring soon", severity: "medium" },
    { id: 3, product: "SKU-089", message: "In stock", severity: "low" },
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Alerts</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted-bg rounded-lg">
            {alert.severity === "high" ? (
              <AlertCircle size={20} className="text-error mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle size={20} className="text-success mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.product}</p>
              <p className="text-xs text-muted">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
