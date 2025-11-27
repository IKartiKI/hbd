import { useState, useEffect } from 'react';
import type { MediaItem } from '../types';
import { Calculator } from './Calculator';
import { CommentsSection } from './CommentsSection';

interface ReelControlsProps {
  item: MediaItem
  liked: boolean
  onLike: () => void
  onSave: () => void
}

export function ReelControls({
  item,
  liked,
  onLike,
  onSave,
}: ReelControlsProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(prev => !prev);
    setShowCalculator(false);
  };

  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCalculator(prev => !prev);
  };

  const closeAllPopups = () => {
    setShowCalculator(false);
    setShowComments(false);
  };

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllPopups();
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <div className="absolute bottom-0 right-0 w-full max-w-[150px] px-4 pb-6 flex flex-col items-end justify-end gap-6 text-white" onClick={(e) => e.stopPropagation()}>
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
          <button 
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src="/assets/media/profile.jpg" 
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+'
              }}
            />
          </button>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        </div>
        <button 
          className="mt-1 text-xs font-medium bg-pink-500 hover:bg-pink-600 px-2 py-1 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
        >
          Follow
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            <span className={`text-2xl transition-transform ${liked ? 'scale-110 text-red-500' : 'scale-100 text-white'}`}>
              {liked ? '💩' : '💩'}
            </span>
          </div>
          <span className="text-xs mt-1 font-medium">87.2K</span>
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Comment"
            className="flex flex-col items-center group"
            onClick={handleCommentClick}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-xs mt-1 font-medium">1.2K</span>
          </button>
          {showComments && (
            <div className="absolute bottom-0 right-0 z-50" onClick={e => e.stopPropagation()}>
              <CommentsSection reelId={item.id} onClose={() => setShowComments(false)} />
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Share reel"
          onClick={(e) => {
            e.stopPropagation();
            const shareMenu = document.getElementById(`share-menu-${item.id}`);
            if (shareMenu) {
              shareMenu.classList.toggle('hidden');
            }
          }}
          className="flex flex-col items-center group"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            <span className="text-2xl">🔄</span>
          </div>
          <span className="text-xs mt-1 font-medium">Share</span>
        </button>
        <div 
          id={`share-menu-${item.id}`}
          className="hidden absolute bottom-20 right-0 w-48 bg-black/90 backdrop-blur-sm rounded-xl p-2 border border-white/10 shadow-2xl z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-xs text-white/70 px-3 py-2 border-b border-white/5">Share to...</div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave();
                closeAllPopups();
              }}
              className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm flex items-center gap-3"
            >
              <span className="text-lg">💾</span>
              <span>Save</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleCalculatorClick}
                className="w-full text-left px-3 py-2.5 hover:bg-white/10 rounded-lg text-sm flex items-center gap-3"
              >
                <span className="text-lg">🧮</span>
                <span>Calculator</span>
              </button>
              {showCalculator && (
                <div className="absolute left-0 bottom-full mb-2" onClick={e => e.stopPropagation()}>
                  <Calculator onClose={() => setShowCalculator(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Music Note */}
      <div className="absolute bottom-24 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        <div className="w-3 h-3 relative">
          <div className="absolute w-full h-0.5 bg-white rounded-full top-1/2 transform -translate-y-1/2"></div>
          <div className="absolute w-1.5 h-1.5 rounded-full border border-white right-0 top-0"></div>
        </div>
        <span className="text-xs font-medium truncate max-w-[100px]">Original Audio</span>
      </div>
    </div>
  )
}


