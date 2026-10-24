from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

app = FastAPI(
    title="EscapeEd Backend API",
    description="Backend service for EscapeEd: The Python Learning Escape Room",
    version="1.0.0",
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vite dev server or local network
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    puzzle_id: str = Field(default="puzzle_m1_slicing", description="Identifier of the puzzle being solved")
    answer: str = Field(..., description="Player's predicted output string")

class VerificationResponse(BaseModel):
    correct: bool
    message: str
    unlocked: bool
    hint: Optional[str] = None

class PuzzleData(BaseModel):
    id: str
    title: str
    room_name: str
    instruction: str
    code: str
    hint: str
    interactive_clue_object: str

CURRENT_PUZZLE = PuzzleData(
    id="puzzle_m1_slicing",
    title="The Scribe's Sequence Cipher",
    room_name="The Scriptorium Vault",
    instruction="Predict the exact standard output (stdout) printed by executing the Python code snippet below. Enter the exact string.",
    code="""# Decipher the alchemical codex
runes = ["Ignis", "Aqua", "Terra", "Aether", "Lux"]
catalyst = runes[1:4]
codex = "".join([r[0] for r in catalyst])
result = f"{codex}_{len(catalyst)}"
print(result)""",
    hint="Remember Python list slicing `runes[1:4]` starts at index 1 and stops before index 4 (indices 1, 2, and 3).",
    interactive_clue_object="The Scribe's Ancient Codex"
)

# Standardized correct output for the prediction puzzle
EXPECTED_OUTPUT = "ATE_3"

@app.get("/api/health")
def health_check():
    """
    Health check endpoint for EscapeEd backend service.
    """
    return {
        "status": "healthy",
        "service": "EscapeEd Backend",
        "version": "1.0.0",
        "game_engine": "Phaser + React",
    }

@app.get("/api/puzzle", response_model=PuzzleData)
def get_puzzle():
    """
    Fetch the active coding puzzle for the current chamber.
    """
    return CURRENT_PUZZLE

@app.post("/api/verify", response_model=VerificationResponse)
def verify_puzzle_answer(req: VerificationRequest):
    """
    Verify the user's predicted output.
    NOTE: In adherence to Milestone 1 requirements, submitted code is NOT executed
    in the backend process. Verification is performed via safe deterministic evaluation.
    """
    user_ans = req.answer.strip()
    
    # Check exact match or case-insensitive match with normalization
    if user_ans == EXPECTED_OUTPUT:
        return VerificationResponse(
            correct=True,
            message="Mechanism triggered! The heavy runic seal fractures and the iron exit unlatches.",
            unlocked=True,
            hint=None,
        )
    elif user_ans.upper() == EXPECTED_OUTPUT:
        return VerificationResponse(
            correct=True,
            message="Mechanism triggered! The runic seal accepts your answer. The exit is now open.",
            unlocked=True,
            hint=None,
        )
    
    # Helpful educational diagnostic feedback without revealing the raw solution directly
    feedback = "The runic mechanism remains locked. Your predicted output does not match."
    hint_text = None
    
    if "ATE" in user_ans and "_3" not in user_ans:
        hint_text = "Check the length expression: `len(catalyst)` counts how many items are in `runes[1:4]`."
    elif user_ans.startswith("IAT"):
        hint_text = "Recall: Python lists are 0-indexed. `runes[1]` is the second element, not the first!"
    elif "Lux" in user_ans or "L" in user_ans:
        hint_text = "Recall: In Python slice `[start:stop]`, the `stop` index (4) is exclusive and not included."
    elif not "_" in user_ans:
        hint_text = "Notice the f-string formatting `f\"{codex}_{len(catalyst)}\"` contains an underscore `_` separator."
    else:
        hint_text = "Trace carefully: What elements are in `runes[1:4]`? Take the first letter `r[0]` of each, join them, and append `_{len}`."

    return VerificationResponse(
        correct=False,
        message=feedback,
        unlocked=False,
        hint=hint_text,
    )
