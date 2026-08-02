import fs from 'fs';
import path from 'path';

export type Post = {
  id: string;
  [key: string]: unknown;
};
 
const postsPath = path.join(process.cwd(), 'public', 'data', 'posts.json'); 
 
export function getPosts(): Post[] { 
  try { 
    const data = fs.readFileSync(postsPath, 'utf-8'); 
    return JSON.parse(data); 
  } catch { 
    return []; 
  } 
} 
 
export function savePost(post: Post) { 
  const posts = getPosts(); 
  const index = posts.findIndex((p: Post) => p.id === post.id); 
  if (index >= 0) { 
    posts[index] = post; 
  } else { 
    posts.unshift(post); 
  } 
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2)); 
} 
 
export function deletePost(id: string) { 
  const posts = getPosts(); 
  const filtered = posts.filter((p: Post) => p.id !== id); 
  fs.writeFileSync(postsPath, JSON.stringify(filtered, null, 2)); 
} 
