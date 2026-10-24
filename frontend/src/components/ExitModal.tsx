import React from 'react';
import { DoorClosed, DoorOpen, X, Key, Terminal, ArrowRight } from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  isUnlocked: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  onEscape: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  isOpen,
  isUnlocked,
  onClose,
  onOpenTerminal,
  onEscape,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#1b1c23] to-[#121317] border-2 border-academia-border rounded-2xl shadow-2xl p-6 sm:p-8 text-academia-parchment"
        id="exit-inspection-modal"
      >
        <button
          onClick={onClose}
          id="close-exit-modal-button"
          className="absolute top-4 right-4 p-2 text-academia-parchmentMuted hover:text-academia-parchment hover:bg-academia-surface rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isUnlocked 
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
              : 'bg-rose-950/60 border-rose-500 text-rose-400'
          }`}>
            {isUnlocked ? <DoorOpen className="w-6 h-6" /> : <DoorClosed className="w-6 h-6" />}
          </div>
          <div>
            <div className={`text-xs font-mono uppercase tracking-wider ${isUnlocked ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUnlocked ? 'Status: Unsealed' : 'Status: Sealed by Runic Wards'}
            </div>
            <h2 className="text-2xl font-serif font-bold text-academia-parchment">
              The Grand Iron Exit
            </h2>
          </div>
        </div>

        {isUnlocked ? (
          <div>
            <p className="text-sm text-academia-parchmentMuted leading-relaxed mb-6 font-sans">
              The heavy iron portcullis has retracted into the vaulted ceiling. Warm amber light shines through the opening, beckoning you forward to the next chamber.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-academia-border hover:bg-academia-surface text-academia-parchment text-sm font-medium transition-colors"
              >
                Stay in Room
              </button>
              <button
                onClick={onEscape}
                id="escape-chamber-button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                <Key className="w-4 h-4 text-yellow-300" />
                <span>Step Through and Escape</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-academia-parchmentMuted leading-relaxed mb-4 font-sans">
              Massive oak timber reinforced by cold forged iron bars bars the way forward. Two crimson bands of runic light pulse across the doorway. A dial mechanism in the room controls the locks.
            </p>
            <div className="p-3.5 rounded-xl bg-academia-surface/70 border border-academia-border text-xs text-academia-parchmentMuted mb-6 space-y-1">
              <p className="text-academia-gold font-semibold">Escape Requirement:</p>
              <p>1. Inspect the glowing codex on the scholar's desk.</p>
              <p>2. Forecast the script's output on the central cipher console.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-academia-border hover:bg-academia-surface text-academia-parchment text-sm font-medium transition-colors"
              >
                Inspect Chamber
              </button>
              <button
                onClick={onOpenTerminal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-academia-burgundy hover:bg-academia-burgundy-hover text-academia-parchment text-sm font-semibold border border-academia-gold/50 shadow-burgundy-glow transition-all"
              >
                <Terminal className="w-4 h-4 text-academia-gold" />
                <span>Go to Cipher Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
