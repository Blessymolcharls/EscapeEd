import React from 'react';
import { BookOpen, Terminal, RotateCcw, Home, Sparkles, Lock, Unlock } from 'lucide-react';

interface GameHUDProps {
  clueDiscovered: boolean;
  exitUnlocked: boolean;
  onOpenClue: () => void;
  onOpenTerminal: () => void;
  onResetRoom: () => void;
  onReturnToLanding: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  clueDiscovered,
  exitUnlocked,
  onOpenClue,
  onOpenTerminal,
  onResetRoom,
  onReturnToLanding,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-academia-surface/80 border border-academia-border backdrop-blur-md text-academia-parchment shadow-lg">
      {/* Chamber Title & Objective */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReturnToLanding}
          className="p-2 rounded-lg bg-academia-dark border border-academia-border hover:border-academia-gold/50 text-academia-parchmentMuted hover:text-academia-parchment transition-colors"
          title="Return to Landing Page"
        >
          <Home className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-lg text-academia-parchment">
              The Scriptorium Vault
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-academia-burgundy/40 text-academia-gold border border-academia-burgundy">
              Room I
            </span>
          </div>
          <p className="text-xs text-academia-parchmentMuted flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-3 h-3 text-academia-gold shrink-0" />
            <span>
              {!clueDiscovered
                ? 'Objective: Click the ancient codex on the scholar\'s desk.'
                : !exitUnlocked
                ? 'Objective: Solve the cipher on the central stone pedestal.'
                : 'Objective: Click the unsealed north iron door to escape!'}
            </span>
          </p>
        </div>
      </div>

      {/* Interactive Quick Badges & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Door Status Badge */}
        <div
          id="hud-door-status"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
            exitUnlocked
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              : 'bg-rose-950/70 border-rose-900/80 text-rose-300'
          }`}
        >
          {exitUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-rose-400" />}
          <span>{exitUnlocked ? 'EXIT UNLOCKED' : 'EXIT LOCKED'}</span>
        </div>

        {/* View Clue Button */}
        <button
          onClick={onOpenClue}
          id="hud-clue-button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            clueDiscovered
              ? 'bg-academia-dark border-academia-gold/50 text-academia-gold hover:bg-academia-surface shadow-gold-glow'
              : 'bg-academia-dark/50 border-academia-border text-academia-parchmentMuted opacity-60 hover:opacity-100'
          }`}
          title="Inspect Discovered Codex"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Codex</span>
          {clueDiscovered && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
        </button>

        {/* Open Cipher Terminal */}
        <button
          onClick={onOpenTerminal}
          id="hud-terminal-button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-academia-burgundy hover:bg-academia-burgundy-hover border border-academia-gold/40 text-academia-parchment text-xs font-medium shadow-burgundy-glow transition-all"
          title="Open Cipher Console"
        >
          <Terminal className="w-3.5 h-3.5 text-academia-gold" />
          <span>Cipher</span>
        </button>

        {/* Reset Room Button */}
        <button
          onClick={onResetRoom}
          id="hud-reset-button"
          className="p-1.5 rounded-lg bg-academia-dark border border-academia-border hover:border-academia-gold/40 text-academia-parchmentMuted hover:text-academia-parchment transition-colors"
          title="Reset Room State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
