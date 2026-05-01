"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react"

interface DiseaseResult {
  disease: string
  confidence: number
  severity: "low" | "medium" | "high"
  treatment: string
  description: string
}

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiseaseResult | null>(null)
  const [history, setHistory] = useState<{ timestamp: string; result: DiseaseResult; image: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!image) {
      setError("Please select an image first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/disease-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: image,
          cropType: "general",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const analysisResult: DiseaseResult = await response.json()
      setResult(analysisResult)

      if (image) {
        setHistory((prev) =>
          [
            {
              timestamp: new Date().toLocaleTimeString(),
              result: analysisResult,
              image,
            },
            ...prev,
          ].slice(0, 5),
        )
      }
    } catch (err) {
      setError("Failed to analyze image. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-green-600 dark:text-green-400"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900"
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900"
      default:
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle>Upload Crop Image</CardTitle>
          <CardDescription>Take a photo of your crop and let AI detect diseases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={loading}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center gap-2 ${loading ? "opacity-50" : ""}`}
            >
              <Upload className="w-10 h-10 text-green-600" />
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>

          {error && (
            <Alert className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {image && (
            <div className="space-y-4">
              <img
                src={image || "/placeholder.svg"}
                alt="Uploaded crop"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button onClick={analyzeImage} className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Analyzing..." : "Analyze Image"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className={`border-2 ${getSeverityBg(result.severity)}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {result.severity === "low" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                  {result.disease}
                </CardTitle>
                <CardDescription>Confidence: {(result.confidence * 100).toFixed(1)}%</CardDescription>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(result.severity)}`}>
                {result.severity.toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{result.description}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommended Treatment</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{result.treatment}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Recent disease detection analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 border border-green-100 dark:border-green-900/50 rounded"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt="History"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.result.disease}</h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Confidence: {(item.result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
