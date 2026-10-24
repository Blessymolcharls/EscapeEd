import React, { useEffect, useState } from 'react';
import { checkBackendHealth } from '../services/api';
import { BookOpen, Key, Terminal, ShieldAlert, Sparkles, Compass } from 'lucide-react';

interface LandingPageProps {
  onStartGame: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
  const [backendStatus, setBackendStatus] = useState<{ online: boolean; message: string; loading: boolean }>({
    online: false,
    message: 'Probing backend...',
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (isMounted) {
        setBackendStatus({ ...status, loading: false });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-academia-charcoal flex flex-col items-center justify-center px-4 py-12 text-academia-parchment overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-academia-burgundy/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-academia-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl w-full mx-auto flex flex-col items-center text-center">
        {/* Heraldic Crest / Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academia-surface/80 border border-academia-gold/40 text-academia-gold text-xs tracking-widest uppercase mb-6 shadow-inner-dark">
          <Sparkles className="w-3.5 h-3.5 text-academia-gold" />
          <span>Milestone 1 — The Scriptorium Vault</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif tracking-tight text-academia-parchment mb-4 drop-shadow-md">
          Escape<span className="gold-shimmer">Ed</span>
        </h1>

        <p className="text-lg sm:text-xl text-academia-parchmentMuted max-w-2xl mb-8 leading-relaxed font-sans">
          A browser-based Python learning escape room. Traverse the mysterious dark-academia archives, decipher ancient code ciphers, and unlock the exit.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <button
            onClick={onStartGame}
            id="enter-chamber-button"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-gradient-to-r from-academia-burgundy to-academia-burgundy-hover hover:from-academia-burgundy-hover hover:to-academia-burgundy text-academia-parchment font-serif font-semibold text-lg tracking-wide border border-academia-gold/50 shadow-burgundy-glow hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-academia-gold transition-transform group-hover:rotate-45 duration-300" />
            <span>Enter Chamber</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-10">
          <div className="p-6 rounded-xl bg-academia-surface/60 border border-academia-border/80 backdrop-blur-sm hover:border-academia-gold/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-academia-dark flex items-center justify-center border border-academia-gold/30 mb-4 text-academia-gold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-academia-parchment mb-2">1. Inspect the Codex</h3>
            <p className="text-sm text-academia-parchmentMuted leading-relaxed">
              Explore the study chamber. Click the glowing leatherbound codex on the scholar's desk to uncover the alchemical sequence clue.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-academia-surface/60 border border-academia-border/80 backdrop-blur-sm hover:border-academia-gold/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-academia-dark flex items-center justify-center border border-academia-gold/30 mb-4 text-academia-gold">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-academia-parchment mb-2">2. Predict the Output</h3>
            <p className="text-sm text-academia-parchmentMuted leading-relaxed">
              Interact with the central cipher pedestal. Trace Python list slicing, indexing, and string formatting to forecast the exact stdout output.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-academia-surface/60 border border-academia-border/80 backdrop-blur-sm hover:border-academia-gold/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-academia-dark flex items-center justify-center border border-academia-gold/30 mb-4 text-academia-gold">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-academia-parchment mb-2">3. Unseal the Exit</h3>
            <p className="text-sm text-academia-parchmentMuted leading-relaxed">
              A correct solution fractures the runic seal on the heavy iron door, allowing you to escape the scriptorium vault and clear the milestone.
            </p>
          </div>
        </div>

        {/* Backend Connectivity Status Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-academia-dark border border-academia-border text-xs text-academia-parchmentMuted">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              backendStatus.loading
                ? 'bg-amber-400 animate-pulse'
                : backendStatus.online
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : 'bg-amber-500'
            }`}
          />
          <span>Backend Status:</span>
          <span className="font-mono text-academia-parchment">
            {backendStatus.loading ? 'Checking...' : backendStatus.online ? 'Online (FastAPI /api/health)' : 'Offline (Local Fallback Active)'}
          </span>
          {!backendStatus.online && !backendStatus.loading && (
            <span className="text-[11px] text-amber-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Run <code>python -m uvicorn backend.main:app</code>
            </span>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-xs text-academia-parchmentMuted/70 font-mono">
        EscapeEd v1.0.0 • Dark-Academia Python Escape Room • Phaser 3 + React + FastAPI
      </footer>
    </div>
  );
};
