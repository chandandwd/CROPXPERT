"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarketPrice {
  commodity: string
  price: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  timestamp: string
}

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/market-prices")
        if (response.ok) {
          const data = await response.json()
          setPrices(data)
        }
      } catch (error) {
        console.error("Failed to fetch market prices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    // Refresh every 1 hour
    const interval = setInterval(fetchPrices, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") return <TrendingUp className="w-5 h-5 text-green-600" />
    if (trend === "down") return <TrendingDown className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-slate-400" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
    if (trend === "down") return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
    return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20"
  }

  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader>
        <CardTitle>Current Market Prices</CardTitle>
        <CardDescription>Real-time commodity prices from NCDEX</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((price, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-green-100 dark:border-green-900/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{price.commodity}</p>
                <p className="text-xs text-slate-500">
                  ₹{price.price} {price.unit}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded ${getTrendColor(price.trend)}`}>
                {getTrendIcon(price.trend, price.change)}
                <span className="text-sm font-semibold">
                  {price.change > 0 ? "+" : ""}
                  {price.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
          Last updated: {prices[0]?.timestamp ? new Date(prices[0].timestamp).toLocaleTimeString() : "N/A"}
        </p>
      </CardContent>
    </Card>
  )
}
