import { useEffect, useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["home", "features", "workflow", "cta"];
    const observers = [];

    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(section);
          }
        },
        { threshold: 0.6 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const linkBase =
    "relative cursor-pointer text-sm font-medium transition-colors duration-200";

  const links = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "workflow", label: "Workflow" },
    { id: "cta", label: "Get Started" },
  ];

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between bg-[#F8F9FF] shadow-sm sticky top-0 z-50">

      {/* LOGO */}
      <div className="flex items-center gap-2 font-bold text-lg">
        <img src="/favicon.svg" alt="QA Platform Logo" className="h-8" />
      </div>

      {/* LINKS */}
      <div className="flex items-center gap-8">

        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className={`${linkBase} ${
              active === link.id
                ? "text-[#004A99]"
                : "text-[#64748B] hover:text-[#004A99]"
            } pb-1`}
          >
            <span className="relative">
              {link.label}

              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-[#004A99] transition-all duration-300 ${
                  active === link.id ? "w-full" : "w-0"
                }`}
              />
            </span>
          </button>
        ))}

      </div>
    </nav>
  );
}