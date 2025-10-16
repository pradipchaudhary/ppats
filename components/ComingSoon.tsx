export default function ComingSoon() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      {/* TITLE */}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
        <span className="text-gray-700">Coming Soon</span>
      </h1>

      {/* SHORT MESSAGE */}
      <p className="text-gray-500 text-base md:text-lg">
        We’re working on something amazing.
      </p>

      {/* FOOTER */}
      <footer className="absolute bottom-6 text-gray-400 text-sm">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/pradipchaudhary"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Pradip Chaudhary
        </a>
      </footer>
    </div>
  );
}
