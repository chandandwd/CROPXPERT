import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()
    const state = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection is healthy',
      readyState: states[state as keyof typeof states],
      database: mongoose.connection.name,
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    }, { status: 500 })
  }
}
