import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check Supabase connectivity
    const { error } = await supabase
      .from('market_prices')
      .select('count', { count: 'exact', head: true })
      .limit(1)

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: error ? 'error' : 'connected',
      environment: process.env.NODE_ENV,
    })
  } catch (error: any) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Service check failed',
      error: error.message,
    }, { status: 500 })
  }
}
