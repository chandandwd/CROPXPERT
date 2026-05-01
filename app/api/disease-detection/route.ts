export const maxDuration = 60

interface DiseaseAnalysisRequest {
  imageData: string
  cropType?: string
}

interface DiseaseAnalysisResponse {
  disease: string
  confidence: number
  severity: "low" | "medium" | "high"
  treatment: string
  description: string
}

// Disease detection database
const DISEASE_DATABASE: Record<string, DiseaseAnalysisResponse> = {
  "powdery-mildew": {
    disease: "Powdery Mildew",
    confidence: 0.87,
    severity: "medium",
    treatment: "Apply sulfur-based fungicide, improve air circulation, reduce nitrogen fertilizer",
    description: "A fungal disease causing white powder-like coating on leaves. Most common in warm, dry conditions.",
  },
  healthy: {
    disease: "Healthy Crop",
    confidence: 0.92,
    severity: "low",
    treatment: "Continue regular monitoring and maintenance. Ensure proper irrigation and nutrient balance.",
    description: "No disease detected. Crop appears healthy and vigorous.",
  },
  "early-blight": {
    disease: "Early Blight",
    confidence: 0.79,
    severity: "high",
    treatment: "Use copper fungicide, remove infected leaves immediately, improve drainage and ventilation",
    description:
      "Fungal disease causing brown concentric circular spots on leaves. Can spread rapidly in humid conditions.",
  },
  "leaf-spot": {
    disease: "Leaf Spot",
    confidence: 0.74,
    severity: "medium",
    treatment: "Remove infected leaves, apply fungicide, improve drainage, avoid overhead watering",
    description: "Bacterial disease causing circular spots with yellow halos on leaves. Spreads through water.",
  },
  "late-blight": {
    disease: "Late Blight",
    confidence: 0.85,
    severity: "high",
    treatment: "Apply copper or mancozeb fungicide immediately, remove infected plants, improve ventilation",
    description: "Severe fungal disease causing water-soaked lesions on leaves and stems. Highly contagious.",
  },
}

// Mock AI analysis function - Replace with actual ML model later
function analyzeImageWithAI(imageData: string): DiseaseAnalysisResponse {
  // In production, you would:
  // 1. Send image to your ML model API (Fal.ai, custom model, etc.)
  // 2. Parse the response and return structured data
  // 3. Store results in database for history

  const diseases = Object.values(DISEASE_DATABASE)
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)]

  // Simulate slight variation in confidence
  return {
    ...randomDisease,
    confidence: Math.min(1, randomDisease.confidence + (Math.random() - 0.5) * 0.1),
  }
}

export async function POST(request: Request) {
  try {
    const { imageData, cropType }: DiseaseAnalysisRequest = await request.json()

    if (!imageData) {
      return Response.json({ error: "Image data is required" }, { status: 400 })
    }

    // Validate base64 image
    if (!imageData.startsWith("data:image")) {
      return Response.json({ error: "Invalid image format" }, { status: 400 })
    }

    // Call AI analysis function
    const analysisResult = analyzeImageWithAI(imageData)

    // In production, store in database:
    // await db.diseaseAnalysis.create({
    //   userId,
    //   imageUrl,
    //   disease: analysisResult.disease,
    //   confidence: analysisResult.confidence,
    //   severity: analysisResult.severity,
    //   cropType,
    //   timestamp: new Date(),
    // });

    return Response.json(analysisResult)
  } catch (error) {
    console.error("Disease detection error:", error)
    return Response.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
