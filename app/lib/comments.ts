// Google Sheets setup for comments (free, persistent)
// 1. Create a Google Sheet
// 2. Share it with "Anyone with link can edit" or use Google Apps Script

export interface Comment {
  id: string;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

// Google Apps Script Web App URL (you'll create this)
// Follow instructions below to set this up
const GOOGLE_SHEETS_WEBHOOK = https://script.google.com/macros/s/AKfycbzYA-6YuygtFrugTv1MBInPQtevRCFqTxkPU95TfNW-cT20tix9MWVtWZi-_YZnfwB_/exec';

export async function fetchComments(postSlug: string): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${GOOGLE_SHEETS_WEBHOOK}?action=get&post=${postSlug}`,
      { next: { revalidate: 60 } }
    );
    const comments = await response.json();
    return comments.filter((c: Comment) => c.approved);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return [];
  }
}

export async function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'approved'>): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        ...comment,
        createdAt: new Date().toISOString(),
        approved: false,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to add comment:', error);
    return false;
  }
}
