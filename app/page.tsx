"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingUp, Zap, AlertCircle, BarChart3, Camera } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-green-200 dark:border-green-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">CropXpert AI</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/signup")} className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-green-900 dark:text-green-100 mb-6 text-balance">
              Smart Farming Starts Here
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 text-pretty">
              Monitor your crops with AI, detect diseases instantly, and maximize profits with
              predictive analytics.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="bg-green-600 hover:bg-green-700 text-lg"
            >
              Start Free Trial
            </Button>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-green-200 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center">
            <div className="text-6xl opacity-30">🌾</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-green-900 dark:text-green-100">Powerful Features</h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-12 text-lg">
            Everything you need to make data-driven farming decisions
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Disease Detection */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <Camera className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>AI Disease Detection</CardTitle>
                <CardDescription>Identify crop diseases before they spread</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload crop images and get instant AI-powered diagnosis with treatment recommendations
                </p>
              </CardContent>
            </Card>

            {/* Profit Prediction */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Profit Prediction</CardTitle>
                <CardDescription>Optimize yields and maximize returns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI-powered recommendations based on market prices, weather patterns, and crop data
                </p>
              </CardContent>
            </Card>

            {/* Weather Integration */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <AlertCircle className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Weather Insights</CardTitle>
                <CardDescription>Plan ahead with accurate forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Integrated weather data with disease risk alerts and irrigation recommendations
                </p>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Visualize your farm performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Comprehensive dashboards with charts, trends, and historical data analysis
                </p>
              </CardContent>
            </Card>

            {/* Market Integration */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Market Prices</CardTitle>
                <CardDescription>Stay updated on mandi rates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Real-time market prices to help you decide the best time to sell your crops
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 dark:bg-green-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of farmers using CropXpert to increase yields and reduce costs
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push("/signup")} className="text-lg">
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm opacity-75">© 2025 CropXpert AI. Empowering farmers with technology.</p>
        </div>
      </footer>
    </main>
  )
}
