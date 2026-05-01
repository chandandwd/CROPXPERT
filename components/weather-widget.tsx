"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Cloud, CloudRain, Sun, CloudSun } from "lucide-react"

interface WeatherForecast {
  day: string
  high: number
  low: number
  condition: string
}

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  rainChance: number
  forecast: WeatherForecast[]
}

function WeatherIcon({ condition, className = "w-6 h-6" }: { condition: string; className?: string }) {
  const c = condition.toLowerCase()
  if (c.includes("rain")) return <CloudRain className={`${className} text-blue-500`} />
  if (c.includes("cloud") && c.includes("partly")) return <CloudSun className={`${className} text-yellow-500`} />
  if (c.includes("cloud")) return <Cloud className={`${className} text-slate-500`} />
  return <Sun className={`${className} text-yellow-500`} />
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather")
        if (!response.ok) throw new Error("Failed to fetch weather")
        const data = await response.json()
        setWeather(data)
        setError(null)
      } catch {
        setError("Could not load weather data")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader><CardTitle>Weather</CardTitle></CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="ml-2 text-red-800 dark:text-red-200">
              {error || "No weather data available"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const riskLevel = weather.rainChance > 70 ? "high" : weather.rainChance > 40 ? "medium" : "low"
  const riskColor =
    riskLevel === "high"
      ? "border-red-200 bg-red-50 dark:bg-red-900/20"
      : riskLevel === "medium"
        ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
        : "border-green-200 bg-green-50 dark:bg-green-900/20"

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
          <CardDescription>{weather.location}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <WeatherIcon condition={weather.condition} className="w-16 h-16" />
              <div>
                <p className="text-5xl font-bold">{weather.temperature.toFixed(1)}°C</p>
                <p className="text-slate-500 mt-1">{weather.condition}</p>
              </div>
            </div>
            <div className="text-right space-y-1 text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                💧 Humidity: <span className="font-medium">{weather.humidity.toFixed(0)}%</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                💨 Wind: <span className="font-medium">{weather.windSpeed.toFixed(1)} km/h</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                🌧 Rain: <span className="font-medium">{weather.rainChance.toFixed(0)}%</span>
              </p>
            </div>
          </div>

          {/* Disease Risk Alert */}
          <Alert className={`${riskColor} border`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <span className="font-medium">Disease Risk: {riskLevel.toUpperCase()}</span> —{" "}
              {riskLevel === "high"
                ? "High humidity and rain chance increases fungal disease risk. Apply preventive fungicide."
                : riskLevel === "medium"
                  ? "Moderate conditions. Monitor crops closely for early signs of disease."
                  : "Favorable weather conditions. Low disease risk today."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
          <CardDescription>Plan your farming activities ahead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {weather.forecast.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 border border-green-100 dark:border-green-900/50 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
              >
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">{day.day}</p>
                <WeatherIcon condition={day.condition} className="w-8 h-8 mb-2" />
                <p className="text-xs font-bold">{day.high}°</p>
                <p className="text-xs text-slate-400">{day.low}°</p>
                <p className="text-xs text-slate-500 mt-1 text-center leading-tight">{day.condition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
