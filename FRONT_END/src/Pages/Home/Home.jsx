import { useEffect, useState } from "react";
import HeroCarousel from "../../Components/Home/HeroCarousel";
import CategoryMarquee from "../../Components/Home/CategoryMarquee";
import SectionHeading from "../../Components/Home/SectionHeading";
import BestSellers from "../../Components/Home/BestSellers";
import GiftBanner from "../../Components/Home/GiftBanner";
import FeatureTriplet from "../../Components/Home/FeatureTriplet";
import { homeApi, getErrorMessage } from "../../Service/api";
import "./Home.css";

// New home page (design from the Home_page zip).
// All slides, categories, banners and best sellers come from the database,
// so the admin can change pictures and text without touching the code.
function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    homeApi
      .get()
      .then((res) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) {
    return (
      <div className="container home-status">
        <div className="msg msg-error">{error}</div>
      </div>
    );
  }
  if (!data) return <div className="container home-status">Loading...</div>;

  return (
    <>
      <HeroCarousel slides={data.hero} />
      <CategoryMarquee categories={data.categories} />
      {data.bestSellers.length > 0 && <SectionHeading title="Our best sellers" />}
      <BestSellers products={data.bestSellers} />
      <GiftBanner banners={data.banners} />
      <FeatureTriplet />
    </>
  );
}

export default Home;
