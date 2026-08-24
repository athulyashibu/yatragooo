import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Share2, Plus, ArrowRight } from 'lucide-react';
import { CommunityStory } from '../../types';

interface CommunityViewProps {
  stories: CommunityStory[];
}

export const CommunityView: React.FC<CommunityViewProps> = ({ stories: initialStories }) => {
  const [stories, setStories] = useState<CommunityStory[]>(initialStories);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleLike = (id: string) => {
    setStories(
      stories.map((st) => (st.id === id ? { ...st, likes: st.likes + 1 } : st))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newStory: CommunityStory = {
      id: `st_${Date.now()}`,
      authorName: 'Alex Mercer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      title: newTitle,
      destination: newDestination || 'Global Explorer',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      excerpt: newContent.slice(0, 100) + '...',
      content: newContent,
      likes: 1,
      commentsCount: 0,
      date: 'Just now',
      tags: ['Travel Story', 'VoyageGo Community'],
    };

    setStories([newStory, ...stories]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDestination('');
    setNewContent('');
  };

  return (
    <div id="community-module" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">VoyageGo Travel Community &amp; Stories</h2>
          <p className="text-xs text-slate-500">Real travel logs, hidden gem tips, and advice from globe-trotters</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Share Your Story
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((st) => (
          <div key={st.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
            <div className="h-48 rounded-2xl overflow-hidden relative">
              <img src={st.coverImage} alt={st.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                {st.destination}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <img src={st.authorAvatar} alt={st.authorName} className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-400" />
              <div>
                <p className="text-xs font-bold text-slate-800">{st.authorName}</p>
                <p className="text-[10px] text-slate-400">{st.date}</p>
              </div>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base leading-snug">{st.title}</h3>
            <p className="text-xs text-slate-600 line-clamp-2">{st.excerpt}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
              <button
                onClick={() => handleLike(st.id)}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" /> {st.likes} Likes
              </button>

              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-400" /> {st.commentsCount} Comments
              </span>

              <span className="flex items-center gap-1 cursor-pointer hover:text-orange-600">
                <Share2 className="w-4 h-4 text-slate-400" /> Share
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreatePost} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900">Publish Travel Story</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-500">✕</button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Story Title</label>
              <input
                type="text"
                placeholder="e.g. My 5-day food trail in Tokyo"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination</label>
              <input
                type="text"
                placeholder="e.g. Tokyo, Japan"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Story Content</label>
              <textarea
                rows={4}
                placeholder="Share your experience, recommendations, and budget tips..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white font-bold text-xs py-3 rounded-xl shadow-md">
              Publish Story to Community
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
