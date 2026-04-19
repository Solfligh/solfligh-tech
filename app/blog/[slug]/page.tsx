'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/app/components/PageHeader';
import { BlogPost, Category, getCategories } from '@/lib/posts';
import { fetchComments, addComment, Comment } from '@/lib/comments';

export default function ArticlePage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [postsRes, categoriesRes] = await Promise.all([
        fetch('/data/posts.json').then(res => res.json()),
        fetch('/data/categories.json').then(res => res.json()),
      ]);
      
      const foundPost = postsRes.find((p: BlogPost) => p.slug === slug);
      setPost(foundPost || null);
      setCategories(categoriesRes);
      
      if (foundPost) {
        const fetchedComments = await fetchComments(slug as string);
        setComments(fetchedComments);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim()) return;
    
    setSubmitting(true);
    const success = await addComment({
      postSlug: slug as string,
      authorName: commentForm.name,
      content: commentForm.content,
    });
    
    if (success) {
      setSubmitted(true);
      setCommentForm({ name: '', content: '' });
      setTimeout(() => setSubmitted(false), 3000);
      // Refresh comments
      const newComments = await fetchComments(slug as string);
      setComments(newComments);
    }
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

  const category = categories.find(c => c.slug === post.category);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-premium pt-20 pb-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-4">
            <Link href="/blog" className="text-sm text-sky-600 hover:underline">
              ← Back to all articles
            </Link>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
              {category?.name || post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative mx-auto mt-8 h-96 w-full max-w-4xl overflow-hidden rounded-2xl px-4">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-4 py-12">
        <div 
          className="prose prose-slate prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Comments Section */}
      <div className="mx-auto max-w-3xl px-4 py-12 border-t border-slate-200">
        <h3 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h3>
        
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8 rounded-2xl bg-slate-50 p-6">
          {submitted && (
            <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
              Comment submitted! It will appear after approval.
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Share your thoughts..."
              rows={4}
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-slate-500">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{comment.authorName}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
