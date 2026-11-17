import "@/App.css";
import { Toaster } from "sonner";
import { SmoothScroll } from "./components/SmoothScroll";
import { Header } from "./components/clean/Header";
import { Hero } from "./components/clean/Hero";
import { FeaturedReview } from "./components/clean/FeaturedReview";
import { Marquee } from "./components/clean/Marquee";
import { ReviewsGrid } from "./components/clean/ReviewsGrid";
import { Method } from "./components/clean/Method";
import { Newsletter } from "./components/clean/Newsletter";
import { Footer } from "./components/clean/Footer";

function App() {
  return (
    <div data-testid="myg-reviews-landing" className="App">
      <SmoothScroll />
      <Toaster position="bottom-center" richColors />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <FeaturedReview />
        <ReviewsGrid />
        <Method />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
