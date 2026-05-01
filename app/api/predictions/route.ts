import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Profit and yield predictions
interface PredictionRequest {
  cropType: string
  area: number
  soilType?: string
  historicalData?: any
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

// Mock prediction engine - Replace with actual ML model
function generatePredictions(cropType: string, area: number): PredictionResponse {
  const yieldPerHectare: Record<string, number> = {
    wheat: 50,
    rice: 55,
    cotton: 20,
    corn: 60,
  }

  const baseYield = yieldPerHectare[cropType.toLowerCase()] || 40
  const estimatedYield = baseYield * area * (0.8 + Math.random() * 0.4)

  const priceRange: Record<string, [number, number]> = {
    wheat: [2000, 2500],
    rice: [2100, 2600],
    cotton: [5000, 6000],
    corn: [1700, 2100],
  }

  const [minPrice, maxPrice] = priceRange[cropType.toLowerCase()] || [2000, 2500]
  const projectedPrice = minPrice + Math.random() * (maxPrice - minPrice)

  const estimatedProfit = estimatedYield * projectedPrice * 0.2
  const profitMargin = (estimatedProfit / (estimatedYield * projectedPrice * 0.8)) * 100

  return {
    estimatedYield: Math.round(estimatedYield),
    yieldUnit: "quintals",
    projectedPrice: Math.round(projectedPrice),
    priceUnit: "per quintal",
    estimatedProfit: Math.round(estimatedProfit),
    profitMargin: Math.round(profitMargin),
    riskFactors: ["Weather variability", "Pest/disease outbreaks", "Market price fluctuations"],
    recommendations: [
      "Monitor soil moisture regularly",
      "Implement integrated pest management",
      "Diversify crops to reduce risk",
      "Secure crop insurance",
    ],
    confidence: 0.75,
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cropType, area, soilType }: PredictionRequest = await request.json()

    if (!cropType || !area) {
      return NextResponse.json({ error: "Crop type and area are required" }, { status: 400 })
    }

    const predictions = generatePredictions(cropType, area)

    // Persist to Supabase (Optional: don't crash if save fails)
    try {
      await supabase.from('predictions').insert({
        user_id: user.id,
        crop_type: cropType,
        predicted_yield: predictions.estimatedYield,
        confidence_score: predictions.confidence
      })
    } catch (dbError) {
      console.warn("Could not save prediction to database:", dbError)
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 })
  }
}
