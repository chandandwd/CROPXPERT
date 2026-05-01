import { NextResponse } from 'next/server'

// Weather data endpoint
interface WeatherResponse {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  rainChance: number
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

// Mock weather data fallback
function getMockWeatherData(location: string): WeatherResponse {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"]
  const condition = conditions[Math.floor(Math.random() * conditions.length)]

  return {
    location: location || "Farm Location",
    temperature: 22 + Math.random() * 10,
    condition,
    humidity: 60 + Math.random() * 30,
    windSpeed: 5 + Math.random() * 15,
    rainChance: Math.random() * 100,
    forecast: [
      { day: "Tomorrow", high: 28, low: 18, condition: "Sunny" },
      { day: "Day After", high: 26, low: 16, condition: "Cloudy" },
      { day: "+3 Days", high: 24, low: 14, condition: "Rainy" },
      { day: "+4 Days", high: 25, low: 15, condition: "Partly Cloudy" },
      { day: "+5 Days", high: 27, low: 17, condition: "Sunny" },
    ],
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || 'Delhi'
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      console.warn("OPENWEATHER_API_KEY is missing, using mock data")
      return NextResponse.json(getMockWeatherData(location))
    }

    // Call OpenWeatherMap API (Current + Forecast)
    // Using 5 day / 3 hour forecast for the forecast section
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform data to our interface
    const current = data.list[0]
    const transformed: WeatherResponse = {
      location: data.city.name,
      temperature: Math.round(current.main.temp),
      condition: current.weather[0].main,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // convert m/s to km/h
      rainChance: Math.round((current.pop || 0) * 100),
      forecast: data.list
        .filter((_: any, index: number) => index % 8 === 0) // get one reading per day (every 24h)
        .slice(1, 6)
        .map((item: any) => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
        }))
    }

    return NextResponse.json(transformed)
  } catch (error) {
    console.error("Weather API error:", error)
    // Fallback to mock data on error so UI doesn't break
    return NextResponse.json(getMockWeatherData('Delhi'))
  }
}
