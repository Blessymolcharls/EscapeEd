import React from 'react';
import { BookOpen, X, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import type { PuzzleInfo } from '../types/game';

interface ClueModalProps {
  puzzle: PuzzleInfo;
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({
  puzzle,
  isOpen,
  onClose,
  onOpenTerminal,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(puzzle.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c1d24] to-[#14151b] border-2 border-academia-gold/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-academia-parchment overflow-hidden"
        id="clue-modal"
      >
        {/* Ancient manuscript corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-academia-gold/70" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-academia-gold/70" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-academia-gold/70" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-academia-gold/70" />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-clue-button"
          className="absolute top-4 right-4 p-2 text-academia-parchmentMuted hover:text-academia-parchment hover:bg-academia-surface rounded-lg transition-colors"
          title="Close codex"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-academia-burgundy/40 border border-academia-burgundy flex items-center justify-center text-academia-gold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-academia-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Artifact Discovered: {puzzle.interactive_clue_object}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-academia-parchment">
              The Scribe's Sequence Codex
            </h2>
          </div>
        </div>

        {/* Lore / Story context */}
        <p className="text-sm text-academia-parchmentMuted leading-relaxed mb-4 font-sans">
          You dust off the heavy leatherbound codex resting upon the scholar's desk. Between yellowed parchment leaves, an unfinished alchemical algorithm is inscribed in charcoal ink:
        </p>

        {/* Python Code Block */}
        <div className="relative rounded-xl bg-[#0d0e12] border border-academia-border p-4 mb-5 font-mono text-sm overflow-x-auto shadow-inner-dark">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-academia-border/50 text-xs text-academia-parchmentMuted">
            <span className="flex items-center gap-1.5 text-academia-gold">
              <span className="w-2 h-2 rounded-full bg-academia-gold animate-pulse" />
              scriptorium_cipher.py
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-academia-parchment transition-colors text-[11px] px-2 py-0.5 rounded bg-academia-surface border border-academia-border"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-emerald-300 leading-relaxed">
            <code>{puzzle.code}</code>
          </pre>
        </div>

        {/* Study Notes / Scholar Annotations */}
        <div className="p-4 rounded-xl bg-academia-surface/60 border border-academia-burgundy/40 mb-6 text-xs text-academia-parchmentMuted space-y-1.5">
          <div className="font-serif font-semibold text-academia-gold flex items-center gap-1.5 mb-1 text-sm">
            <span>Scholar's Marginalia:</span>
          </div>
          <p>• <strong>List Slicing:</strong> Slices take the form <code>[start:stop]</code> where <code>stop</code> is exclusive.</p>
          <p>• <strong>List Comprehension:</strong> Iterates through the sliced catalyst and extracts the initial rune letter <code>r[0]</code>.</p>
          <p>• <strong>Length:</strong> <code>len(catalyst)</code> calculates the element count of the sliced sublist.</p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-academia-border/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-academia-border hover:bg-academia-surface text-academia-parchment text-sm font-medium transition-colors"
          >
            Keep Exploring Room
          </button>
          <button
            onClick={onOpenTerminal}
            id="proceed-to-terminal-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-academia-burgundy hover:bg-academia-burgundy-hover text-academia-parchment text-sm font-semibold border border-academia-gold/50 shadow-burgundy-glow transition-all"
          >
            <Terminal className="w-4 h-4 text-academia-gold" />
            <span>Proceed to Cipher Terminal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
