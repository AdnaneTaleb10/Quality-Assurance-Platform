export default function Footer() {
  return (
    <footer className="bg-[#233144] text-white px-4 md:px-10 py-10">

      <div className="w-full flex flex-col items-center text-center gap-4">

        {/* PLATFORM NAME */}
        <h2 className="text-xl font-semibold">
          Academic Assurance
        </h2>

        {/* UNIVERSITY LINK */}
        <a
          href="https://univ-biskra.dz/index.php/ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#DCE9FF] text-sm hover:underline"
        >
          Mohamed Khider University of Biskra
        </a>

        {/* COPYRIGHT */}
        <p className="text-white/50 text-xs mt-2">
          © {new Date().getFullYear()} Academic Assurance. Developed as part of a university academic project.
        </p>

      </div>

    </footer>
  );
}