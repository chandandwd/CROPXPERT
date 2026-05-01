import mongoose, { Document, Schema } from 'mongoose'

export interface IMarketPrice extends Document {
  commodity: string
  market: string
  state: string
  district?: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  unit: string
  arrivalDate: Date
  source: 'api' | 'manual' | 'scraped'
  createdAt: Date
}

const MarketPriceSchema = new Schema<IMarketPrice>(
  {
    commodity: { type: String, required: true, trim: true, index: true },
    market: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    unit: { type: String, default: 'Quintal' },
    arrivalDate: { type: Date, required: true, index: true },
    source: { type: String, enum: ['api', 'manual', 'scraped'], default: 'api' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// Compound index for fast lookups
MarketPriceSchema.index({ commodity: 1, arrivalDate: -1 })
MarketPriceSchema.index({ state: 1, commodity: 1, arrivalDate: -1 })

export default mongoose.models.MarketPrice ||
  mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema)
