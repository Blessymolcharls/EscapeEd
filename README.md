# EscapeEd — Browser-Based Python Coding Escape Room

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Phaser](https://img.shields.io/badge/Phaser-3.88+-E74C3C.svg?logo=phaser&logoColor=white)](https://phaser.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

EscapeEd is an immersive, dark-academia themed browser escape-room game built to teach core Python concepts. In **Milestone 1: The Scriptorium Vault**, players explore an ancient sealed chamber, inspect interactive objects, discover an alchemical coding codex, and predict the output of Python sequence slicing to fracture runic wards and unseal the iron exit.

---

## 🏛️ Milestone 1 Highlights

- **Dark-Academia Aesthetic:** Tailored palette with deep charcoal backgrounds (`#121316`), restrained burgundy accents (`#6b1d2f`), warm antique-gold highlights (`#d4af37`), and classic serif typography (Cinzel & Outfit).
- **Phaser 3 Game Scene:** Procedural, standalone 2D canvas room featuring flagstone masonry, towering bookshelves, wall sconces with animated flickering candle flames, drifting ambient dust motes, a scholar's study desk with an ancient codex, a central stone cipher pedestal, and a locked iron exit door.
- **Decoupled Architecture:** Clean separation of Phaser game logic and React presentation components via a typed `EventBus`.
- **Educational Python Puzzle:** An output-prediction challenge centered on Python list slicing `[start:stop]`, list comprehensions `[r[0] for r in catalyst]`, string joining `"".join(...)`, and length calculation `len(...)`.
- **Diagnostic Feedback:** Clear distinction between correct and incorrect answers, complete with pedagogical hints (e.g. reminders that slice upper bounds are exclusive, and lists are 0-indexed).
- **Deterministic Validation:** Backend verification endpoint that does **not** execute arbitrary code in the backend process, adhering strictly to safety guidelines.
- **Resilient Fallback & States:** Loading indicators, empty states, error handling, and client-side fallback validation if the backend is temporarily offline.

---

## 📁 Project Structure

```
EscapeEd/
├── backend/
│   ├── main.py              # FastAPI service: health check, puzzle endpoint, deterministic verification
│   ├── requirements.txt     # Backend dependencies (fastapi, uvicorn, pydantic)
│   └── test_backend.py      # Automated API verification test suite
│
├── frontend/
│   ├── index.html           # Dark academia fonts (Cinzel, Outfit, Fira Code) & metadata
│   ├── package.json         # React 19, TypeScript, Vite, Phaser 3, Lucide, Tailwind CSS
│   ├── tailwind.config.js   # Tailored Dark Academia theme tokens & shadows
│   ├── postcss.config.js    # PostCSS configuration
│   └── src/
│       ├── main.tsx         # Vite React entrypoint
│       ├── App.tsx          # Screen router ('landing' | 'playing' | 'escaped')
│       ├── index.css        # Base styling, custom scrollbars, and atmospheric utilities
│       ├── types/
│       │   └── game.ts      # TypeScript interfaces for game states, clues, and puzzles
│       ├── services/
│       │   └── api.ts       # API client with health checking and local fallback logic
│       ├── game/
│       │   ├── EventBus.ts   # Decoupled event emitter bridging Phaser & React
│       │   ├── RoomScene.ts  # Phaser 3 scene: chamber rendering, interactive zones, animations
│       │   └── PhaserGame.tsx# React wrapper handling Phaser lifecycle & canvas cleanup
│       └── components/
│           ├── LandingPage.tsx          # Responsive landing screen with story lore & backend status
│           ├── GameScreen.tsx           # Room orchestrator connecting HUD, Phaser, and modals
│           ├── GameHUD.tsx              # Chamber header, objectives, and inventory controls
│           ├── ClueModal.tsx            # Discovered codex inspection modal with Python snippet
│           ├── PuzzleTerminalModal.tsx  # Output prediction form, feedback alerts, and hints
│           ├── ExitModal.tsx            # Locked door inspection & escape confirmation
│           ├── LoreModal.tsx            # Scriptorium archives inspection modal
│           └── CompletionScreen.tsx     # Victory screen with timer, attempts, and concepts mastered
│
├── .gitignore
└── README.md
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.10+ (tested on 3.13)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EscapeEd
```

### 2. Backend Setup
In a terminal at the repository root:

```bash
# Optional: create and activate a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at `http://127.0.0.1:8000`:
- Health check: `http://127.0.0.1:8000/api/health`
- Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
In a second terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Verification & Testing

### Backend Unit Tests
Run the automated test suite to verify the `/api/health`, `/api/puzzle`, and `/api/verify` endpoints:

```bash
# From repository root
python -m backend.test_backend
```
Expected output:
```
ALL BACKEND TESTS PASSED SUCCESSFULLY!
```

### Frontend Build Verification
Verify that TypeScript compiles with zero errors and Vite bundles properly:

```bash
cd frontend
npm run build
```
Expected output:
```
✓ built in ~4s
dist/index.html
dist/assets/index.css
dist/assets/index.js
```

### End-to-End Gameplay Walkthrough
1. **Landing Page:**
   - Confirm the status indicator reports **"Backend Status: Online (FastAPI /api/health)"**.
   - Click **"Enter Chamber"**.
2. **Explore Chamber (Phaser Canvas):**
   - Click the **Scholar's Desk** or click the **"Codex"** button on the HUD.
   - The **Clue Modal** displays the ancient Scriptorium script:
     ```python
     runes = ["Ignis", "Aqua", "Terra", "Aether", "Lux"]
     catalyst = runes[1:4]
     codex = "".join([r[0] for r in catalyst])
     result = f"{codex}_{len(catalyst)}"
     print(result)
     ```
   - Click **"Proceed to Cipher Terminal"**.
3. **Solve the Prediction Puzzle:**
   - Try an incorrect prediction (e.g. `WRONG_VAL`) to verify that the error alert and contextual slicing hint appear.
   - Enter the correct prediction: `ATE_3`.
   - Submit the prediction to trigger the runic unlock animation.
4. **Escape the Chamber:**
   - Click **"Step Through Unsealed Exit"** (or click the glowing exit door in the Phaser room).
   - Confirm escape in the door modal.
   - The **Completion Screen** appears, displaying time elapsed, attempts count, and the list of mastered Python sequence concepts.
   - Click **"Replay Chamber"** to reset the room state and play again.

---

## 🔒 Security Note

In adherence to Milestone 1 specifications, arbitrary Python code execution is **not** performed in the backend process. Output predictions are safely evaluated deterministically with educational diagnostics.
