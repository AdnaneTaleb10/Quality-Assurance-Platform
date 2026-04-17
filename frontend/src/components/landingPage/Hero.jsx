import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="home">

      <div className="min-h-[85vh] flex items-center px-4 md:px-10 py-16 md:py-0">

        <div className="w-full flex flex-col md:flex-row items-center gap-10">

          {/* LEFT SIDE - TEXT */}
          <div className="w-full md:w-1/2 text-center md:text-left">

            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Ensuring Excellence in Institutional Infrastructure
            </h1>

            <p className="mt-5 text-[#64748B] text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
              A structured quality assurance platform for higher education institutions.
              Evaluate infrastructure, submit supporting documents, and validate results
              through a transparent and controlled workflow.
            </p>

            <div className="mt-7 flex justify-center md:justify-start">

              <Link
                to="/login"
                className="bg-[#004A99] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Begin Assessment
              </Link>

            </div>

          </div>

          {/* RIGHT SIDE - IMAGE */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">

            <img
              src="/hero-image.jpg"
              alt="Quality Assurance Illustration"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
            />

          </div>

        </div>

      </div>
    </section>
  );
}