import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI missing. Skipping MongoDB connection.')
}

// Extend global type to cache the connection
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(): Promise<mongoose.Connection | null> {
  if (!MONGODB_URI) {
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    }

    console.log('⏳ Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB Connected successfully')
      return m.connection
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e: any) {
    console.error('❌ MongoDB Connection Error Details:', {
      message: e.message,
      code: e.code,
      name: e.name,
      uri: MONGODB_URI.replace(/\/\/.*:.*@/, '//****:****@') // Mask credentials
    })
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
