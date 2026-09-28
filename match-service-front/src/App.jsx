import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PathsSection from "./components/PathsSection";
import FlowSection from "./components/FlowSection";
import ComparisonSection from "./components/ComparisonSection";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import CompanyPage from "./components/CompanyPage";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const empresaMatch = hash.match(/^#\/empresa\/(.+)$/);

  if (empresaMatch) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <CompanyPage empresaId={empresaMatch[1]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Header />
      <main>
        <Hero />
        <PathsSection />
        <FlowSection />
        <ComparisonSection />
        <ClosingCta />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
