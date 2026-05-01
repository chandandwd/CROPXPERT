"use client"

import { useState, useEffect, useRef } from "react"

interface SensorReading {
  timestamp: string
  temperature: number
  humidity: number
  soilMoisture: number
  soilPH: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

interface SensorStreamResult {
  data: SensorReading | null
  readings: SensorReading[]
  loading: boolean
  error: string | null
  isConnected: boolean
}

export function useSensorStream(mode: "polling" | "sse" = "polling"): SensorStreamResult {
  const [data, setData] = useState<SensorReading | null>(null)
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  useEffect(() => {
    if (mode === "sse") {
      // Server-Sent Events mode
      const connectSSE = () => {
        try {
          const eventSource = new EventSource("/api/sensors/stream")
          eventSourceRef.current = eventSource

          eventSource.onopen = () => {
            setIsConnected(true)
            setError(null)
          }

          eventSource.onmessage = (event) => {
            try {
              const reading: SensorReading = JSON.parse(event.data)
              const formatted = { ...reading, timestamp: formatTimestamp(reading.timestamp) }
              setData(formatted)
              setReadings((prev) => [...prev.slice(-11), formatted])
              setLoading(false)
            } catch {
              console.error("Failed to parse SSE data")
            }
          }

          eventSource.onerror = () => {
            setIsConnected(false)
            setError("Connection lost. Reconnecting...")
            eventSource.close()
            // Reconnect after 5 seconds
            setTimeout(connectSSE, 5000)
          }
        } catch {
          setError("Failed to connect to sensor stream")
          setIsConnected(false)
        }
      }

      connectSSE()

      return () => {
        eventSourceRef.current?.close()
      }
    } else {
      // Polling mode
      const fetchData = async () => {
        try {
          const response = await fetch("/api/sensors/stream")
          if (!response.ok) throw new Error("Failed to fetch sensor data")

          const allReadings: SensorReading[] = await response.json()
          const formatted = allReadings.map((r) => ({
            ...r,
            timestamp: formatTimestamp(r.timestamp),
          }))

          setData(formatted[formatted.length - 1])
          setReadings(formatted.slice(-12))
          setIsConnected(true)
          setError(null)
        } catch (err) {
          setError("Failed to fetch sensor data")
          setIsConnected(false)
        } finally {
          setLoading(false)
        }
      }

      fetchData()
      const interval = setInterval(fetchData, 3000)
      return () => clearInterval(interval)
    }
  }, [mode])

  return { data, readings, loading, error, isConnected }
}
