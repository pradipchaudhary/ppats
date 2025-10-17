'use client';

export default function ComingSoon() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-6">
      {/* TITLE */}
      <h1 className="text-5xl md:text-6xl font-bold mb-3">
        Coming <span className="text-primary">Soon</span>
      </h1>

      {/* MESSAGE */}
      <p className="text-muted-foreground text-base md:text-lg mb-2">
        We’re working on something amazing.
      </p>

      {/* FOOTER */}
      <footer className="absolute bottom-6 text-muted-foreground text-sm">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/pradipchaudhary"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-primary transition-colors"
        >
          Pradip Chaudhary
        </a>
      </footer>
    </main>
  );
}
