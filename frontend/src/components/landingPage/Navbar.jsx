import { useEffect, useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["home", "features", "workflow", "cta"];

    const observers = [];

    sections.forEach((section) => {
      const el = document.querySelector(`#${section}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(section);
            }
          });
        },
        {
          root: null,
          threshold: 0.6, // section must be 60% visible
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const linkClass = (section) =>
    `cursor-pointer transition-all duration-200 ${
      active === section
        ? "text-[#004A99] border-b-2 border-[#004A99] pb-1"
        : "text-[#64748B] hover:text-[#004A99]"
    }`;

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between bg-[#F8F9FF] shadow-sm sticky top-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-lg">
        <img src="/favicon.svg" alt="QA Platform Logo" className="h-8" />
      </div>

      {/* Links */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <a href="#home" className={linkClass("home")}>
          Home
        </a>

        <a href="#features" className={linkClass("features")}>
          Features
        </a>

        <a href="#workflow" className={linkClass("workflow")}>
          Workflow
        </a>

        <a href="#cta" className={linkClass("cta")}>
          Get Started
        </a>
      </div>
    </nav>
  );
}