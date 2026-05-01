"use client"

import { useRouter } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut } from "lucide-react"
import DiseaseDetection from "@/components/disease-detection"
import ProfitPredictor from "@/components/profit-predictor"
import WeatherWidget from "@/components/weather-widget"
import MarketPrices from "@/components/market-prices"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("disease")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-green-200 dark:border-green-900 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-green-700 dark:text-green-400">CropXpert Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.farmName || "My Farm"}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-56" : "w-20"} border-r border-green-200 dark:border-green-900 bg-white dark:bg-slate-800 transition-all duration-300`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("disease")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeTab === "disease"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {sidebarOpen ? "Disease Detection" : "Disease"}
            </button>
            <button
              onClick={() => setActiveTab("profit")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeTab === "profit"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {sidebarOpen ? "Profit Predictor" : "Profit"}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeTab === "insights"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {sidebarOpen ? "Insights & Market" : "Insights"}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "disease" && <DiseaseDetection />}
          {activeTab === "profit" && <ProfitPredictor />}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Insights & Market</h1>
              <div className="grid lg:grid-cols-2 gap-6">
                <WeatherWidget />
                <MarketPrices />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
