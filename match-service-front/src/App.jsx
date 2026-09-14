import Header from "./components/Header";
import Hero from "./components/Hero";
import PathsSection from "./components/PathsSection";
import FlowSection from "./components/FlowSection";
import ComparisonSection from "./components/ComparisonSection";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";

export default function App() {
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
    </div>
  );
}
