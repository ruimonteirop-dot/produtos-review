import "@/App.css";
import { Toaster } from "sonner";
import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeaturedReview } from "./components/FeaturedReview";
import { Marquee } from "./components/Marquee";
import { ReviewsBento } from "./components/ReviewsBento";
import { Method } from "./components/Method";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div data-testid="myg-reviews-landing" className="App grain">
      <SmoothScroll />
      <Toaster position="bottom-center" richColors />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <FeaturedReview />
        <ReviewsBento />
        <Method />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
