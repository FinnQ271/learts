import { useEffect } from "react";
import Layout from "../components/Layout";
import HeroBanner from "../components/HeroBanner";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import SkeletonLoader from "../components/SkeletonLoader";
import { useHomeData } from "../hooks/useHomeData";

export default function Home() {
  const {
    categories,
    featuredProducts,
    loading,
    selectedProduct,
    handleQuickView,
    handleAddToCart,
  } = useHomeData();

  // Reload template scripts once data has finished loading and is rendered in DOM
  useEffect(() => {
    if (!loading) {
      const oldScript = document.querySelector<HTMLScriptElement>(
        'script[data-learts-main="true"]'
      );
      oldScript?.remove();

      const script = document.createElement("script");
      script.src = `/assets/js/main.js?v=${Date.now()}`;
      script.async = false;
      script.dataset.leartsMain = "true";
      document.body.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [loading]);

  return (
    <Layout>
        {/* Swiper Hero Slider */}
        <HeroBanner />

        {/* About Us & Categories Section */}
        <div className="section section-padding" style={{ backgroundImage: "url(/assets/images/bg/home-2.webp)" }}>
          <div className="container">
            <div className="row learts-mb-n30">

              {/* About Us Column */}
              <div className="col-lg-5 col-12 ms-auto align-self-center learts-mb-30">
                <div className="about-us">
                  <div className="inner">
                    <img alt="Site Logo" className="logo" src="/assets/images/logo/logo-3.webp" />
                    <h2 className="title">Making &amp; crafting</h2>
                    <span className="special-title">Handicraft shop</span>
                    <p>
                      Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, where you can enjoy yourself while pulling out some ideas and busy perfecting your work.
                    </p>
                    <a className="link" href="/shop">Online Store</a>
                  </div>
                </div>
              </div>

              {/* Category Banners (First Two Banners) */}
              <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
                {loading ? (
                  <SkeletonLoader type="category" count={1} />
                ) : (
                  categories[0] && (
                    <div className="category-banner2">
                      <a className="inner" href={categories[0].badge ? `/shop?category=${encodeURIComponent(categories[0].title)}` : "/shop"}>
                        <div className="image">
                          <img alt={categories[0].title} src={categories[0].image} />
                        </div>
                        <div className="content">
                          <h3 className="title">
                            {categories[0].title}
                            <span className="number">{categories[0].itemCount} items</span>
                          </h3>
                        </div>
                      </a>
                      <span className="banner-desc right">{categories[0].badge}</span>
                    </div>
                  )
                )}
              </div>

              <div className="col-lg-5 col-md-6 col-12 learts-mb-30">
                {loading ? (
                  <SkeletonLoader type="category" count={1} />
                ) : (
                  categories[1] && (
                    <div className="category-banner2">
                      <a className="inner" href={categories[1].badge ? `/shop?category=${encodeURIComponent(categories[1].title)}` : "/shop"}>
                        <div className="image">
                          <img alt={categories[1].title} src={categories[1].image} />
                        </div>
                        <div className="content">
                          <h3 className="title">
                            {categories[1].title}
                            <span className="number">{categories[1].itemCount} items</span>
                          </h3>
                        </div>
                      </a>
                      <span className="banner-desc right">{categories[1].badge}</span>
                    </div>
                  )
                )}
              </div>

              {/* Category Banners (Next Two Banners) */}
              <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
                <div className="section-padding pb-0 d-none d-lg-block"></div>
                {loading ? (
                  <SkeletonLoader type="category" count={1} />
                ) : (
                  categories[2] && (
                    <div className="category-banner2">
                      <a className="inner" href={categories[2].badge ? `/shop?category=${encodeURIComponent(categories[2].title)}` : "/shop"}>
                        <div className="image">
                          <img alt={categories[2].title} src={categories[2].image} />
                        </div>
                        <div className="content">
                          <h3 className="title">
                            {categories[2].title}
                            <span className="number">{categories[2].itemCount} items</span>
                          </h3>
                        </div>
                      </a>
                      <span className="banner-desc right">{categories[2].badge}</span>
                    </div>
                  )
                )}
              </div>

              <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
                <div className="section learts-pt-40 d-none d-lg-block"></div>
                {loading ? (
                  <SkeletonLoader type="category" count={1} />
                ) : (
                  categories[3] && (
                    <div className="category-banner2">
                      <a className="inner" href={categories[3].badge ? `/shop?category=${encodeURIComponent(categories[3].title)}` : "/shop"}>
                        <div className="image">
                          <img alt={categories[3].title} src={categories[3].image} />
                        </div>
                        <div className="content">
                          <h3 className="title">
                            {categories[3].title}
                            <span className="number">{categories[3].itemCount} items</span>
                          </h3>
                        </div>
                      </a>
                      <span className="banner-desc left">{categories[3].badge}</span>
                    </div>
                  )
                )}
              </div>

              {/* Sale Spring Banner */}
              <div className="d-flex align-items-center col-lg-5 col-12 ms-auto learts-mb-30">
                <div className="sale-banner3">
                  <span className="special-title">Spring sale</span>
                  <h2 className="title" data-text="ss – 18">Sale up to 10% all</h2>
                  <a className="link" href="/shop">ONLINE STORE</a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="section section-padding border-top">
          <div className="container">
            <div className="section-title text-center">
              <h3 className="sub-title">Just for you</h3>
              <h2 className="title title-icon-both">Featured Products</h2>
            </div>

            <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
              {loading ? (
                <SkeletonLoader type="product" count={4} />
              ) : (
                featuredProducts.map((product) => (
                  <div key={product.id} className="col">
                    <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instagram Section */}
        <div className="section section-padding border-top">
          <div className="container">
            <div className="section-title2 text-center">
              <h3 className="sub-title">Follow us on Instagram</h3>
              <h2 className="title">@learts_shop</h2>
            </div>
            <div className="instafeed instafeed-carousel instafeed-carousel1">
              <a className="instafeed-item" href="#">
                <img alt="instagram image" src="/assets/images/instagram/instagram-1.webp" />
                <i className="fab fa-instagram"></i>
              </a>
              <a className="instafeed-item" href="#">
                <img alt="instagram image" src="/assets/images/instagram/instagram-2.webp" />
                <i className="fab fa-instagram"></i>
              </a>
              <a className="instafeed-item" href="#">
                <img alt="instagram image" src="/assets/images/instagram/instagram-3.webp" />
                <i className="fab fa-instagram"></i>
              </a>
              <a className="instafeed-item" href="#">
                <img alt="instagram image" src="/assets/images/instagram/instagram-4.webp" />
                <i className="fab fa-instagram"></i>
              </a>
              <a className="instafeed-item" href="#">
                <img alt="instagram image" src="/assets/images/instagram/instagram-4.webp" />
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

      {/* Quick View Popup Modal */}
      <QuickViewModal product={selectedProduct} onAddToCart={handleAddToCart} />
    </Layout>
  );
}
