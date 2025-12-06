"use client";

import { useMemo, useState } from "react";

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  available: boolean;
};

const initialBooks: Book[] = [
  { id: "1", title: "Clean Code", author: "Robert C. Martin", genre: "Software", available: true },
  { id: "2", title: "The Pragmatic Programmer", author: "Andy Hunt", genre: "Software", available: false },
  { id: "3", title: "1984", author: "George Orwell", genre: "Fiction", available: true },
  { id: "4", title: "Sapiens", author: "Yuval Noah Harari", genre: "History", available: true },
  { id: "5", title: "Deep Work", author: "Cal Newport", genre: "Productivity", available: false },
];

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [genre, setGenre] = useState<string>("all");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    genre: "",
    available: true,
  });

  const genres = useMemo(() => {
    const set = new Set<string>(["all"]);
    books.forEach((b) => set.add(b.genre));
    return Array.from(set);
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesQuery =
        [b.title, b.author, b.genre].some((f) =>
          f.toLowerCase().includes(query.toLowerCase().trim())
        );
      const matchesGenre = genre === "all" ? true : b.genre === genre;
      const matchesAvailability = onlyAvailable ? b.available : true;
      return matchesQuery && matchesGenre && matchesAvailability;
    });
  }, [books, query, genre, onlyAvailable]);

  const addBook = () => {
    const t = newBook.title.trim();
    const a = newBook.author.trim();
    const g = newBook.genre.trim();
    if (!t || !a || !g) return;
    const id = (Math.max(0, ...books.map((b) => Number(b.id))) + 1).toString();
    setBooks([{ id, ...newBook }, ...books]);
    setNewBook({ title: "", author: "", genre: "", available: true });
  };

  const toggleAvailability = (id: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, available: !b.available } : b))
    );
  };

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mx-auto max-w-6xl">
        <div className="glass card shadow-ambient flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="badge mb-3">Library</div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Book Borrowing System
            </h1>
            <p className="mt-2 max-w-prose text-sm text-[color:var(--muted)]">
              Browse, track availability, and manage your library&apos;s collection. This is a
              front-end preview with delightful UI. Backend and persistence will be added later.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn">View Docs</button>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-3">
        <section className="glass card lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full">
                <input
                  className="input pr-10"
                  placeholder="Search by title, author, or genre..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--muted)]">
                  ⌘K
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="input w-40"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g === "all" ? "All Genres" : g}
                  </option>
                ))}
              </select>
              <label className="glass btn cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Only available
              </label>
            </div>
          </div>

          <div className="my-5 hr" />

          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((b) => (
              <li key={b.id} className="glass card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {b.author} • {b.genre}
                    </p>
                  </div>
                  <span
                    className="badge"
                    style={{
                      color: b.available ? "#8ef0a6" : "#f3b4b4",
                      borderColor: b.available ? "rgba(142,240,166,0.35)" : "rgba(243,180,180,0.35)",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {b.available ? "Available" : "Borrowed"}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => toggleAvailability(b.id)}
                    className="btn btn-primary"
                  >
                    {b.available ? "Borrow" : "Return"}
                  </button>
                  <button onClick={() => removeBook(b.id)} className="btn">
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="glass card col-span-full text-center text-[color:var(--muted)]">
                No books match your search.
              </li>
            )}
          </ul>
        </section>

        <aside className="glass card h-fit lg:sticky lg:top-6">
          <h2 className="text-xl font-semibold">Add a new book</h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Quickly seed your library with more titles.
          </p>

          <div className="my-5 hr" />

          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-sm text-[color:var(--muted)]">Title</label>
              <input
                className="input"
                value={newBook.title}
                onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., The Clean Coder"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[color:var(--muted)]">Author</label>
              <input
                className="input"
                value={newBook.author}
                onChange={(e) => setNewBook((p) => ({ ...p, author: e.target.value }))}
                placeholder="e.g., Robert C. Martin"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[color:var(--muted)]">Genre</label>
              <input
                className="input"
                value={newBook.genre}
                onChange={(e) => setNewBook((p) => ({ ...p, genre: e.target.value }))}
                placeholder="e.g., Software"
              />
            </div>
            <label className="mt-1 flex items-center gap-2 text-sm text-[color:var(--muted)]">
              <input
                type="checkbox"
                checked={newBook.available}
                onChange={(e) => setNewBook((p) => ({ ...p, available: e.target.checked }))}
              />
              Available by default
            </label>
            <button onClick={addBook} className="btn btn-primary mt-2">
              Add Book
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 p-4 text-xs text-[color:var(--muted)]">
            Note: This demo stores data in memory only. Your changes reset on refresh.
          </div>
        </aside>
      </main>

      <footer className="mx-auto mt-10 max-w-6xl">
        <div className="glass card text-sm text-[color:var(--muted)]">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span>© {new Date().getFullYear()} Library System Preview</span>
            <div className="flex items-center gap-3">
              <span className="badge">HTML</span>
              <span className="badge">CSS</span>
              <span className="badge">JavaScript</span>
              <span className="badge">Next.js</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
