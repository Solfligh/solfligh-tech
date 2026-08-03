import fs from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

const postsPath = path.join(process.cwd(), 'public', 'data', 'posts.json');
const categoriesPath = path.join(process.cwd(), 'public', 'data', 'categories.json');

export interface BlogPost {
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

function hasSupabase(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/* -------------------------------------------------------------------------- */
/* JSON fallback (dev/local only — Supabase is the source of truth)           */
/* -------------------------------------------------------------------------- */

export function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(postsPath)) {
    fs.writeFileSync(postsPath, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(categoriesPath)) {
    const defaultCategories: Category[] = [
      { id: '1', name: 'Software Engineering', slug: 'software-engineering' },
      { id: '2', name: 'AI & Automation', slug: 'ai-automation' },
      { id: '3', name: 'Web Development', slug: 'web-development' },
      { id: '4', name: 'Mobile Development', slug: 'mobile-development' },
      { id: '5', name: 'Tech Insights', slug: 'tech-insights' },
    ];
    fs.writeFileSync(categoriesPath, JSON.stringify(defaultCategories, null, 2));
  }
}

function readPostsJson(): BlogPost[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writePostsJson(posts: BlogPost[]): void {
  ensureDataDir();
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
}

function readCategoriesJson(): Category[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeCategoriesJson(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
}

/* -------------------------------------------------------------------------- */
/* Supabase mapping                                                           */
/* -------------------------------------------------------------------------- */

type DbPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tags: unknown;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
  read_time: number | null;
};

type DbCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

const POST_COLUMNS =
  'id,slug,title,excerpt,content,category,tags,cover_image,author,published_at,read_time';

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x));
  return [];
}

function toBlogPost(r: DbPostRow): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt || '',
    content: r.content || '',
    category: r.category || '',
    tags: asStringArray(r.tags),
    coverImage: r.cover_image || '',
    author: r.author || '',
    publishedAt: r.published_at || '',
    readTime: r.read_time ?? 0,
  };
}

function toCategory(r: DbCategoryRow): Category {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? '',
  };
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                      */
/* -------------------------------------------------------------------------- */

export async function getPosts(): Promise<BlogPost[]> {
  if (hasSupabase()) {
    try {
      noStore();
      const { data, error } = await supabaseAdmin
        .from('posts')
        .select(POST_COLUMNS)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return ((data || []) as DbPostRow[]).map(toBlogPost);
    } catch {
      return readPostsJson();
    }
  }
  return readPostsJson();
}

export async function savePost(post: BlogPost): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('posts').upsert(
      {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags ?? [],
        cover_image: post.coverImage,
        author: post.author,
        published_at: post.publishedAt,
        read_time: post.readTime,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) throw error;
    return;
  }

  // JSON fallback
  const posts = readPostsJson();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index >= 0) posts[index] = post;
  else posts.unshift(post);
  writePostsJson(posts);
}

export async function deletePost(id: string): Promise<void> {
  if (hasSupabase()) {
    noStore();
    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  // JSON fallback
  const posts = readPostsJson();
  writePostsJson(posts.filter((p) => p.id !== id));
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  if (hasSupabase()) {
    try {
      noStore();
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('id,name,slug,description')
        .order('name', { ascending: true });
      if (error) throw error;
      return ((data || []) as DbCategoryRow[]).map(toCategory);
    } catch {
      return readCategoriesJson();
    }
  }
  return readCategoriesJson();
}

// The admin UI sends the full category list, so this is replace-all:
// upsert everything provided, then remove any category no longer present.
export async function saveCategories(categories: Category[]): Promise<void> {
  if (hasSupabase()) {
    noStore();

    if (categories.length > 0) {
      const rows = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description ?? null,
        updated_at: new Date().toISOString(),
      }));
      const { error: upsertErr } = await supabaseAdmin
        .from('categories')
        .upsert(rows, { onConflict: 'id' });
      if (upsertErr) throw upsertErr;

      const keepList = `(${categories.map((c) => `"${String(c.id).replace(/"/g, '')}"`).join(',')})`;
      const { error: delErr } = await supabaseAdmin
        .from('categories')
        .delete()
        .not('id', 'in', keepList);
      if (delErr) throw delErr;
    } else {
      // Empty list clears the table.
      const { error } = await supabaseAdmin.from('categories').delete().neq('id', '__never__');
      if (error) throw error;
    }
    return;
  }

  // JSON fallback
  writeCategoriesJson(categories);
}
