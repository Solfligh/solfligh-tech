import fs from 'fs';
import path from 'path';

// Path to posts.json (stored in public folder for easy access)
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

// Ensure directories exist
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
      { id: '1', name: 'Solar Tech', slug: 'solar-tech', description: 'Solar energy innovations' },
      { id: '2', name: 'Aviation', slug: 'aviation', description: 'Aircraft and flight tech' },
      { id: '3', name: 'Sustainability', slug: 'sustainability', description: 'Green technology' },
      { id: '4', name: 'Engineering', slug: 'engineering', description: 'Technical deep dives' },
      { id: '5', name: 'AI & Automation', slug: 'ai-automation', description: 'Artificial intelligence' },
    ];
    fs.writeFileSync(categoriesPath, JSON.stringify(defaultCategories, null, 2));
  }
}

export function getPosts(): BlogPost[] {
  ensureDataDir();
  const data = fs.readFileSync(postsPath, 'utf-8');
  return JSON.parse(data);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getPosts();
  return posts.find(post => post.slug === slug) || null;
}

export function savePost(post: BlogPost): void {
  ensureDataDir();
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === post.id);
  
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.unshift(post);
  }
  
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
}

export function deletePost(id: string): void {
  ensureDataDir();
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  fs.writeFileSync(postsPath, JSON.stringify(filtered, null, 2));
}

export function getCategories(): Category[] {
  ensureDataDir();
  const data = fs.readFileSync(categoriesPath, 'utf-8');
  return JSON.parse(data);
}

export function saveCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
}
