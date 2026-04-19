'use client';

import { useState, useEffect } from 'react';

// Simple password protection
const ADMIN_PASSWORD = 'solfligh2025';

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
  description?: string;
}

export default function BlogAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    author: 'SolFligh Team',
  });

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  async function loadData() {
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch('/data/posts.json').then(res => res.json()).catch(() => []),
        fetch('/data/categories.json').then(res => res.json()).catch(() => []),
      ]);
      setPosts(postsRes);
      setCategories(catsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  }

  async function savePost() {
    if (!form.title || !form.content) {
      alert('Please fill in title and content');
      return;
    }

    const newPost: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: form.title,
      excerpt: form.excerpt || form.content.slice(0, 150).replace(/<[^>]*>/g, ''),
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
      coverImage: form.coverImage || '',
      author: form.author,
      publishedAt: editingPost?.publishedAt || new Date().toISOString(),
      readTime: Math.ceil(form.content.replace(/<[^>]*>/g, '').split(' ').length / 200) || 1,
    };

    // Save to file via API
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      await loadData();
      resetForm();
      alert('Post saved successfully!');
    } else {
      alert('Error saving post');
    }
  }

  async function deletePost(id: string) {
    if (confirm('Delete this article?')) {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      await loadData();
    }
  }

  async function saveCategories() {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categories),
    });

    if (response.ok) {
      setEditingCategories(false);
      alert('Categories saved!');
      await loadData();
    }
  }

  function addCategory() {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: 'New Category', slug: 'new-category', description: '' },
    ]);
  }

  function updateCategory(index: number, field: keyof Category, value: string) {
    const newCats = [...categories];
    if (field === 'name') {
      newCats[index].name = value;
      newCats[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    } else {
      newCats[index][field] = value as any;
    }
    setCategories(newCats);
  }

  function removeCategory(index: number) {
    setCategories(categories.filter((_, i) => i !== index));
  }

  function resetForm() {
    setEditingPost(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      coverImage: '',
      author: 'SolFligh Team',
    });
  }

  function editPost(post: BlogPost) {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      coverImage: post.coverImage,
      author: post.author,
    });
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleLogin} className="w-96 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Blog Admin</h1>
          <p className="mb-4 text-sm text-slate-500">Enter password to manage articles and categories</p>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-full bg-sky-600 py-2 text-white hover:bg-sky-500">
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog Admin Dashboard</h1>

      {/* Category Management Section */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">📂 Manage Categories</h2>
          <button
            onClick={() => setEditingCategories(!editingCategories)}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            {editingCategories ? 'Cancel' : 'Edit Categories'}
          </button>
        </div>

        {editingCategories ? (
          <div>
            <div className="mb-4 text-sm text-slate-500">
              Categories appear as filters on your blog. Readers can filter articles by category.
            </div>
            {categories.map((cat, idx) => (
              <div key={cat.id} className="mb-3 flex gap-2">
                <input
                  value={cat.name}
                  onChange={(e) => updateCategory(idx, 'name', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
                  placeholder="Category name"
                />
                <input
                  value={cat.description || ''}
                  onChange={(e) => updateCategory(idx, 'description', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
                  placeholder="Description (optional)"
                />
                <button
                  onClick={() => removeCategory(idx)}
                  className="px-3 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addCategory} className="mt-2 text-sm text-sky-600 hover:underline">
              + Add New Category
            </button>
            <div className="mt-4 flex gap-3">
              <button onClick={saveCategories} className="rounded-full bg-sky-600 px-6 py-2 text-white hover:bg-sky-500">
                Save All Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p className="text-slate-400">No categories yet. Click "Edit Categories" to add some.</p>
            ) : (
              categories.map((cat) => (
                <span key={cat.id} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {cat.name}
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Write/Edit Article Section */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">{editingPost ? '✏️ Edit Article' : '✍️ Write New Article'}</h2>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Title *</label>
            <input
              placeholder="Article title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Slug (URL) - leave empty to auto-generate</label>
            <input
              placeholder="my-article-url"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            >
              <option value="">-- Select a category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                ⚠️ No categories yet. Add some in the "Manage Categories" section above.
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Excerpt (short summary)</label>
            <textarea
              placeholder="A brief summary of the article..."
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Tags (comma separated)</label>
            <input
              placeholder="solar, aviation, ai, sustainability"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Cover Image URL</label>
            <input
              placeholder="https://example.com/image.jpg"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Author</label>
            <input
              placeholder="Author name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Content (HTML supported) *</label>
            <textarea
              placeholder="Write your article here. Use HTML for formatting: <p>, <h2>, <ul>, <li>, <img src='...'>, etc."
              rows={15}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 font-mono text-sm focus:border-sky-400 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button onClick={savePost} className="rounded-full bg-sky-600 px-6 py-2 text-white hover:bg-sky-500">
              {editingPost ? 'Update Article' : 'Publish Article'}
            </button>
            {editingPost && (
              <button onClick={resetForm} className="rounded-full border border-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-50">
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Posts Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold">📄 Existing Articles ({posts.length})</h2>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No articles yet. Write your first article above!
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{post.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>📅 {new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>📂 {post.category}</span>
                    <span>🏷️ {post.tags.join(', ')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editPost(post)} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-sky-600 hover:bg-slate-200">
                    Edit
                  </button>
                  <button onClick={() => deletePost(post.id)} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-500 hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}