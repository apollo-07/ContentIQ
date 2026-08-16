# ContentIQ Frontend (Developer 2 Ownership)

ContentIQ is a modern SaaS analytics and AI content intelligence platform for social media creators and marketing teams.

## 🚀 Technology Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (custom modern slate/indigo theme with glassmorphic cards and glows)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with Bearer token interceptor
- **CSV Parser**: PapaParse with automated data quality audits
- **Testing**: Vitest + React Testing Library + jsdom

---

## 📁 Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/         # Button, Card, Badge, Modal, StatCard, LoadingSpinner, EmptyState, ErrorState, ProgressBar
│   │   ├── layout/         # Navbar, Sidebar, DashboardLayout, ProtectedRoute
│   │   └── charts/         # ContentTypeChart, TopicPerformanceChart, TimingCharts, EngagementTrendChart
│   ├── context/            # AuthContext (JWT management & user state)
│   ├── mock/               # Exact mock data schemas adhering to Developer 1 API contract
│   │   └── mockData.js
│   ├── pages/              # Landing, Login, Register, Dashboard, Analytics, Insights,
│   │                       # Recommendations, Predict, Simulator, Strategy, Upload, Profile, NotFound
│   ├── services/
│   │   ├── api.js          # Centralized API service with live/mock toggle
│   │   └── csvParser.js    # Client-side CSV quality and schema audit engine
│   ├── test/               # Vitest unit & integration test suites
│   ├── utils/              # formatters, helpers
│   ├── App.jsx             # Router definition & protected route mapping
│   ├── index.css           # Custom Tailwind layers & utilities
│   └── main.jsx
├── .env.example
├── .env
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🛠️ Installation & Setup Commands

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## ⚙️ Environment Configuration (`.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Developer 1 FastAPI backend server URL |
| `VITE_USE_MOCK` | `true` | When `true`, enables offline mock engine with realistic data |
| `VITE_APP_NAME` | `ContentIQ` | Application title |

---

## 🔌 Seamless Integration with Developer 1's Backend

### Centralized API Service: `frontend/src/services/api.js`
All backend calls are centralized in `src/services/api.js`.

### How to Switch from Mock Data to the Real Backend:
1. **Via `.env`**:
   Set `VITE_USE_MOCK=false` in `frontend/.env`.
2. **Via UI**:
   Navigate to `/profile` and toggle the **Active Data Source Engine** from *Mock API Mode* to *Live FastAPI Backend*.
3. Ensure Developer 1's FastAPI server is running on `http://localhost:8000` (or the URL set in `VITE_API_BASE_URL`).

---

## 📋 API Contract Schema Compatibility
The frontend is strictly bound to the following Developer 1 endpoints:
- `POST /auth/register` & `POST /auth/login`
- `POST /datasets/upload`, `GET /datasets`, `GET /datasets/{dataset_id}`
- `GET /analytics/overview`
- `GET /analytics/content-types`
- `GET /analytics/topics`
- `GET /analytics/timing`
- `GET /analytics/trends`
- `GET /insights`
- `GET /recommendations`
- `POST /predict`
- `POST /simulate`
- `GET /strategy`
