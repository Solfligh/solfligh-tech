import fs from 'fs';
import path from 'path';

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

export function getPosts(): BlogPost[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(postsPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
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
  try {
    const data = fs.readFileSync(categoriesPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
}