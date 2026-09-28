import Header from "../components/Header";
import Hero from "../components/Hero";
import PathsSection from "../components/PathsSection";
import FlowSection from "../components/FlowSection";
import ComparisonSection from "../components/ComparisonSection";
import ClosingCta from "../components/ClosingCta";
import Footer from "../components/Footer";

// Esta página é a landing pública, preservada exatamente como estava em
// App.jsx antes da introdução do roteamento. Nenhum componente listado
// abaixo (Header, Hero, PathsSection, DiagnosisDemo, DemandForm,
// FlowSection, ComparisonSection, ClosingCta, Footer) foi alterado.
export default function Landing() {
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
