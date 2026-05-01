import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Market price data endpoint
interface MarketPrice {
  commodity: string
  price: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  timestamp: string
}

// Mock market price data fallback
function getMockMarketPrices(): MarketPrice[] {
  return [
    {
      commodity: "Wheat",
      price: 2050,
      unit: "per quintal",
      trend: "up",
      change: 2.5,
      timestamp: new Date().toISOString(),
    },
    {
      commodity: "Rice",
      price: 2200,
      unit: "per quintal",
      trend: "stable",
      change: 0.1,
      timestamp: new Date().toISOString(),
    },
    {
      commodity: "Cotton",
      price: 5400,
      unit: "per quintal",
      trend: "down",
      change: -1.2,
      timestamp: new Date().toISOString(),
    },
  ]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const commodityParam = searchParams.get('commodity') || 'Wheat'
    const apiKey = process.env.MANDI_API_KEY

    // 1. Try to get fresh data from Supabase (less than 12 hours old)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    
    const { data: cachedPrices, error: cacheError } = await supabase
      .from('market_prices')
      .select('*')
      .ilike('commodity', `%${commodityParam}%`)
      .gte('arrival_date', twelveHoursAgo)
      .order('arrival_date', { ascending: false })
      .limit(10)

    if (!cacheError && cachedPrices && cachedPrices.length > 0) {
      console.log(`📦 Serving ${commodityParam} prices from Supabase cache`)
      return NextResponse.json(cachedPrices.map(p => ({
        commodity: p.commodity,
        price: p.modal_price,
        unit: "per quintal",
        trend: "stable",
        change: 0,
        timestamp: p.arrival_date
      })))
    }

    // 2. If no cache, fetch from Data.gov.in API
    if (apiKey) {
      try {
        console.log(`🌐 Fetching fresh ${commodityParam} prices from Mandi API`)
        const resourceId = "9ef273d6-b1d0-4270-bc53-8407ad441113"
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&filters[commodity]=${commodityParam}&limit=10`
        
        const response = await fetch(apiUrl)
        const apiData = await response.json()

        if (apiData.records && apiData.records.length > 0) {
          // Save to Supabase cache
          const { data: savedData, error: saveError } = await supabase
            .from('market_prices')
            .upsert(apiData.records.map((rec: any) => ({
              commodity: rec.commodity,
              market: rec.market,
              state: rec.state,
              district: rec.district,
              min_price: parseFloat(rec.min_price),
              max_price: parseFloat(rec.max_price),
              modal_price: parseFloat(rec.modal_price),
              arrival_date: new Date(rec.arrival_date).toISOString(),
              source: 'api'
            })))
            .select()

          if (!saveError && savedData) {
            return NextResponse.json(savedData.map(p => ({
              commodity: p.commodity,
              price: p.modal_price,
              unit: "per quintal",
              trend: "stable",
              change: 0,
              timestamp: p.arrival_date
            })))
          }
        }
      } catch (apiErr) {
        console.error("Mandi API fetch error:", apiErr)
      }
    }

    // 3. Final fallback to mock data
    return NextResponse.json(getMockMarketPrices())
  } catch (error) {
    console.error("Market prices API error:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
