import { useState, useEffect } from 'react';
import manifest from '../../public/assets/manifest.json?url';
import type { MediaItem } from '../types';

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  isFiller?: boolean;
}

interface CommentsSectionProps {
  reelId: string;
  onClose: () => void;
}

export function CommentsSection({ reelId, onClose }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Load comments from localStorage and combine with filler comments
  useEffect(() => {
    const loadComments = async () => {
      const savedComments = localStorage.getItem(`comments_${reelId}`);
      const currentComments = savedComments ? JSON.parse(savedComments) : [];
      
      try {
        // Fetch manifest data
        const response = await fetch(manifest);
        const manifestData = await response.json();
        
        // Get filler comments from manifest for this reel
        const reelData = manifestData.find((item: any) => item.id === reelId);
        const fillerComments = reelData?.fillerComments?.map((fc: any) => ({
          id: `filler_${fc.timestamp}`,
          username: fc.username,
          text: fc.text,
          timestamp: fc.timestamp,
          isFiller: true
        })) || [];
        
        // Combine filler comments with saved comments, removing duplicates
        const allComments = [
          ...currentComments,
          ...fillerComments.filter(
            (fc: Comment) => !currentComments.some((c: Comment) => c.text === fc.text)
          )
        ].sort((a: Comment, b: Comment) => b.timestamp - a.timestamp);
        
        setComments(allComments);
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments(currentComments);
      }
    };

    loadComments();
  }, [reelId]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments_${reelId}`, JSON.stringify(comments));
    }
  }, [comments, reelId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    
    const comment: Comment = {
      id: `user_${Date.now()}`,
      username: 'You',
      text: newComment,
      timestamp: Date.now(),
      isFiller: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed left-0 top-0 h-full w-full max-w-xs bg-black/90 backdrop-blur-sm border-r border-white/10 shadow-2xl z-50 flex flex-col">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-medium">Comments ({comments.length})</h3>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white p-1"
          aria-label="Close comments"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-2">
        {comments.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <p>No comments yet</p>
            <p className="text-xs mt-1">Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div 
              key={comment.id} 
              className={`p-3 rounded-lg ${comment.isFiller ? 'bg-white/5' : 'bg-white/10'} border ${comment.isFiller ? 'border-white/5' : 'border-white/10'}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                  {comment.username ? comment.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.username || 'User'}</span>
                    <span className="text-xs text-white/50">•</span>
                    <span className="text-xs text-white/50">{formatTime(comment.timestamp)}</span>
                    {comment.isFiller && (
                      <span className="text-[10px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full ml-auto">
                        Filler
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1 break-words">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="p-4 border-t border-white/10 sticky bottom-0 bg-black/90">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <button 
            type="submit" 
            disabled={!newComment.trim()}
            className="px-4 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
