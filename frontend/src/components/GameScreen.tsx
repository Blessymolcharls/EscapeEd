import React, { useState, useEffect } from 'react';
import { EventBus, GAME_EVENTS } from '../game/EventBus';
import { PhaserGame } from '../game/PhaserGame';
import { GameHUD } from './GameHUD';
import { ClueModal } from './ClueModal';
import { PuzzleTerminalModal } from './PuzzleTerminalModal';
import { ExitModal } from './ExitModal';
import { LoreModal } from './LoreModal';
import type { PuzzleInfo } from '../types/game';
import { fetchPuzzle } from '../services/api';

interface GameScreenProps {
  onChamberEscaped: (stats: { elapsedSeconds: number; attemptsCount: number }) => void;
  onReturnToLanding: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  onChamberEscaped,
  onReturnToLanding,
}) => {
  const [puzzle, setPuzzle] = useState<PuzzleInfo | null>(null);
  const [clueDiscovered, setClueDiscovered] = useState<boolean>(false);
  const [exitUnlocked, setExitUnlocked] = useState<boolean>(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<'clue' | 'terminal' | 'exit' | 'lore' | null>(null);
  const [loreInfo, setLoreInfo] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch puzzle metadata on mount
  useEffect(() => {
    let isMounted = true;
    fetchPuzzle().then((p) => {
      if (isMounted) setPuzzle(p);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Subscribe to Phaser EventBus
  useEffect(() => {
    const handleObjectClicked = (data: { id: string; name: string; description: string }) => {
      if (data.id === 'clue_tome') {
        setClueDiscovered(true);
        setActiveModal('clue');
      } else if (data.id === 'puzzle_terminal') {
        setActiveModal('terminal');
      } else if (data.id === 'exit_door') {
        setActiveModal('exit');
      } else if (data.id === 'bookshelf') {
        setLoreInfo({ title: data.name, description: data.description });
        setActiveModal('lore');
      }
    };

    const handleTriggerEscape = () => {
      onChamberEscaped({ elapsedSeconds, attemptsCount: attemptsCount || 1 });
    };

    EventBus.on(GAME_EVENTS.OBJECT_CLICKED, handleObjectClicked);
    EventBus.on(GAME_EVENTS.TRIGGER_ESCAPE, handleTriggerEscape);

    return () => {
      EventBus.off(GAME_EVENTS.OBJECT_CLICKED, handleObjectClicked);
      EventBus.off(GAME_EVENTS.TRIGGER_ESCAPE, handleTriggerEscape);
    };
  }, [elapsedSeconds, attemptsCount, onChamberEscaped]);

  const handlePuzzleSolved = () => {
    setAttemptsCount((prev) => prev + 1);
    setExitUnlocked(true);
    // Tell Phaser room scene to animate the door opening
    EventBus.emit(GAME_EVENTS.UPDATE_DOOR_STATE, { isLocked: false });
  };

  const handleResetRoom = () => {
    setClueDiscovered(false);
    setExitUnlocked(false);
    setAttemptsCount(0);
    setActiveModal(null);
    EventBus.emit(GAME_EVENTS.RESET_ROOM);
  };

  const handleEscape = () => {
    setActiveModal(null);
    onChamberEscaped({ elapsedSeconds, attemptsCount: attemptsCount || 1 });
  };

  return (
    <div className="relative min-h-screen bg-academia-charcoal flex flex-col items-center justify-start p-4 sm:p-6 text-academia-parchment">
      {/* Game HUD */}
      <GameHUD
        clueDiscovered={clueDiscovered}
        exitUnlocked={exitUnlocked}
        onOpenClue={() => setActiveModal('clue')}
        onOpenTerminal={() => setActiveModal('terminal')}
        onResetRoom={handleResetRoom}
        onReturnToLanding={onReturnToLanding}
      />

      {/* Main Game Screen Canvas */}
      <main className="w-full flex flex-col items-center justify-center">
        <PhaserGame />

        {/* Room Interactive Legend / Guide */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-academia-parchmentMuted/80 text-center flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-academia-burgundy border border-academia-gold/50" />
            Click Scholar Desk to Inspect Codex
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-academia-surface border border-academia-gold/50" />
            Click Stone Pedestal to Solve Cipher
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 border border-emerald-400" />
            Click Iron Door to Escape
          </span>
        </div>
      </main>

      {/* Modals & Overlays */}
      {puzzle && (
        <>
          <ClueModal
            puzzle={puzzle}
            isOpen={activeModal === 'clue'}
            onClose={() => setActiveModal(null)}
            onOpenTerminal={() => setActiveModal('terminal')}
          />

          <PuzzleTerminalModal
            puzzle={puzzle}
            isOpen={activeModal === 'terminal'}
            isUnlocked={exitUnlocked}
            onClose={() => setActiveModal(null)}
            onPuzzleSolved={handlePuzzleSolved}
            onProceedToDoor={() => {
              setActiveModal(null);
              // Open exit modal or escape
              setActiveModal('exit');
            }}
          />
        </>
      )}

      <ExitModal
        isOpen={activeModal === 'exit'}
        isUnlocked={exitUnlocked}
        onClose={() => setActiveModal(null)}
        onOpenTerminal={() => setActiveModal('terminal')}
        onEscape={handleEscape}
      />

      <LoreModal
        isOpen={activeModal === 'lore'}
        title={loreInfo.title}
        description={loreInfo.description}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
