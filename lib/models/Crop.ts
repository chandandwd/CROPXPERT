import mongoose, { Document, Schema } from 'mongoose'

export interface ICrop extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  variety?: string
  fieldName?: string
  area: number           // in hectares
  soilType?: string
  plantingDate?: Date
  expectedHarvestDate?: Date
  status: 'planted' | 'growing' | 'harvested' | 'failed'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CropSchema = new Schema<ICrop>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    variety: { type: String, trim: true },
    fieldName: { type: String, trim: true },
    area: { type: Number, required: true, min: 0 },
    soilType: { type: String, trim: true },
    plantingDate: { type: Date },
    expectedHarvestDate: { type: Date },
    status: {
      type: String,
      enum: ['planted', 'growing', 'harvested', 'failed'],
      default: 'planted',
    },
    notes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema)
