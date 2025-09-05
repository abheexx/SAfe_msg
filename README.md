# Safe Chat Filter

A full-stack AI-powered chat moderation application inspired by Bumble's safety features. This application helps users check if their chat messages are safe to send before hitting send.

## Features

- **AI-Powered Moderation**: Uses OpenAI's moderation API when available
- **Heuristic Fallback**: Smart pattern matching when OpenAI is unavailable
- **Real-time Checking**: Auto-checks messages as you type (500ms debounce)
- **Bumble-Style UI**: Clean yellow/black design with rounded cards
- **Mobile Responsive**: Works perfectly on all devices
- **Production Ready**: Deployable to Render/Heroku and Vercel/Netlify

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │    │   (FastAPI)     │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • TypeScript    │    │ • Python 3.11   │    │ • OpenAI API    │
│ • Vite Build    │    │ • FastAPI       │    │ • Moderation    │
│ • Real-time UI  │◄──►│ • CORS Enabled  │◄──►│ • Endpoint      │
│ • Debounced     │    │ • Health Check  │    │                 │
│ • Mobile First  │    │ • Heuristic     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend (FastAPI)
- **Endpoint**: `POST /api/check`
- **Input**: `{ "text": "your message" }`
- **Output**: `{ "safe": boolean, "reasons": string[], "mode": "openai" | "heuristic" }`
- **CORS Enabled**: Works with any frontend origin
- **Health Check**: `GET /api/health` for monitoring

### Frontend (React + Vite + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Custom CSS with Bumble-inspired design
- **API Integration**: Axios with error handling
- **Debouncing**: 500ms auto-check as you type

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key (optional, for AI moderation)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key (optional)
   ```

4. **Run the backend**:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env and set VITE_API_URL=http://localhost:8000
   ```

4. **Run the frontend**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Configuration

### Environment Variables

#### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

### API Modes

1. **OpenAI Mode** (when `OPENAI_API_KEY` is set):
   - Uses OpenAI's moderation API
   - More accurate and comprehensive
   - Detects subtle harmful content

2. **Heuristic Mode** (fallback):
   - Uses regex patterns for common issues
   - Categories: violence, harassment, inappropriate, spam
   - Works without external API calls

## Deployment

### Backend Deployment (Render/Heroku)

1. **Create a new web service**
2. **Connect your repository**
3. **Set build command**: `pip install -r requirements.txt`
4. **Set start command**: `uvicorn app:app --port $PORT --host 0.0.0.0`
5. **Add environment variables**:
   - `OPENAI_API_KEY` (optional)

### Frontend Deployment (Vercel/Netlify)

1. **Connect your repository**
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Add environment variables**:
   - `VITE_API_URL` (your backend URL)

## Development

### Project Structure
```
Bumble/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile           # Heroku deployment
│   ├── runtime.txt        # Python version
│   └── env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── types.ts       # TypeScript types
│   │   ├── api.ts         # API service
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Node dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── vercel.json        # Vercel deployment
│   └── netlify.toml       # Netlify deployment
└── README.md              # This file
```

### Available Scripts

#### Backend
```bash
# Run development server
uvicorn app:app --reload

# Run production server
uvicorn app:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## API Reference

### POST /api/check
Check if a text message is safe to send.

**Request Body:**
```json
{
  "text": "Your message here"
}
```

**Response:**
```json
{
  "safe": true,
  "reasons": [],
  "mode": "openai"
}
```

**Response Fields:**
- `safe` (boolean): Whether the message is safe to send
- `reasons` (string[]): List of detected issues
- `mode` (string): Detection method used ("openai", "heuristic", or "none")

### GET /api/health
Check API health and available services.

**Response:**
```json
{
  "status": "healthy",
  "openai_available": true,
  "heuristic_available": true
}
```

## Testing

### Test the API directly
```bash
# Check a safe message
curl -X POST "http://localhost:8000/api/check" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you today?"}'

# Check an unsafe message
curl -X POST "http://localhost:8000/api/check" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a violent threat"}'
```

### Test the frontend
1. Open `http://localhost:3000`
2. Type various messages to see different results
3. Try both safe and unsafe content
4. Test on different screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

- Inspired by Bumble's commitment to safe online dating
- Built with FastAPI, React, and TypeScript
- Uses OpenAI's moderation API for AI-powered detection
- Designed with accessibility and mobile-first principles