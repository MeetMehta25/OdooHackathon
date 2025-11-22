import { Package, Truck, TrendingUp, CheckCircle } from "lucide-react"

export function ActivityFeed() {
  const activities = [
    { id: 1, type: "receipt", title: "Stock received", desc: "Samsung Galaxy S24 from Samsung India, Mumbai", time: "2h ago", icon: Package },
    { id: 2, type: "delivery", title: "Order shipped", desc: "Apple iPhone 15 Pro to Reliance Digital, Delhi", time: "4h ago", icon: Truck },
    {
      id: 3,
      type: "adjustment",
      title: "Stock adjusted",
      desc: "MacBook Pro M3 - Mumbai Warehouse, Section A1",
      time: "6h ago",
      icon: TrendingUp,
    },
    {
      id: 4,
      type: "completion",
      title: "Transfer complete",
      desc: "Samsung phones from Mumbai to Delhi warehouse",
      time: "8h ago",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-white/20 last:pb-0 last:border-0"
            >
              <div className="p-2 bg-muted-bg rounded-lg flex-shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-xs text-muted mt-1">{activity.desc}</p>
              </div>
              <p className="text-xs text-muted flex-shrink-0">{activity.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
