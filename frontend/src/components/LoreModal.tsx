import React from 'react';
import { Library, X } from 'lucide-react';

interface LoreModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#1b1c23] to-[#121317] border-2 border-academia-border rounded-2xl shadow-2xl p-6 text-academia-parchment"
        id="lore-modal"
      >
        <button
          onClick={onClose}
          id="close-lore-modal-button"
          className="absolute top-4 right-4 p-2 text-academia-parchmentMuted hover:text-academia-parchment hover:bg-academia-surface rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-academia-surface border border-academia-border flex items-center justify-center text-academia-gold">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-academia-gold tracking-wider">
              Chamber Lore
            </div>
            <h3 className="text-lg font-serif font-bold text-academia-parchment">{title}</h3>
          </div>
        </div>

        <p className="text-sm text-academia-parchmentMuted leading-relaxed mb-6 font-sans">
          {description}
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-academia-surface hover:bg-academia-surface/80 text-academia-parchment text-sm border border-academia-border transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
