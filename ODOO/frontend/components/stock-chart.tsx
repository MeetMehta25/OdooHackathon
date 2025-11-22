"use client"

export function StockChart() {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Stock Movement (24h)</h2>
      <div className="h-64 flex items-end justify-around gap-2">
        {[45, 62, 38, 71, 54, 89, 45, 62, 55, 48, 72, 65].map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: `${(height / 100) * 100}%` }}
          />
        ))}
      </div>
      <p className="text-xs text-muted mt-4 text-center">Last 12 hours</p>
    </div>
  )
}
