// /app/api/admin/chapters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const chaptersFilePath = path.join(dataDir, 'chapters.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readChapters(): any[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(chaptersFilePath)) {
      fs.writeFileSync(chaptersFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(chaptersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chapters:', error);
    return [];
  }
}

function writeChapters(chapters: any[]): boolean {
  try {
    fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing chapters:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  let chapters = readChapters();
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');
  
  if (bookId) {
    chapters = chapters.filter((c: any) => c.bookId === bookId);
  }
  
  return NextResponse.json(chapters);
}

export async function POST(request: NextRequest) {
  const chapter = await request.json();
  
  if (!chapter || !chapter.title || !chapter.content) {
    return NextResponse.json({ error: 'Chapter title and content are required' }, { status: 400 });
  }
  
  if (!chapter.bookId) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  let chapters = readChapters();
  
  if (chapter.id) {
    // Update existing chapter
    const index = chapters.findIndex((c: any) => c.id === chapter.id);
    if (index !== -1) {
      chapters[index] = { ...chapters[index], ...chapter, updatedAt: new Date().toISOString() };
    } else {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }
  } else {
    // Check if chapter number already exists for this book
    const existingChapter = chapters.find(
      (c: any) => c.bookId === chapter.bookId && c.chapterNumber === chapter.chapterNumber
    );
    
    if (existingChapter) {
      return NextResponse.json({ error: 'Chapter number already exists for this book' }, { status: 400 });
    }
    
    // Create new chapter
    const newChapter = {
      id: Date.now().toString(),
      bookId: chapter.bookId,
      bookSlug: chapter.bookSlug || '',
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      publishedAt: chapter.publishedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    chapters.push(newChapter);
  }
  
  // Sort chapters by chapter number
  chapters.sort((a: any, b: any) => a.chapterNumber - b.chapterNumber);
  
  if (writeChapters(chapters)) {
    return NextResponse.json({ success: true, chapters });
  } else {
    return NextResponse.json({ error: 'Failed to save chapter' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  
  if (!id) {
    return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
  }
  
  let chapters = readChapters();
  const filteredChapters = chapters.filter((c: any) => c.id !== id);
  
  if (filteredChapters.length === chapters.length) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }
  
  if (writeChapters(filteredChapters)) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 });
  }
}