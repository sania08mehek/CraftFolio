"""
CraftFolio Backend — FastAPI App
POST /generate  →  full portfolio HTML
POST /preview   →  single-section HTML for layout picker
GET  /health    →  healthcheck
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

from models import GenerateRequest, GenerateResponse
from generator.assembler import build_portfolio, build_section_preview

app = FastAPI(title="CraftFolio Generator API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ────────────────────────────────────────────────────────────────────

class PreviewRequest(BaseModel):
    section: str
    layout:  int
    theme:   str
    user_data: dict[str, Any] = {}   # sample data from frontend


# ── Routes ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "craftfolio-generator"}


@app.post("/generate", response_model=GenerateResponse)
def generate_portfolio(request: GenerateRequest):
    """Full portfolio generation from user data + customization."""
    try:
        html = build_portfolio(
            customization = request.customization.model_dump(),
            user_data     = request.userData.model_dump(),
        )
        return GenerateResponse(html=html)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Template error: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Generation failed: {exc}")


@app.post("/preview", response_model=GenerateResponse)
def preview_section(request: PreviewRequest):
    """
    Renders a single section in the chosen theme using provided (sample) user data.
    Used by the frontend layout picker to show the iframe preview.
    """
    try:
        html = build_section_preview(
            section    = request.section,
            layout_num = request.layout,
            theme      = request.theme,
            user_data  = request.user_data,
        )
        return GenerateResponse(html=html)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=f"Template not found: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Preview failed: {exc}")
