import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Upload,
  ShieldCheck,
  Flag,
  Filter,
  CheckCircle2,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { ReviewItem } from '../../types';

interface ReviewsModuleProps {
  targetId: string;
  targetTitle: string;
  targetType: ReviewItem['targetType'];
  initialRating?: number;
}

export const ReviewsModule: React.FC<ReviewsModuleProps> = ({
  targetId,
  targetTitle,
  targetType,
  initialRating = 4.8,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev_101',
      targetId,
      targetType,
      userName: 'Marcus Sterling',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      rating: 5,
      date: 'July 24, 2026',
      comment: 'Exceeded all expectations! The check-in process was smooth, staff gave fantastic recommendations for local hidden gems, and the ocean view was unreal.',
      photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600'],
      verifiedBooking: true,
      helpfulVotes: 14,
    },
    {
      id: 'rev_102',
      targetId,
      targetType,
      userName: 'Camila Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      rating: 4,
      date: 'June 18, 2026',
      comment: 'Very comfortable & clean. Only minor feedback is that airport transfer pickup was delayed by 10 mins, but overall great experience.',
      verifiedBooking: true,
      helpfulVotes: 6,
    },
  ]);

  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleHelpful = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
  };

  const handleReport = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, reported: true } : r))
    );
    alert('Thank you. Review has been submitted to moderation team for audit.');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      targetId,
      targetType,
      userName: 'Alex Mercer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      rating: newRating,
      date: 'Just now',
      comment: newComment,
      photos: newPhotoUrl ? [newPhotoUrl] : undefined,
      verifiedBooking: true,
      helpfulVotes: 1,
    };

    setReviews([newRev, ...reviews]);
    setShowAddForm(false);
    setNewComment('');
    setNewPhotoUrl('');
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (onlyVerified && !r.verifiedBooking) return false;
    return true;
  });

  return (
    <div id="reviews-ratings-module" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Module Title & Rating Overview Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900">Verified Ratings &amp; Traveler Reviews</h3>
          <p className="text-xs text-slate-500">Authentic feedback from travelers who completed bookings</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-xl font-extrabold text-slate-900 leading-none">{initialRating}</span>
              <span className="text-[10px] text-slate-500 block">Out of 5.0 ({reviews.length} reviews)</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            {showAddForm ? 'Cancel Review' : '+ Write Review'}
          </button>
        </div>
      </div>

      {/* Write Review Form */}
      {showAddForm && (
        <form onSubmit={handleAddReview} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
          <h4 className="font-extrabold text-slate-900 text-xs">Share your experience for {targetTitle}</h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setNewRating(star)}
                className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${
                  star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Describe what you liked, room/seat condition, service quality..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="Optional Photo URL (e.g. https://images.unsplash.com/...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white font-bold text-xs px-6 py-2 rounded-xl shadow-xs">
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter:</span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              filterRating === 'all' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                filterRating === r ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verified Bookings Only</span>
        </label>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 divide-y divide-slate-100">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-slate-400 text-xs py-4">No reviews match the selected filter criteria.</p>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-400/30" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-xs">{rev.userName}</h4>
                      {rev.verifiedBooking && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Traveler
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

              {rev.photos && rev.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {rev.photos.map((p, idx) => (
                    <img key={idx} src={p} alt="Review attachment" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs" />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1.5 hover:text-orange-600 font-semibold"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" /> Was this review helpful? ({rev.helpfulVotes})
                </button>

                {rev.reported ? (
                  <span className="text-rose-500 font-bold flex items-center gap-1 text-[10px]">
                    <AlertCircle className="w-3 h-3" /> Reported for Moderation
                  </span>
                ) : (
                  <button
                    onClick={() => handleReport(rev.id)}
                    className="hover:text-rose-600 font-medium flex items-center gap-1 text-slate-400"
                  >
                    <Flag className="w-3 h-3" /> Report
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
