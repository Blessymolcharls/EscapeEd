import type { PuzzleInfo, VerificationResult } from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Fallback puzzle data in case backend is offline during initial frontend preview
export const FALLBACK_PUZZLE: PuzzleInfo = {
  id: 'puzzle_m1_slicing',
  title: "The Scribe's Sequence Cipher",
  room_name: 'The Scriptorium Vault',
  instruction: 'Predict the exact standard output (stdout) printed by executing the Python code snippet below. Enter the exact string.',
  code: `# Decipher the alchemical codex
runes = ["Ignis", "Aqua", "Terra", "Aether", "Lux"]
catalyst = runes[1:4]
codex = "".join([r[0] for r in catalyst])
result = f"{codex}_{len(catalyst)}"
print(result)`,
  hint: 'Remember Python list slicing `runes[1:4]` starts at index 1 and stops before index 4 (indices 1, 2, and 3).',
  interactive_clue_object: "The Scribe's Ancient Codex",
};

export async function checkBackendHealth(): Promise<{ online: boolean; message: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return { online: true, message: 'Backend connected' };
    }
    return { online: false, message: `Backend returned ${res.status}` };
  } catch {
    return { online: false, message: 'Backend unreachable (using local validation fallback)' };
  }
}

export async function fetchPuzzle(): Promise<PuzzleInfo> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE_URL}/api/puzzle`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Using fallback puzzle definition due to backend error:', err);
    return FALLBACK_PUZZLE;
  }
}

export async function verifyAnswer(answer: string): Promise<VerificationResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        puzzle_id: 'puzzle_m1_slicing',
        answer,
      }),
    });

    if (!res.ok) {
      throw new Error(`Verification service returned status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable during verification, executing deterministic local check:', err);
    
    // Deterministic safe client fallback matching backend logic
    const trimmed = answer.trim();
    const EXPECTED = 'ATE_3';
    
    if (trimmed.toUpperCase() === EXPECTED) {
      return {
        correct: true,
        message: 'Mechanism triggered! The runic seal fractures and the exit unlatches.',
        unlocked: true,
        hint: null,
      };
    }

    let hint = "Trace carefully: What elements are in `runes[1:4]`? Take the first letter `r[0]` of each, join them, and append `_{len}`.";
    if (trimmed.toUpperCase().includes('ATE') && !trimmed.includes('_3')) {
      hint = "Check the length expression: `len(catalyst)` counts how many items are in `runes[1:4]`.";
    } else if (trimmed.toUpperCase().startsWith('IAT')) {
      hint = "Recall: Python lists are 0-indexed. `runes[1]` is the second element, not the first!";
    }

    return {
      correct: false,
      message: 'The runic mechanism remains locked. Your predicted output does not match.',
      unlocked: false,
      hint,
    };
  }
}
