import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check Supabase connectivity instead of MongoDB
    const { error } = await supabase.from('market_prices').select('count', { count: 'exact', head: true }).limit(1)

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: error ? 'error' : 'connected',
      environment: process.env.NODE_ENV,
    })
      error: error.message,
    }, { status: 500 })
  }
}
