import React, { useState } from 'react';
import { Terminal, X, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Loader2, Key } from 'lucide-react';
import type { PuzzleInfo } from '../types/game';
import { verifyAnswer } from '../services/api';

interface PuzzleTerminalModalProps {
  puzzle: PuzzleInfo;
  isOpen: boolean;
  isUnlocked: boolean;
  onClose: () => void;
  onPuzzleSolved: () => void;
  onProceedToDoor: () => void;
}

export const PuzzleTerminalModal: React.FC<PuzzleTerminalModalProps> = ({
  puzzle,
  isOpen,
  isUnlocked,
  onClose,
  onPuzzleSolved,
  onProceedToDoor,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(
    isUnlocked ? 'correct' : null
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);
    setHintMessage(null);

    try {
      const res = await verifyAnswer(answerInput);
      if (res.correct) {
        setFeedbackType('correct');
        setStatusMessage(res.message);
        onPuzzleSolved();
      } else {
        setFeedbackType('incorrect');
        setStatusMessage(res.message);
        if (res.hint) {
          setHintMessage(res.hint);
        }
      }
    } catch {
      setFeedbackType('incorrect');
      setStatusMessage('Network disturbance: Failed to query cipher verification service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1b1c23] to-[#121317] border-2 border-academia-border hover:border-academia-gold/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-academia-parchment"
        id="puzzle-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-terminal-button"
          className="absolute top-4 right-4 p-2 text-academia-parchmentMuted hover:text-academia-parchment hover:bg-academia-surface rounded-lg transition-colors"
          title="Close terminal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-academia-burgundy/30 border border-academia-burgundy flex items-center justify-center text-academia-gold">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-academia-gold">
              Output-Prediction Challenge
            </div>
            <h2 className="text-2xl font-serif font-bold text-academia-parchment">
              The Scribe's Sequence Cipher
            </h2>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-academia-parchmentMuted mb-4 leading-relaxed">
          Predict the exact stdout printed by running the script below. Enter your prediction into the alchemical input console.
        </div>

        {/* Python Snippet Display */}
        <div className="relative rounded-xl bg-[#0a0b0e] border border-academia-border/80 p-4 mb-5 font-mono text-sm shadow-inner-dark overflow-x-auto">
          <pre className="text-amber-200/90 leading-relaxed">
            <code>{puzzle.code}</code>
          </pre>
        </div>

        {/* Feedback Alert States */}
        {feedbackType === 'correct' && (
          <div 
            id="puzzle-feedback-correct"
            className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 mb-5 flex items-start gap-3 animate-fadeIn text-emerald-200"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-300 font-serif text-sm">
                Runic Seal Fractured! Exit Unlocked.
              </div>
              <p className="text-xs mt-1 text-emerald-200/80 leading-relaxed">
                {statusMessage || 'The mechanism accepted your prediction. The heavy iron door in the north wall is unlatched!'}
              </p>
            </div>
          </div>
        )}

        {feedbackType === 'incorrect' && (
          <div 
            id="puzzle-feedback-incorrect"
            className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 mb-5 flex items-start gap-3 animate-fadeIn text-rose-200"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div className="w-full">
              <div className="font-semibold text-rose-300 font-serif text-sm">
                Incorrect Output Prediction
              </div>
              <p className="text-xs mt-1 text-rose-200/85 leading-relaxed">
                {statusMessage}
              </p>
              {hintMessage && (
                <div className="mt-2.5 pt-2 border-t border-rose-900/60 text-xs text-amber-200/90 flex items-start gap-1.5">
                  <span className="font-semibold text-amber-300 shrink-0">Cipher Hint:</span>
                  <span>{hintMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Form */}
        {!isUnlocked && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="cipher-input" 
                className="block text-xs font-mono uppercase text-academia-parchmentMuted tracking-wider mb-2"
              >
                Predicted Standard Output:
              </label>
              <div className="relative">
                <input
                  id="cipher-input"
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="e.g. ATE_3"
                  className="w-full px-4 py-3 rounded-xl bg-academia-dark border border-academia-border focus:border-academia-gold focus:outline-none focus:ring-1 focus:ring-academia-gold font-mono text-base text-academia-parchment placeholder-academia-parchmentMuted/40 shadow-inner-dark"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowHintPrompt(!showHintPrompt)}
                className="inline-flex items-center gap-1.5 text-xs text-academia-parchmentMuted hover:text-academia-gold transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-academia-gold" />
                <span>{showHintPrompt ? 'Hide Hint' : 'Need a Clue Hint?'}</span>
              </button>

              <button
                type="submit"
                id="submit-prediction-button"
                disabled={!answerInput.trim() || isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-academia-burgundy hover:bg-academia-burgundy-hover disabled:opacity-50 disabled:cursor-not-allowed text-academia-parchment text-sm font-semibold border border-academia-gold/50 shadow-burgundy-glow transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-academia-gold" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Prediction</span>
                    <ArrowRight className="w-4 h-4 text-academia-gold" />
                  </>
                )}
              </button>
            </div>

            {showHintPrompt && (
              <div className="p-3 rounded-lg bg-academia-surface/80 border border-academia-border text-xs text-academia-parchmentMuted mt-3 animate-fadeIn">
                <strong className="text-academia-gold">Slicing Tip:</strong>{' '}
                <code>runes[1:4]</code> selects elements from index 1 up to (but not including) index 4.
                Then each element's first letter is collected and joined, followed by an underscore and the count of items in the slice.
              </div>
            )}
          </form>
        )}

        {/* Once Unlocked Actions */}
        {isUnlocked && (
          <div className="mt-6 pt-4 border-t border-academia-border flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-academia-border hover:bg-academia-surface text-academia-parchment text-sm font-medium transition-colors"
            >
              Return to Chamber
            </button>
            <button
              onClick={onProceedToDoor}
              id="proceed-to-exit-button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              <Key className="w-4 h-4 text-yellow-300" />
              <span>Step Through Unsealed Exit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
