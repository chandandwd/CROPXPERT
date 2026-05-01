import mongoose, { Document, Schema } from 'mongoose'

export interface IPrediction extends Document {
  userId: mongoose.Types.ObjectId
  cropId?: mongoose.Types.ObjectId
  cropType: string
  area: number
  soilType?: string
  estimatedYield: number
  yieldUnit: string
  projectedPrice: number
  priceUnit: string
  estimatedProfit: number
  profitMargin: number
  riskFactors: string[]
  recommendations: string[]
  confidence: number
  createdAt: Date
}

const PredictionSchema = new Schema<IPrediction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropId: { type: Schema.Types.ObjectId, ref: 'Crop' },
    cropType: { type: String, required: true, trim: true },
    area: { type: Number, required: true },
    soilType: { type: String, trim: true },
    estimatedYield: { type: Number, required: true },
    yieldUnit: { type: String, default: 'quintals' },
    projectedPrice: { type: Number, required: true },
    priceUnit: { type: String, default: 'per quintal' },
    estimatedProfit: { type: Number, required: true },
    profitMargin: { type: Number, required: true },
    riskFactors: [{ type: String }],
    recommendations: [{ type: String }],
    confidence: { type: Number, min: 0, max: 1, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

PredictionSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Prediction ||
  mongoose.model<IPrediction>('Prediction', PredictionSchema)
