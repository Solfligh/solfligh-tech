'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/app/components/PageHeader';
import { BlogPost, Category, getPosts, getCategories } from '@/lib/posts';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [postsData, categoriesData] = await Promise.all([
        fetch('/data/posts.json').then(res => res.json()),
        fetch('/data/categories.json').then(res => res.json()),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.name || slug;
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-premium pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <PageHeader
            badge="Our Journal"
            title="SolFlight Blog"
            subtitle="Insights, breakthroughs, and stories from the frontier of sustainable technology and aviation."
            level={1}
          />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 pl-9 text-sm focus:border-sky-400 focus:outline-none"
              />
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">No articles found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group card-premium overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {getCategoryName(post.category)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
