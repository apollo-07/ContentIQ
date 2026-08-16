"""
main.py – FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings
from backend.database import Base, engine
from backend.routes import auth, datasets, analytics, insights, predict, strategy

# ---------------------------------------------------------------------------
# Create all database tables on startup if database is reachable
# ---------------------------------------------------------------------------
import backend.models  # noqa: F401

try:
    Base.metadata.create_all(bind=engine)
except Exception as err:
    print(f"[WARN] Database connection not available on startup: {err}")

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
settings = get_settings()

app = FastAPI(
    title="ContentIQ API",
    description=(
        "Social media analytics, ML-powered engagement prediction, "
        "and automated content strategy recommendations."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS – allow the React frontend (Developer 2) to call this API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(datasets.router)
app.include_router(analytics.router)
app.include_router(insights.router)
app.include_router(predict.router)
app.include_router(strategy.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
def health():
    """Simple liveness check used by CI/CD and load balancers."""
    return {"status": "ok", "version": "1.0.0"}
