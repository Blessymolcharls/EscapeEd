import React, { useState } from 'react';
import type { ScreenState } from './types/game';
import { LandingPage } from './components/LandingPage';
import { GameScreen } from './components/GameScreen';
import { CompletionScreen } from './components/CompletionScreen';

export const App: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>('landing');
  const [completionStats, setCompletionStats] = useState<{
    elapsedSeconds: number;
    attemptsCount: number;
  }>({
    elapsedSeconds: 0,
    attemptsCount: 0,
  });

  const handleStartGame = () => {
    setScreenState('playing');
  };

  const handleChamberEscaped = (stats: { elapsedSeconds: number; attemptsCount: number }) => {
    setCompletionStats(stats);
    setScreenState('escaped');
  };

  const handlePlayAgain = () => {
    setScreenState('playing');
  };

  const handleReturnToLanding = () => {
    setScreenState('landing');
  };

  return (
    <div className="min-h-screen bg-academia-charcoal text-academia-parchment font-sans">
      {screenState === 'landing' && (
        <LandingPage onStartGame={handleStartGame} />
      )}

      {screenState === 'playing' && (
        <GameScreen
          onChamberEscaped={handleChamberEscaped}
          onReturnToLanding={handleReturnToLanding}
        />
      )}

      {screenState === 'escaped' && (
        <CompletionScreen
          elapsedSeconds={completionStats.elapsedSeconds}
          attemptsCount={completionStats.attemptsCount}
          onPlayAgain={handlePlayAgain}
          onReturnToLanding={handleReturnToLanding}
        />
      )}
    </div>
  );
};

export default App;
