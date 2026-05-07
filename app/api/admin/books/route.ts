// /app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const booksFilePath = path.join(dataDir, 'books.json');

// Helper to ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Helper function to read books from file
function readBooks(): any[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(booksFilePath)) {
      fs.writeFileSync(booksFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
}

// Helper function to write books to file
function writeBooks(books: any[]): boolean {
  try {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing books:', error);
    return false;
  }
}

export async function GET() {
  const books = readBooks();
  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  const book = await request.json();
  
  if (!book || !book.title) {
    return NextResponse.json({ error: 'Book title is required' }, { status: 400 });
  }

  let books = readBooks();
  
  if (book.id) {
    // Update existing book
    const index = books.findIndex((b: any) => b.id === book.id);
    if (index !== -1) {
      books[index] = { ...books[index], ...book, updatedAt: new Date().toISOString() };
    } else {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
  } else {
    // Create new book
    const newBook = {
      id: Date.now().toString(),
      title: book.title,
      slug: book.slug || book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      author: book.author || '',
      originalPubDate: book.originalPubDate || '',
      coverImage: book.coverImage || '',
      description: book.description || '',
      status: book.status || 'ongoing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    books.push(newBook);
  }
  
  if (writeBooks(books)) {
    return NextResponse.json({ success: true, books });
  } else {
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  
  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }
  
  let books = readBooks();
  const filteredBooks = books.filter((b: any) => b.id !== id);
  
  if (filteredBooks.length === books.length) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }
  
  if (writeBooks(filteredBooks)) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}