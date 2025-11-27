import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

interface CommentsSectionProps {
  reelId: string;
  onClose: () => void;
}

export function CommentsSection({ reelId, onClose }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${reelId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
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
      id: Date.now().toString(),
      text: newComment,
      timestamp: Date.now(),
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
            <div key={comment.id} className="bg-white/5 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                  👤
                </div>
                <div>
                  <div className="text-xs text-white/70">You • {formatTime(comment.timestamp)}</div>
                  <p className="text-sm">{comment.text}</p>
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
