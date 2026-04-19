'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  content: string;
  createdAt: string;
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  'software-engineering': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  'ai-automation': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  'web-development': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-emerald-600' },
  'mobile-development': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-500 to-orange-600' },
  'tech-insights': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', gradient: 'from-rose-500 to-rose-600' },
};

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryStyle, setCategoryStyle] = useState(categoryColors['software-engineering']);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const postsRes = await fetch('/data/posts.json');
        const postsData = await postsRes.json();
        
        const categoriesRes = await fetch('/data/categories.json');
        const categoriesData = await categoriesRes.json();
        
        const foundPost = postsData.find((p: BlogPost) => p.slug === slug);
        setPost(foundPost || null);
        
        if (foundPost) {
          const cat = categoriesData.find((c: Category) => c.slug === foundPost.category);
          setCategoryName(cat?.name || foundPost.category);
          setCategoryStyle(categoryColors[foundPost.category] || categoryColors['software-engineering']);
          
          // Load comments for this post
          await loadComments(foundPost.slug);
        }
        
        // Load likes from localStorage
        const savedLikes = localStorage.getItem(`likes_${slug}`);
        const liked = localStorage.getItem(`liked_${slug}`);
        if (savedLikes) setLikes(parseInt(savedLikes));
        if (liked === 'true') setHasLiked(true);
      } catch (error) {
        console.error('Error loading article:', error);
      }
      setLoading(false);
    }
    
    if (slug) {
      loadData();
    }
  }, [slug]);

  async function loadComments(postSlug: string) {
    try {
      const savedComments = localStorage.getItem(`comments_${postSlug}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  async function addCommentToStorage(postSlug: string, name: string, content: string) {
    const newComment: Comment = {
      id: Date.now().toString(),
      postSlug,
      authorName: name,
      content,
      createdAt: new Date().toISOString(),
    };
    
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${postSlug}`, JSON.stringify(updatedComments));
  }

  const handleLike = () => {
    if (!hasLiked && post) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      localStorage.setItem(`likes_${slug}`, newLikes.toString());
      localStorage.setItem(`liked_${slug}`, 'true');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim() || !post) return;
    
    setSubmitting(true);
    await addCommentToStorage(post.slug, commentForm.name, commentForm.content);
    setCommentSubmitted(true);
    setCommentForm({ name: '', content: '' });
    setTimeout(() => setCommentSubmitted(false), 3000);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-sky-600 hover:underline">
          ← Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden pt-20 pb-16">
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryStyle.gradient.replace('from-', 'from-').replace('to-', 'to-')} opacity-10`} />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-4xl px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 transition-colors mb-6 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </Link>
          
          <div className="mb-4">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {categoryName}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl leading-tight">
            {post.title}
          </h1>
          
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                {post.author.charAt(0)}
              </div>
              <span className="font-medium text-slate-700">{post.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative mx-auto max-w-4xl px-4 -mt-8 mb-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full object-cover max-h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
      )}

      {/* Article Content - ENHANCED with better text styling */}
      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="prose prose-slate prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:text-slate-900 prose-h1:mt-12 prose-h1:mb-6
          prose-h2:text-2xl prose-h2:text-slate-800 prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-sky-400 prose-h2:pl-4
          prose-h3:text-xl prose-h3:text-slate-800 prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-sky-700
          prose-h4:text-lg prose-h4:text-slate-700 prose-h4:font-semibold
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
          prose-strong:text-slate-900 prose-strong:font-semibold prose-strong:bg-amber-50 prose-strong:px-1 prose-strong:rounded
          prose-em:text-slate-600 prose-em:italic
          prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:text-sky-700
          prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
          prose-blockquote:border-l-4 prose-blockquote:border-sky-400 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:font-medium prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
          prose-li:text-slate-700 prose-li:mb-1
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          prose-hr:my-12 prose-hr:border-slate-200
          prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:px-4 prose-th:py-2 prose-th:bg-slate-100
          prose-td:border prose-td:border-slate-300 prose-td:px-4 prose-td:py-2
        ">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {/* Interactive Bar - Likes & Share */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                hasLiked 
                  ? 'bg-rose-500 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-600'
              }`}
            >
              <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Share this article:</span>
              <button
                onClick={() => navigator.share ? navigator.share({ title: post.title, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-5-5A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-semibold text-slate-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="group px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-sm font-medium hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 transition-all cursor-default shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Section */}
        <div className={`mt-12 p-6 rounded-2xl bg-gradient-to-r ${categoryStyle.bg} border ${categoryStyle.border} shadow-sm`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {post.author.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Written by {post.author}</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                SolFligh Tech  Building intelligent, scalable software solutions across web, mobile, automation, and AI systems.
              </p>
              <Link href="/blog" className={`inline-flex items-center gap-1 text-sm ${categoryStyle.text} hover:opacity-80 mt-3 font-medium transition-all group`}>
                More from SolFligh Blog
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section - WORKING NOW */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments ({comments.length})
            </h3>
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className={`mb-8 p-6 rounded-2xl ${categoryStyle.bg} border ${categoryStyle.border}`}>
            {commentSubmitted && (
              <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-300 p-3 text-emerald-700 text-sm">
                ✨ Comment posted successfully!
              </div>
            )}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your name *"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Share your thoughts... *"
                rows={4}
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${categoryStyle.gradient} text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50`}
            >
              {submitting ? 'Posting...' : 'Post Comment 💬'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-slate-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="group p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all hover:border-sky-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${categoryStyle.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">{comment.authorName}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 pl-10">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </main>
  );
}