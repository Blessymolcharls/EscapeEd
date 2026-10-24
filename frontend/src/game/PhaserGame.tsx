import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { RoomScene } from './RoomScene';

interface PhaserGameProps {
  onSceneReady?: () => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 520,
      backgroundColor: '#121316',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [RoomScene],
      render: {
        pixelArt: false,
        antialias: true,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-[800/520] max-w-4xl mx-auto rounded-xl overflow-hidden border-2 border-academia-border shadow-2xl bg-academia-charcoal">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      {/* Subtle Dark Academia Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none vignette-overlay border border-academia-gold/20 rounded-xl" />
    </div>
  );
};
