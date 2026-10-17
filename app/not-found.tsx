import Link from "next/link";
import "./globals.css";

// Fallback for requests outside the locale routes (the root layout renders no <html>).
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center p-4">
        <main className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">404</p>
          <h1 className="mt-4 font-[Georgia,serif] text-5xl font-light">This page is not in the album</h1>
          <p className="mt-6 text-lg text-muted">The page may have moved, or the link may be wrong.</p>
          <Link href="/" className="mt-8 inline-block text-maroon underline underline-offset-4">
            Kalamkrutha Digital Studio — Home
          </Link>
        </main>
      </body>
    </html>
  );
}
