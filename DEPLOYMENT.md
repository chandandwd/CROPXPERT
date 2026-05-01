# CropXpert AI Platform - Deployment & Testing Guide

## Table of Contents
1. [Local Testing](#local-testing)
2. [Production Deployment](#production-deployment)
3. [Integration Setup](#integration-setup)
4. [API Documentation](#api-documentation)
5. [Troubleshooting](#troubleshooting)

---

## Local Testing

### 1. Running the Application

The application is already set up with mock data and can run immediately:

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the application.

### 2. Test Credentials

Use any email and password to login - the app uses local storage for demo purposes.

**Demo Account:**
- Email: `farmer@example.com`
- Password: `demo123`

### 3. Testing Each Module

#### A. Real-time Sensor Dashboard
- Navigate to **Dashboard > Real-time Sensors**
- Mock sensor data updates every 3 seconds
- Check the connection status indicator (WiFi icon)
- Charts should display live temperature, humidity, and soil data

#### B. Disease Detection
- Navigate to **Dashboard > Disease Detection**
- Click upload area and select an image (any image works)
- Click "Analyze Image"
- System should return disease diagnosis within 2 seconds
- Check analysis history at bottom

#### C. Weather & Market Integration
- Navigate to **Dashboard > Insights & Market**
- Weather widget should show current conditions and 5-day forecast
- Market prices widget should display commodity prices with trend indicators

#### D. Profit Predictor
- Navigate to **Dashboard > Profit Predictor**
- Select a crop type and enter farm area
- Click "Generate Prediction"
- View yield forecasts, profit margins, and recommendations

---

## Production Deployment

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI:**
\`\`\`bash
npm install -g vercel
\`\`\`

2. **Deploy:**
\`\`\`bash
vercel
\`\`\`

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add required variables (see Integration Setup)

### Deploying to Other Platforms

**For AWS, Azure, or DigitalOcean:**
- Build the Next.js app: `npm run build`
- Use the standard Node.js deployment process
- Ensure Node.js 18+ is installed

---

## Integration Setup

### 1. Real IoT Device Integration

Replace mock data in `/app/api/sensors/stream/route.ts`:

\`\`\`typescript
// Instead of mock data, connect to your IoT hub:

// Option A: Azure IoT Hub
import { Client } from 'azure-iot-device';
const connectionString = process.env.AZURE_IOT_CONNECTION_STRING;

// Option B: AWS IoT Core
import * as awsIot from 'aws-iot-device-sdk';

// Option C: MQTT Broker
import mqtt from 'mqtt';
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

// Parse incoming sensor data and format as SensorReading
\`\`\`

### 2. Disease Detection AI Model

Replace mock analysis in `/app/api/disease-detection/route.ts`:

**Option A: Fal.ai Integration**
\`\`\`typescript
import { fal } from '@fal-ai/serverless';

const result = await fal.subscribe('fal-ai/plant-disease-detection', {
  input: {
    image_url: imageData,
  },
});
\`\`\`

**Option B: Custom Model**
\`\`\`typescript
const response = await fetch('https://your-model-endpoint.com/predict', {
  method: 'POST',
  body: JSON.stringify({ image: imageData }),
});
\`\`\`

### 3. Weather API Integration

Update `/app/api/weather/route.ts`:

\`\`\`typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}`
);
const data = await response.json();
\`\`\`

Get free API key from: https://openweathermap.org/api

### 4. Market Prices API

Update `/app/api/market-prices/route.ts`:

\`\`\`typescript
// For Indian farmers, use NCDEX API or Mandi data
const response = await fetch(
  `https://api.mandiprices.com/commodities?location=${location}`,
  { headers: { 'X-API-Key': process.env.MANDI_API_KEY } }
);
\`\`\`

### 5. Database Integration (Supabase)

\`\`\`bash
# 1. Sign up at supabase.com and create a project
# 2. Add environment variables to .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_service_key

# 3. Create tables for:
#    - users
#    - sensors_readings
#    - disease_analysis
#    - predictions
#    - market_prices
\`\`\`

---

## API Documentation

### POST /api/disease-detection

**Request:**
\`\`\`json
{
  "imageData": "data:image/jpeg;base64,...",
  "cropType": "wheat"
}
\`\`\`

**Response:**
\`\`\`json
{
  "disease": "Powdery Mildew",
  "confidence": 0.87,
  "severity": "medium",
  "treatment": "Apply sulfur-based fungicide",
  "description": "A fungal disease..."
}
\`\`\`

### GET /api/sensors/stream

**Returns:** Server-Sent Events or JSON array of sensor readings

\`\`\`json
{
  "timestamp": "2025-01-01T12:00:00Z",
  "temperature": 24.5,
  "humidity": 65.2,
  "soilMoisture": 45.8,
  "soilPH": 6.8,
  "nitrogen": 120,
  "phosphorus": 35,
  "potassium": 180
}
\`\`\`

### GET /api/weather

**Response:**
\`\`\`json
{
  "location": "Farm Location",
  "temperature": 28.5,
  "condition": "Sunny",
  "humidity": 65,
  "windSpeed": 12.3,
  "rainChance": 20,
  "forecast": [...]
}
\`\`\`

### GET /api/market-prices

**Response:**
\`\`\`json
[
  {
    "commodity": "Wheat",
    "price": 2050,
    "unit": "per quintal",
    "trend": "up",
    "change": 2.5
  }
]
\`\`\`

### POST /api/predictions

**Request:**
\`\`\`json
{
  "cropType": "wheat",
  "area": 5,
  "soilType": "loamy"
}
\`\`\`

**Response:**
\`\`\`json
{
  "estimatedYield": 250,
  "yieldUnit": "quintals",
  "projectedPrice": 2200,
  "estimatedProfit": 55000,
  "profitMargin": 22,
  "riskFactors": [...],
  "recommendations": [...]
}
\`\`\`

---

## Performance Optimization

### 1. Sensor Data Caching
Use Upstash Redis to cache sensor data:

\`\`\`typescript
import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
\`\`\`

### 2. Image Optimization
- Compress images before storing
- Use WebP format for better compression
- Implement progressive loading

### 3. Database Indexing
Create indexes on frequently queried columns:
\`\`\`sql
CREATE INDEX idx_user_readings ON sensors_readings(user_id, timestamp);
CREATE INDEX idx_disease_analysis ON disease_analysis(user_id, created_at);
\`\`\`

---

## Monitoring & Logging

### 1. Error Tracking
Integrate Sentry for error monitoring:

\`\`\`typescript
import * as Sentry from "@sentry/nextjs";

Sentry.captureException(error);
\`\`\`

### 2. Performance Monitoring
- Enable Next.js Analytics: https://vercel.com/analytics
- Monitor API response times
- Track sensor data latency

### 3. Logging
\`\`\`typescript
console.log('[CropXpert]', 'Event:', eventDetails);
\`\`\`

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Validate all API inputs
- [ ] Implement rate limiting on APIs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement JWT/session authentication
- [ ] Add CSRF protection
- [ ] Sanitize image uploads
- [ ] Implement field-level encryption for sensitive data
- [ ] Regular security audits

---

## Troubleshooting

### Issue: Sensor data not updating
**Solution:**
1. Check browser console for errors
2. Verify API endpoint is accessible: `GET /api/sensors/stream`
3. Check if IoT device is sending data
4. Verify WebSocket connection in browser DevTools

### Issue: Disease detection returning errors
**Solution:**
1. Validate image format (JPEG, PNG, GIF)
2. Check file size < 10MB
3. Verify API response in Network tab
4. Check image data is properly base64 encoded

### Issue: Weather/Market prices not loading
**Solution:**
1. Verify API keys in environment variables
2. Check API rate limits haven't been exceeded
3. Test API endpoint directly: `curl https://yourapi.com/weather`
4. Check network connectivity

### Issue: High memory usage
**Solution:**
1. Reduce sensor reading history limit (currently 12)
2. Implement data pagination in charts
3. Use data aggregation for historical data
4. Clear old data from database regularly

---

## Maintenance

### Weekly Tasks
- Monitor error logs
- Check API performance metrics
- Verify database backups

### Monthly Tasks
- Update dependencies: `npm update`
- Review sensor data accuracy
- Analyze user feedback
- Performance optimization

### Quarterly Tasks
- Security audit
- Database optimization
- ML model retraining
- User satisfaction survey

---

## Support & Resources

- Documentation: See `README.md`
- Bug Reports: Create GitHub issue
- Feature Requests: Discuss in GitHub Discussions
- Community: Join farming tech community forums

---

*Last Updated: January 2025*
