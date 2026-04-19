'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost, Category } from '@/lib/posts';

// Simple password protection (change this)
const ADMIN_PASSWORD = 'solflight2025';

export default function BlogAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    author: 'SolFlight Team',
  });

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  async function loadData() {
    const [postsRes, catsRes] = await Promise.all([
      fetch('/data/posts.json').then(res => res.json()),
      fetch('/data/categories.json').then(res => res.json()),
    ]);
    setPosts(postsRes);
    setCategories(catsRes);
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
    const newPost: BlogPost = {
      id: editingPost?.id || Date.now().toString(),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()),
      coverImage: form.coverImage || '',
      author: form.author,
      publishedAt: editingPost?.publishedAt || new Date().toISOString(),
      readTime: Math.ceil(form.content.split(' ').length / 200),
    };

    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      loadData();
      resetForm();
      alert('Post saved!');
    }
  }

  async function deletePost(id: string) {
    if (confirm('Delete this article?')) {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadData();
    }
  }

  async function saveCategories() {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categories),
    });
    setEditingCategories(false);
    alert('Categories saved!');
  }

  function addCategory() {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: 'New Category', slug: 'new-category', description: '' },
    ]);
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
      author: 'SolFlight Team',
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
        <form onSubmit={handleLogin} className="w-96 rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="mb-4 text-2xl font-bold">Blog Admin</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-200 px-4 py-2"
          />
          <button type="submit" className="w-full rounded-full bg-sky-600 py-2 text-white">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog Admin</h1>

      {/* Category Management */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Categories</h2>
          <button
            onClick={() => setEditingCategories(!editingCategories)}
            className="text-sm text-sky-600"
          >
            {editingCategories ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editingCategories ? (
          <div>
            {categories.map((cat, idx) => (
              <div key={cat.id} className="mb-3 flex gap-2">
                <input
                  value={cat.name}
                  onChange={(e) => {
                    const newCats = [...categories];
                    newCats[idx].name = e.target.value;
                    newCats[idx].slug = e.target.value.toLowerCase().replace(/[^a-z]+/g, '-');
                    setCategories(newCats);
                  }}
                  className="flex-1 rounded border px-3 py-1"
                  placeholder="Category name"
                />
                <button
                  onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
                  className="px-3 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addCategory} className="mt-2 text-sm text-sky-600">
              + Add category
            </button>
            <div className="mt-4 flex gap-3">
              <button onClick={saveCategories} className="rounded-full bg-sky-600 px-4 py-1 text-white">
                Save Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Write/Edit Article */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">{editingPost ? 'Edit Article' : 'Write New Article'}</h2>
        <div className="space-y-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <input
            placeholder="Slug (URL) - leave empty to auto-generate"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <textarea
            placeholder="Excerpt (short summary)"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <input
            placeholder="Tags (comma separated, e.g., solar, aviation, ai)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <input
            placeholder="Cover image URL (optional)"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            className="w-full rounded-lg border px-4 py-2"
          />
          <textarea
            placeholder="Article content (HTML supported)"
            rows={12}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-lg border px-4 py-2 font-mono text-sm"
          />
          <div className="flex gap-3">
            <button onClick={savePost} className="rounded-full bg-sky-600 px-6 py-2 text-white">
              {editingPost ? 'Update' : 'Publish'}
            </button>
            {editingPost && (
              <button onClick={resetForm} className="rounded-full border border-slate-300 px-6 py-2">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Posts */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Existing Articles</h2>
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-slate-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editPost(post)} className="text-sky-600">Edit</button>
                <button onClick={() => deletePost(post.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
