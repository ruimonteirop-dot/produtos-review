import { SmoothScroll } from "../components/SmoothScroll";
import { Header } from "../components/clean/Header";
import { Hero } from "../components/clean/Hero";
import { FeaturedReview } from "../components/clean/FeaturedReview";
import { Marquee } from "../components/clean/Marquee";
import { ReviewsGrid } from "../components/clean/ReviewsGrid";
import { Method } from "../components/clean/Method";
import { Newsletter } from "../components/clean/Newsletter";
import { Footer } from "../components/clean/Footer";
import { usePublicReviews } from "../hooks/usePublicReviews";

export default function Landing() {
  const { featured, others } = usePublicReviews();
  return (
    <div data-testid="myg-reviews-landing" className="App">
      <SmoothScroll />
      <Header />
      <main>
        <Hero featured={featured} />
        <Marquee />
        {featured && <FeaturedReview review={featured} />}
        {others.length > 0 && <ReviewsGrid reviews={others} />}
        <Method />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
