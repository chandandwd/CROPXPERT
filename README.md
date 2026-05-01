# CropXpert AI - Smart Farming Platform

An intelligent IoT-powered agriculture management system that helps farmers monitor crops in real-time, detect diseases using AI, and maximize profits through predictive analytics.

## Features

- **Real-time Sensor Monitoring** - Live temperature, humidity, soil moisture, and nutrient tracking
- **AI Disease Detection** - Upload crop images for instant AI-powered disease diagnosis
- **Weather Integration** - Real-time weather forecasts with disease risk alerts
- **Market Price Tracking** - Current commodity prices from major markets
- **Profit Prediction** - AI-powered yield and profit forecasts based on farm data
- **IoT Integration** - Connect any IoT device for real-time data streaming
- **User Dashboard** - Comprehensive farm analytics and recommendations

## Quick Start

### Installation

\`\`\`bash
# Using shadcn CLI (Recommended)
npx shadcn@latest init -d

# Or manually install
npm install
\`\`\`

### Running the App

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

### Demo Access

- Email: `farmer@example.com`
- Password: `demo123`

## Project Structure

\`\`\`
├── app/
│   ├── api/                 # Backend API routes
│   │   ├── disease-detection/
│   │   ├── sensors/stream/
│   │   ├── weather/
│   │   ├── market-prices/
│   │   └── predictions/
│   ├── dashboard/           # Main dashboard page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── page.tsx             # Landing page
├── components/
│   ├── disease-detection.tsx    # Disease detection UI
│   ├── sensor-dashboard.tsx     # Real-time sensors
│   ├── weather-widget.tsx       # Weather display
│   ├── market-prices.tsx        # Market prices display
│   └── profit-predictor.tsx     # Profit predictions
├── hooks/
│   └── use-sensor-stream.ts     # Real-time data hook
└── lib/
    └── utils.ts             # Utility functions
\`\`\`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/disease-detection` | POST | Analyze crop images for diseases |
| `/api/sensors/stream` | GET | Stream real-time sensor data |
| `/api/weather` | GET | Get weather forecasts |
| `/api/market-prices` | GET | Get current market prices |
| `/api/predictions` | POST | Generate profit predictions |

## Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS
- **Charts:** Recharts
- **Backend:** Next.js API Routes
- **Real-time:** Server-Sent Events (SSE)
- **Deployment:** Vercel

## Integrations

The platform is designed to integrate with:

- **IoT Hubs:** Azure IoT Hub, AWS IoT Core, MQTT brokers
- **AI Models:** Fal.ai, custom ML models
- **Weather APIs:** OpenWeatherMap
- **Market Data:** NCDEX, Agricultural APIs
- **Databases:** Supabase, PostgreSQL
- **Caching:** Upstash Redis

## Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENWEATHER_API_KEY=
MANDI_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
\`\`\`

## Configuration

### Enabling Real Sensor Streaming

Edit `components/sensor-dashboard.tsx`:

\`\`\`typescript
// Change from polling to SSE (Server-Sent Events)
const { data, readings } = useSensorStream('sse');
\`\`\`

### Connecting IoT Devices

See `DEPLOYMENT.md` for detailed integration guides for:
- Azure IoT Hub
- AWS IoT Core
- MQTT Brokers
- Custom HTTP endpoints

## Performance

- Sensor data refreshes every 3 seconds
- Weather updates every 30 minutes
- Market prices update hourly
- Optimized chart rendering with 12-point history

## Security

- HTTPS/SSL encryption
- Input validation on all APIs
- Rate limiting on sensitive endpoints
- Environment variable protection
- Row-level security in database

## Testing

### Manual Testing

1. **Sensors:** Check dashboard updates every 3 seconds
2. **Disease Detection:** Upload test images
3. **Weather:** Verify forecast loads
4. **Market Prices:** Check price updates
5. **Predictions:** Vary farm parameters and re-predict

### Automated Testing

\`\`\`bash
npm run test
\`\`\`

## Deployment

### Deploy to Vercel (Easiest)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

\`\`\`bash
npm run build
# Deploy the .next folder
\`\`\`

See `DEPLOYMENT.md` for detailed deployment instructions.

## Troubleshooting

See `DEPLOYMENT.md` - Troubleshooting section

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## License

MIT License - See LICENSE file

## Support

- Documentation: See `DEPLOYMENT.md`
- Issues: GitHub Issues
- Email: support@cropxpert.ai

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced ML models
- [ ] Satellite imagery integration
- [ ] Blockchain for supply chain
- [ ] Social features for farmers
- [ ] WhatsApp integration
- [ ] SMS alerts for critical events

---

Built with ❤️ for farmers. Empowering agriculture with technology.
