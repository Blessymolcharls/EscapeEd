import React from 'react';
import { Trophy, CheckCircle, RotateCcw, ArrowRight, BookCheck } from 'lucide-react';

interface CompletionScreenProps {
  elapsedSeconds: number;
  attemptsCount: number;
  onPlayAgain: () => void;
  onReturnToLanding: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  elapsedSeconds,
  attemptsCount,
  onPlayAgain,
  onReturnToLanding,
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec < 10 ? '0' : ''}${remainingSec}s`;
  };

  return (
    <div className="relative min-h-screen bg-academia-charcoal flex flex-col items-center justify-center px-4 py-12 text-academia-parchment animate-fadeIn">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 w-80 h-80 bg-academia-gold/10 rounded-full blur-3xl pointer-events-none" />

      <main 
        className="relative z-10 max-w-xl w-full mx-auto bg-gradient-to-b from-[#1b1c24] to-[#121318] border-2 border-academia-gold/60 rounded-2xl shadow-2xl p-8 text-center"
        id="completion-screen"
      >
        {/* Heraldic Laurel / Trophy */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-academia-burgundy to-academia-burgundy-dark border-2 border-academia-gold flex items-center justify-center text-academia-gold mb-6 shadow-gold-glow">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-4">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Milestone 1 Complete</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-academia-parchment mb-3">
          The Scriptorium Vault Escaped!
        </h1>

        <p className="text-sm text-academia-parchmentMuted max-w-md mx-auto mb-8 leading-relaxed font-sans">
          You conquered the alchemical sequence cipher, unlatched the grand iron portcullis, and stepped beyond the chamber. Your Python indexing mastery shines.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 rounded-xl bg-academia-surface/70 border border-academia-border">
            <div className="text-xs font-mono text-academia-parchmentMuted uppercase tracking-wider mb-1">
              Time Elapsed
            </div>
            <div className="text-xl font-bold font-mono text-academia-gold">
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-academia-surface/70 border border-academia-border">
            <div className="text-xs font-mono text-academia-parchmentMuted uppercase tracking-wider mb-1">
              Predictions Tested
            </div>
            <div className="text-xl font-bold font-mono text-academia-parchment">
              {attemptsCount} {attemptsCount === 1 ? 'Attempt' : 'Attempts'}
            </div>
          </div>
        </div>

        {/* Learning Mastery summary */}
        <div className="p-4 rounded-xl bg-academia-dark border border-academia-border/80 text-left mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-academia-gold uppercase tracking-wider">
            <BookCheck className="w-4 h-4 text-academia-gold" />
            <span>Python Concepts Mastered:</span>
          </div>
          <ul className="text-xs text-academia-parchmentMuted space-y-1 list-disc list-inside">
            <li>List slicing notation with exclusive stop bounds <code>[1:4]</code></li>
            <li>List comprehension iteration & character indexing <code>r[0]</code></li>
            <li>String method joining <code>"".join(...)</code></li>
            <li>Formatted string literals (f-strings) and collection lengths <code>len(...)</code></li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onPlayAgain}
            id="play-again-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-academia-burgundy hover:bg-academia-burgundy-hover text-academia-parchment font-serif font-semibold text-sm border border-academia-gold/50 shadow-burgundy-glow transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-academia-gold" />
            <span>Replay Chamber</span>
          </button>

          <button
            onClick={onReturnToLanding}
            id="return-landing-button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-academia-border hover:bg-academia-surface text-academia-parchment text-sm font-medium transition-colors"
          >
            <span>Exit to Main Hall</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
