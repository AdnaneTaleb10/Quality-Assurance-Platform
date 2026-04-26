import Features from "../components/landingPage/Features";
import Footer from "../components/landingPage/Footer";
import Hero from "../components/landingPage/Hero";
import Navbar from "../components/landingPage/Navbar";
import Workflow from "../components/landingPage/Workflow";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Footer />
    </>
  );
}
