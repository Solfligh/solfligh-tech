'use client';

import { useState, useEffect } from 'react';

// Admin auth uses the server-side ADMIN_TOKEN, sent as an x-admin-token header
// on every /api/admin/* call. There is deliberately no password constant here:
// anything hardcoded in a 'use client' file ships to every visitor in the JS
// bundle and is not protection.

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

interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  originalPubDate: string;
  coverImage: string;
  description: string;
  status: 'ongoing' | 'completed';
  createdAt: string;
}

interface Chapter {
  id: string;
  bookId: string;
  bookSlug: string;
  chapterNumber: number;
  title: string;
  content: string;
  publishedAt: string;
}

export default function BlogAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingCategories, setEditingCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Books & Chapters state
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'books'>('articles');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [selectedBookForChapter, setSelectedBookForChapter] = useState<Book | null>(null);
  
  // Article form state
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
  
  // Book form state
  const [bookForm, setBookForm] = useState({
    title: '',
    slug: '',
    author: '',
    originalPubDate: '',
    coverImage: '',
    description: '',
    status: 'ongoing' as 'ongoing' | 'completed',
  });
  
  // Chapter form state
  const [chapterForm, setChapterForm] = useState({
    chapterNumber: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    if (authenticated) {
      loadData();
      loadBooksAndChapters();
    }
  }, [authenticated]);

  // Every /api/admin/* call must carry the admin token.
  function authHeaders(): Record<string, string> {
    return { 'x-admin-token': adminToken.trim() };
  }

  function jsonAuthHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json', ...authHeaders() };
  }

  async function loadData() {
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        fetch('/api/admin/posts', { headers: authHeaders() }).then(res => res.json()).catch(() => []),
        fetch('/api/admin/categories', { headers: authHeaders() }).then(res => res.json()).catch(() => []),
      ]);
      setPosts(postsRes);
      setCategories(catsRes);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }
  
  async function loadBooksAndChapters() {
    try {
      const [booksRes, chaptersRes] = await Promise.all([
        fetch('/api/admin/books', { headers: authHeaders() }).then(res => res.json()).catch(() => []),
        fetch('/api/admin/chapters', { headers: authHeaders() }).then(res => res.json()).catch(() => []),
      ]);
      setBooks(booksRes);
      setChapters(chaptersRes);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }

  // Validated by the server, not by comparing a string in the browser: we make a
  // real authenticated request and only proceed if the API accepts the token.
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');

    const token = adminToken.trim();
    if (!token) {
      setLoginError('Enter your admin token.');
      return;
    }

    try {
      const res = await fetch('/api/admin/posts', {
        headers: { 'x-admin-token': token },
      });

      if (res.ok) {
        setAuthenticated(true);
        return;
      }

      if (res.status === 401) {
        setLoginError('Invalid admin token.');
      } else if (res.status === 500) {
        setLoginError('ADMIN_TOKEN is not configured on the server.');
      } else {
        setLoginError(`Login failed (${res.status}).`);
      }
    } catch {
      setLoginError('Could not reach the server.');
    }
  }

  // ==================== ARTICLE FUNCTIONS ====================
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

    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: jsonAuthHeaders(),
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
        headers: jsonAuthHeaders(),
        body: JSON.stringify({ id }),
      });
      await loadData();
    }
  }

  async function saveCategories() {
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: jsonAuthHeaders(),
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

  // ==================== BOOK FUNCTIONS ====================
  async function saveBook() {
    if (!bookForm.title) {
      alert('Please enter a book title');
      return;
    }

    const newBook: Book = {
      id: editingBook?.id || '',
      title: bookForm.title,
      slug: bookForm.slug || bookForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      author: bookForm.author,
      originalPubDate: bookForm.originalPubDate,
      coverImage: bookForm.coverImage,
      description: bookForm.description,
      status: bookForm.status,
      createdAt: editingBook?.createdAt || new Date().toISOString(),
    };

    const response = await fetch('/api/admin/books', {
      method: 'POST',
      headers: jsonAuthHeaders(),
      body: JSON.stringify(newBook),
    });

    if (response.ok) {
      await loadBooksAndChapters();
      resetBookForm();
      alert('Book saved successfully!');
    } else {
      alert('Error saving book');
    }
  }

  async function deleteBook(id: string) {
    if (confirm('Delete this book and ALL its chapters?')) {
      const bookChapters = chapters.filter(c => c.bookId === id);
      for (const chapter of bookChapters) {
        await fetch('/api/admin/chapters', {
          method: 'DELETE',
          headers: jsonAuthHeaders(),
          body: JSON.stringify({ id: chapter.id }),
        });
      }
      await fetch('/api/admin/books', {
        method: 'DELETE',
        headers: jsonAuthHeaders(),
        body: JSON.stringify({ id }),
      });
      await loadBooksAndChapters();
      if (selectedBookForChapter?.id === id) setSelectedBookForChapter(null);
    }
  }

  function resetBookForm() {
    setEditingBook(null);
    setBookForm({
      title: '',
      slug: '',
      author: '',
      originalPubDate: '',
      coverImage: '',
      description: '',
      status: 'ongoing',
    });
  }

  function editBook(book: Book) {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      slug: book.slug,
      author: book.author,
      originalPubDate: book.originalPubDate,
      coverImage: book.coverImage,
      description: book.description,
      status: book.status,
    });
  }

  // ==================== CHAPTER FUNCTIONS ====================
  async function saveChapter() {
    if (!selectedBookForChapter) {
      alert('Please select a book first');
      return;
    }
    if (!chapterForm.title || !chapterForm.content) {
      alert('Please fill in chapter title and content');
      return;
    }

    const existingChapters = chapters.filter(c => c.bookId === selectedBookForChapter.id);
    const newChapter: Chapter = {
      id: editingChapter?.id || '',
      bookId: selectedBookForChapter.id,
      bookSlug: selectedBookForChapter.slug,
      chapterNumber: parseInt(chapterForm.chapterNumber) || (existingChapters.length + 1),
      title: chapterForm.title,
      content: chapterForm.content,
      publishedAt: editingChapter?.publishedAt || new Date().toISOString(),
    };

    const response = await fetch('/api/admin/chapters', {
      method: 'POST',
      headers: jsonAuthHeaders(),
      body: JSON.stringify(newChapter),
    });

    if (response.ok) {
      await loadBooksAndChapters();
      resetChapterForm();
      alert('Chapter saved successfully!');
    } else {
      alert('Error saving chapter');
    }
  }

  async function deleteChapter(id: string) {
    if (confirm('Delete this chapter?')) {
      await fetch('/api/admin/chapters', {
        method: 'DELETE',
        headers: jsonAuthHeaders(),
        body: JSON.stringify({ id }),
      });
      await loadBooksAndChapters();
    }
  }

  function resetChapterForm() {
    setEditingChapter(null);
    setChapterForm({
      chapterNumber: '',
      title: '',
      content: '',
    });
  }

  function editChapter(chapter: Chapter) {
    setEditingChapter(chapter);
    setChapterForm({
      chapterNumber: chapter.chapterNumber.toString(),
      title: chapter.title,
      content: chapter.content,
    });
  }

  function getBookChapters(bookId: string) {
    return chapters.filter(c => c.bookId === bookId).sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleLogin} className="w-96 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">Blog Admin</h1>
          <p className="mb-4 text-sm text-slate-500">
            Enter your admin token to manage articles, books, and categories
          </p>
          <input
            type="password"
            placeholder="Admin token"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="mb-2 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
          />
          {loginError ? (
            <p className="mb-3 text-sm font-medium text-red-600">{loginError}</p>
          ) : (
            <div className="mb-3" />
          )}
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
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'articles' 
              ? 'border-b-2 border-sky-600 text-sky-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📄 Articles
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'books' 
              ? 'border-b-2 border-sky-600 text-sky-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📚 Books & Chapters
        </button>
      </div>

      {/* ARTICLES TAB */}
      {activeTab === 'articles' && (
        <>
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
                  <p className="text-slate-400">No categories yet. Click &quot;Edit Categories&quot; to add some.</p>
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
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Title *</label>
                <input
                  placeholder="Article title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Slug (URL) - leave empty to auto-generate</label>
                <input
                  placeholder="my-article-url"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

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
                    ⚠️ No categories yet. Add some in the &quot;Manage Categories&quot; section above.
                  </p>
                )}
              </div>

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

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Tags (comma separated)</label>
                <input
                  placeholder="solar, aviation, ai, sustainability"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Cover Image URL</label>
                <input
                  placeholder="https://example.com/image.jpg"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Author</label>
                <input
                  placeholder="Author name"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

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
        </>
      )}

      {/* BOOKS & CHAPTERS TAB */}
      {activeTab === 'books' && (
        <>
          {/* Book Selection & Creation Section */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">{editingBook ? '✏️ Edit Book' : '📖 Add New Book'}</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Book Title *</label>
                  <input
                    placeholder="e.g., The Iron Empire"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Slug (URL)</label>
                  <input
                    placeholder="auto-generated"
                    value={bookForm.slug}
                    onChange={(e) => setBookForm({ ...bookForm, slug: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Author *</label>
                  <input
                    placeholder="Author name"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Original Publication Date</label>
                  <input
                    type="date"
                    value={bookForm.originalPubDate}
                    onChange={(e) => setBookForm({ ...bookForm, originalPubDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Cover Image URL</label>
                <input
                  placeholder="https://example.com/book-cover.jpg"
                  value={bookForm.coverImage}
                  onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Description / Synopsis</label>
                <textarea
                  placeholder="Brief description of the book..."
                  rows={3}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={bookForm.status}
                  onChange={(e) => setBookForm({ ...bookForm, status: e.target.value as 'ongoing' | 'completed' })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
                >
                  <option value="ongoing">🔄 Ongoing (still writing)</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={saveBook} className="rounded-full bg-sky-600 px-6 py-2 text-white hover:bg-sky-500">
                  {editingBook ? 'Update Book' : 'Create Book'}
                </button>
                {editingBook && (
                  <button onClick={resetBookForm} className="rounded-full border border-slate-300 px-6 py-2 text-slate-700 hover:bg-slate-50">
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chapter Management Section */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">📑 Manage Chapters</h2>
            
            {/* Book Selector for Chapters */}
            <div className="mb-6">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Select a Book to Add/Edit Chapters</label>
              <select
                value={selectedBookForChapter?.id || ''}
                onChange={(e) => {
                  const book = books.find(b => b.id === e.target.value);
                  setSelectedBookForChapter(book || null);
                  resetChapterForm();
                }}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-sky-400 focus:outline-none"
              >
                <option value="">-- Select a book --</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({getBookChapters(book.id).length} chapters)
                  </option>
                ))}
              </select>
              {books.length === 0 && (
                <p className="mt-2 text-sm text-amber-600">⚠️ Create a book first before adding chapters.</p>
              )}
            </div>

            {selectedBookForChapter && (
              <>
                <div className="mb-6 rounded-lg bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">Adding chapters for: {selectedBookForChapter.title}</h3>
                  <p className="text-sm text-slate-500">
                    Current chapters: {getBookChapters(selectedBookForChapter.id).length}
                  </p>
                </div>

                {/* Chapter Form */}
                <div className="mb-6 border-t border-slate-200 pt-4">
                  <h3 className="mb-3 font-semibold">{editingChapter ? '✏️ Edit Chapter' : '➕ Add New Chapter'}</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Chapter Number</label>
                        <input
                          type="number"
                          placeholder="Auto"
                          value={chapterForm.chapterNumber}
                          onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Chapter Title *</label>
                        <input
                          placeholder="e.g., The Beginning"
                          value={chapterForm.title}
                          onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-sky-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Chapter Content (HTML supported) *</label>
                      <textarea
                        placeholder="Write chapter content here. Supports HTML: <p>, <h2>, <img>, etc."
                        rows={10}
                        value={chapterForm.content}
                        onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveChapter} className="rounded-full bg-sky-600 px-4 py-1.5 text-sm text-white hover:bg-sky-500">
                        {editingChapter ? 'Update Chapter' : 'Add Chapter'}
                      </button>
                      {editingChapter && (
                        <button onClick={resetChapterForm} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Existing Chapters List */}
                {getBookChapters(selectedBookForChapter.id).length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold">📖 Existing Chapters</h3>
                    <div className="space-y-2">
                      {getBookChapters(selectedBookForChapter.id).map((chapter) => (
                        <div key={chapter.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex-1">
                            <span className="font-mono text-sm text-slate-500">Ch. {chapter.chapterNumber}</span>
                            <span className="ml-2 font-medium">{chapter.title}</span>
                            <span className="ml-2 text-xs text-slate-400">
                              {new Date(chapter.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => editChapter(chapter)} className="text-sm text-sky-600 hover:text-sky-700">
                              Edit
                            </button>
                            <button onClick={() => deleteChapter(chapter.id)} className="text-sm text-red-500 hover:text-red-700">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Existing Books List */}
          <div>
            <h2 className="mb-4 text-xl font-bold">📚 Existing Books ({books.length})</h2>
            {books.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No books yet. Create your first book above!
              </div>
            ) : (
              <div className="space-y-3">
                {books.map((book) => (
                  <div key={book.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{book.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>✍️ {book.author}</span>
                        <span>📅 {book.originalPubDate}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          book.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {book.status === 'completed' ? '✓ Completed' : '🔄 Ongoing'}
                        </span>
                        <span>📖 {getBookChapters(book.id).length} chapters</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedBookForChapter(book);
                          resetChapterForm();
                        }} 
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
                      >
                        Manage Chapters
                      </button>
                      <button onClick={() => editBook(book)} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-sky-600 hover:bg-slate-200">
                        Edit
                      </button>
                      <button onClick={() => deleteBook(book.id)} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-500 hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}