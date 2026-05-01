"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PredictionData {
  month: string
  predictedPrice: number
  historicalPrice: number
  recommendedPrice: number
  expectedYield: number
  profitMargin: number
}

interface PredictionResponse {
  estimatedYield: number
  yieldUnit: string
  projectedPrice: number
  priceUnit: string
  estimatedProfit: number
  profitMargin: number
  riskFactors: string[]
  recommendations: string[]
  confidence: number
}

export default function ProfitPredictor() {
  const [cropType, setCropType] = useState("wheat")
  const [area, setArea] = useState("5")
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [metrics, setMetrics] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generatePredictions()
  }, [])

  const generatePredictions = async () => {
    if (!cropType || !area) {
      setError("Please enter crop type and area")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cropType,
          area: Number.parseFloat(area),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate predictions")
      }

      const data: PredictionResponse = await response.json()
      setMetrics(data)

      // Generate mock monthly predictions for chart
      const mockData: PredictionData[] = [
        {
          month: "Jan",
          predictedPrice: 2400,
          historicalPrice: 2210,
          recommendedPrice: 2300,
          expectedYield: 800 * Number.parseFloat(area),
          profitMargin: 15,
        },
        {
          month: "Feb",
          predictedPrice: 2210,
          historicalPrice: 2290,
          recommendedPrice: 2250,
          expectedYield: 820 * Number.parseFloat(area),
          profitMargin: 16,
        },
        {
          month: "Mar",
          predictedPrice: 2290,
          historicalPrice: 2000,
          recommendedPrice: 2200,
          expectedYield: 850 * Number.parseFloat(area),
          profitMargin: 18,
        },
        {
          month: "Apr",
          predictedPrice: 2000,
          historicalPrice: 2181,
          recommendedPrice: 2100,
          expectedYield: 900 * Number.parseFloat(area),
          profitMargin: 20,
        },
        {
          month: "May",
          predictedPrice: 2181,
          historicalPrice: 2500,
          recommendedPrice: 2400,
          expectedYield: 950 * Number.parseFloat(area),
          profitMargin: 22,
        },
        {
          month: "Jun",
          predictedPrice: 2500,
          historicalPrice: 2100,
          recommendedPrice: 2300,
          expectedYield: 1000 * Number.parseFloat(area),
          profitMargin: 25,
        },
      ]
      setPredictions(mockData)
    } catch (err) {
      setError("Failed to generate predictions. Please try again.")
      console.error("Prediction error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Farm Parameters</CardTitle>
          <CardDescription>Enter your crop details to generate profit predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="cotton">Cotton</option>
                <option value="corn">Corn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Area (hectares)</label>
              <Input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="5"
                min="0.1"
                step="0.1"
              />
            </div>
            <Button onClick={generatePredictions} className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Predicting..." : "Generate Prediction"}
            </Button>
          </div>

          {error && (
            <Alert className="mt-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {metrics && (
        <>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  Estimated Yield
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.estimatedYield.toLocaleString()} {metrics.yieldUnit}
                </div>
                <p className="text-xs text-slate-500 mt-1">For {area} hectares</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Avg Market Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics.projectedPrice}</div>
                <p className="text-xs text-slate-500 mt-1">{metrics.priceUnit}</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Expected Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics.estimatedProfit.toLocaleString()}</div>
                <p className="text-xs text-slate-500 mt-1">Per season</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.confidence * 100).toFixed(0)}%</div>
                <p className="text-xs text-slate-500 mt-1">Prediction accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation Alert */}
          <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
            <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="ml-2 text-green-800 dark:text-green-200">
              Based on current market trends and your farm parameters, the profit margin is expected to be around{" "}
              {metrics.profitMargin}%. Focus on optimizing irrigation and pest management.
            </AlertDescription>
          </Alert>

          {/* Price Trends */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle>Market Price Predictions</CardTitle>
              <CardDescription>Predicted vs Historical market prices</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="predictedPrice"
                    stroke="#16a34a"
                    name="Predicted Price"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="historicalPrice"
                    stroke="#94a3b8"
                    name="Historical Price"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Profit Margin & Yield */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle>Yield & Profit Margin Forecast</CardTitle>
              <CardDescription>Expected yield and profit margins by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    label={{ value: `Yield (${metrics.yieldUnit})`, angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Profit Margin (%)", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="expectedYield"
                    fill="#16a34a"
                    name={`Expected Yield (${metrics.yieldUnit})`}
                  />
                  <Bar yAxisId="right" dataKey="profitMargin" fill="#f59e0b" name="Profit Margin (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Factors & Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Potential challenges to monitor</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {metrics.riskFactors.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded">
                      <span className="text-red-600 dark:text-red-400 font-bold text-lg">⚠</span>
                      <div>
                        <p className="font-medium text-sm">{risk}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle>Optimization Tips</CardTitle>
                <CardDescription>Actions to maximize profits</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {metrics.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-green-600 dark:text-green-400 font-bold text-lg">{idx + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{rec}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
