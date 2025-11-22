import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon: string
  color: "primary" | "warning" | "info" | "success"
}

const colorMap = {
  primary: "bg-primary",
  warning: "bg-warning",
  info: "bg-info",
  success: "bg-success",
}

export function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const isPositive = change.startsWith("+") && !change.includes("warning")

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`text-3xl opacity-70`}>{icon}</div>
      </div>
      <div className="flex items-center gap-1 text-xs">
        {isPositive ? (
          <TrendingUp size={16} className="text-success" />
        ) : (
          <TrendingDown size={16} className="text-warning" />
        )}
        <span className={isPositive ? "text-success" : "text-warning"}>{change}</span>
      </div>
    </div>
  )
}
