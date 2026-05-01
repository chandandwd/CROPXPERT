import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MarketPrice from '@/lib/models/MarketPrice'
import User from '@/lib/models/User'

export async function GET() {
  try {
    await connectDB()

    // 1. Seed Test User
    // Clear existing test users if you want, or just check if it exists
    const testEmail = "test@example.com"
    let user = await User.findOne({ email: testEmail })
    
    if (!user) {
      user = await User.create({
        name: "Test Farmer",
        email: testEmail,
        password: "password123", // Will be hashed by User model pre-save hook
        role: 'farmer',
        location: "Punjab, India",
        farmSize: 5
      })
    }

    // 2. Seed Market Prices
    const samplePrices = [
      {
        commodity: "Wheat",
        market: "Khanna",
        state: "Punjab",
        minPrice: 2100,
        maxPrice: 2300,
        modalPrice: 2225,
        arrivalDate: new Date(),
        source: 'api'
      },
      {
        commodity: "Rice",
        market: "Karnal",
        state: "Haryana",
        minPrice: 2400,
        maxPrice: 2800,
        modalPrice: 2650,
        arrivalDate: new Date(),
        source: 'api'
      },
      {
        commodity: "Cotton",
        market: "Rajkot",
        state: "Gujarat",
        minPrice: 6500,
        maxPrice: 7200,
        modalPrice: 7000,
        arrivalDate: new Date(),
        source: 'api'
      }
    ]

    await MarketPrice.deleteMany({ source: 'api' })
    const createdPrices = await MarketPrice.insertMany(samplePrices)

    return NextResponse.json({
      message: "Database seeded successfully",
      user: {
        email: testEmail,
        password: "password123 (use this to login)"
      },
      pricesCount: createdPrices.length
    })
  } catch (error: any) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
