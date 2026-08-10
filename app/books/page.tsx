// /app/books/page.tsx
import Link from 'next/link';
import { getBooks } from '@/app/lib/booksStore';

// Server Component: reads through booksStore (Supabase, JSON fallback) rather
// than the static file, so books saved in /admin show up without a rebuild.
export const dynamic = 'force-dynamic';

// This is the page component - it MUST be the default export
export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">📚 My eBooks</h1>
      
      {books.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-lg">No eBooks available yet.</p>
          <p className="mt-2 text-sm">Check back soon for new eBooks!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.slug}`} className="group">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
                {book.coverImage && (
                  <div className="aspect-[2/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="mb-2 line-clamp-2 text-xl font-bold text-slate-900">{book.title}</h2>
                  <p className="mb-2 text-sm text-slate-600">by {book.author}</p>
                  <p className="mb-3 line-clamp-3 text-sm text-slate-500">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      book.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {book.status === 'completed' ? '✓ Completed' : '🔄 Ongoing'}
                    </span>
                    <span className="text-sm text-sky-600 group-hover:underline">Read →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}