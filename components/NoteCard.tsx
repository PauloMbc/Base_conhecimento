
import React from 'react';
import { Note, Theme } from '../types';

interface NoteCardProps {
  note: Note;
  theme: Theme;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, theme, onDelete, onEdit }) => {
  const isDark = theme === 'dark';

  return (
    <div 
      onClick={() => onEdit(note)}
      className={`
        relative flex flex-col h-60 p-5 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 group cursor-pointer overflow-hidden
        ${isDark 
          ? 'bg-leather-900 border border-gold-faded/20 shadow-[8px_8px_16px_rgba(0,0,0,0.5)] rounded-sm' 
          : 'bg-[#FDF5E6] border border-sepia-900/20 shadow-[4px_8px_15px_rgba(0,0,0,0.1)] -rotate-1 group-even:rotate-1 deckled-edge'
        }
      `}
    >
      {/* Red Wax Seal for Private Notes */}
      {note.isPrivate && (
        <div className="absolute -top-2 -left-2 size-8 z-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-800 rounded-full blur-[1px] opacity-70 animate-pulse"></div>
            <div className="relative size-6 bg-red-900 rounded-full border border-red-950 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white/40 text-[10px]">lock</span>
            </div>
        </div>
      )}

      {/* Bookmark Tab for Dark Mode */}
      {isDark && (
        <div className="absolute -top-1 right-4 w-4 h-8 bg-gradient-to-b from-[#8B0000] to-[#4a0000] shadow-lg flex items-start justify-center pt-1 z-10 transition-all group-hover:h-10"
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
          <span className="material-symbols-outlined text-[8px] text-gold-faded/60">
            {note.icon || 'auto_stories'}
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-start mb-2">
        {!isDark && (
          <span className="material-symbols-outlined text-moss text-lg opacity-30">
            {note.icon || 'auto_stories'}
          </span>
        )}
        <span className={`text-[8px] font-display uppercase tracking-widest ${isDark ? 'text-gold-faded/30' : 'text-sepia-900/20'}`}>
          {note.category}
        </span>
      </div>

      {/* Note Title */}
      <h3 className={`
        font-display text-sm font-bold leading-tight mb-2 line-clamp-1
        ${isDark ? 'text-gold-faded/90 border-b border-gold-faded/10 pb-1' : 'text-sepia-900 border-b border-sepia-900/10 pb-1'}
      `}>
        {note.title}
      </h3>

      {/* Note Body with HTML support */}
      <div className="flex-1 overflow-hidden pointer-events-none">
        <div 
          className={`
            text-[12px] leading-relaxed italic line-clamp-4 prose-sm
            ${isDark ? 'font-antique text-gold-faded/50' : 'font-serif text-sepia-800/80'}
          `}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>

      {/* Footer Timestamp */}
      <div className={`
        mt-2 pt-2 border-t flex justify-between items-center
        ${isDark ? 'border-gold-faded/10' : 'border-sepia-900/5'}
      `}>
        <span className={`
          text-[9px] uppercase tracking-wider
          ${isDark ? 'font-antique text-gold-faded/30' : 'font-script text-lg text-sepia-800/50 lowercase'}
        `}>
          {note.timestamp}
        </span>
        
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'hover:bg-gold-faded/10 text-gold-faded/40 hover:text-red-400' : 'hover:bg-sepia-900/5 text-sepia-900/20 hover:text-red-800'}`}
        >
            <span className="material-symbols-outlined text-[12px]">delete</span>
        </button>
      </div>
    </div>
  );
};
