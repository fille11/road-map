import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import ModelSection from "../components/ModelSection";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <HeroSection />
      <ProductSection />
      <ModelSection />
    </div>
  );
}
