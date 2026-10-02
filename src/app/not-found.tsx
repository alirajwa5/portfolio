import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-dvh flex-col items-start justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-5 text-5xl font-medium tracking-[-0.03em] text-fg">
        Nothing <span className="font-serif italic text-accent">here.</span>
      </h1>
      <p className="mt-4 text-muted">That page does not exist. The portfolio is one page.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </main>
  );
}
