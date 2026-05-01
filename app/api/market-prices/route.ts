import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MarketPriceModel from '@/lib/models/MarketPrice'

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

    await connectDB()
    
    // 1. Try to get fresh data from DB (less than 12 hours old)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)
    const cachedPrices = await MarketPriceModel.find({
      commodity: new RegExp(commodityParam, 'i'),
      arrivalDate: { $gte: twelveHoursAgo }
    }).sort({ arrivalDate: -1 }).limit(10)

    if (cachedPrices.length > 0) {
      console.log(`📦 Serving ${commodityParam} prices from cache`)
      return NextResponse.json(cachedPrices.map(p => ({
        commodity: p.commodity,
        price: p.modalPrice,
        unit: p.unit,
        trend: "stable",
        change: 0,
        timestamp: p.arrivalDate.toISOString()
      })))
    }

    // 2. If no cache, fetch from Data.gov.in API
    if (apiKey) {
      try {
        console.log(`🌐 Fetching fresh ${commodityParam} prices from Mandi API`)
        // Resource ID for Agmarknet Bulletins
        const resourceId = "9ef273d6-b1d0-4270-bc53-8407ad441113"
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&filters[commodity]=${commodityParam}&limit=10`
        
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.records && data.records.length > 0) {
          // Save to DB cache
          const savedDocs = await Promise.all(data.records.map((rec: any) => 
            MarketPriceModel.findOneAndUpdate(
              { commodity: rec.commodity, market: rec.market, arrivalDate: new Date(rec.arrival_date) },
              {
                commodity: rec.commodity,
                market: rec.market,
                state: rec.state,
                district: rec.district,
                minPrice: parseFloat(rec.min_price),
                maxPrice: parseFloat(rec.max_price),
                modalPrice: parseFloat(rec.modal_price),
                arrivalDate: new Date(rec.arrival_date),
                source: 'api'
              },
              { upsert: true, new: true }
            )
          ))

          return NextResponse.json(savedDocs.map(p => ({
            commodity: p.commodity,
            price: p.modalPrice,
            unit: "per quintal",
            trend: "stable",
            change: 0,
            timestamp: p.arrivalDate.toISOString()
          })))
        }
      } catch (apiErr) {
        console.error("Mandi API fetch error:", apiErr)
      }
    }

    // 3. Final fallback to mock data
    console.warn("Using mock market data as fallback")
    const prices = getMockMarketPrices()
    return NextResponse.json(prices)
  } catch (error) {
    console.error("Market prices API error:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
