import fs from 'fs'; 
import path from 'path'; 
 
const postsPath = path.join(process.cwd(), 'public', 'data', 'posts.json'); 
 
export function getPosts() { 
  try { 
    const data = fs.readFileSync(postsPath, 'utf-8'); 
    return JSON.parse(data); 
  } catch { 
    return []; 
  } 
} 
 
export function savePost(post) { 
  const posts = getPosts(); 
  const index = posts.findIndex(p => p.id === post.id); 
  if (index >= 0) { 
    posts[index] = post; 
  } else { 
    posts.unshift(post); 
  } 
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2)); 
} 
 
export function deletePost(id) { 
  const posts = getPosts(); 
  const filtered = posts.filter(p => p.id !== id); 
  fs.writeFileSync(postsPath, JSON.stringify(filtered, null, 2)); 
} 
