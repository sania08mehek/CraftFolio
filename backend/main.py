"""
CraftFolio Backend — FastAPI App
POST /generate  →  returns { html: "..." }
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import GenerateRequest, GenerateResponse
from generator.assembler import build_portfolio

app = FastAPI(title="CraftFolio Generator API", version="1.0.0")

# Allow Vite dev server (localhost:5173) and any local origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "craftfolio-generator"}


@app.post("/generate", response_model=GenerateResponse)
def generate_portfolio(request: GenerateRequest):
    """
    Takes the user's customization choices and personal data,
    returns a complete single-file HTML portfolio as a string.
    """
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
