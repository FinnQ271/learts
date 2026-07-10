import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <div className="home2-slider swiper-container">
      <div className="swiper-wrapper">
        {/* Slide 1 */}
        <div
          className="home2-slide-item swiper-slide"
          style={{ backgroundColor: "#EEE5DD" }}
          data-swiper-autoplay="5000"
        >
          <div className="home2-slide1-image">
            <img alt="Slide One Image" src="/assets/images/slider/home2/slider-1-1.webp" />
            <div className="home2-slide1-product1">
              <button className="slide-pointer">
                <span>+</span>
              </button>
              <div className="slide-product">
                <div className="image">
                  <img alt="Slide Product Image" src="/assets/images/slider/home2/slider-1-2.webp" />
                </div>
                <h6 className="title">Country Feast set</h6>
                <span className="price">$39.00</span>
              </div>
            </div>
          </div>
          <div className="home2-slide-content">
            <h5 className="sub-title">DAILY OFFER</h5>
            <h2 className="title">Country Feast Set</h2>
            <div className="link">
              <Link to="/shop">shop collection</Link>
            </div>
          </div>
          <div className="home2-slide-pages">
            <span className="current">1</span>
            <span className="border"></span>
            <span className="total">3</span>
          </div>
        </div>

        {/* Slide 2 */}
        <div
          className="home2-slide-item swiper-slide"
          style={{ backgroundColor: "#F5F1F1" }}
          data-swiper-autoplay="5000"
        >
          <div className="home2-slide2-image">
            <img alt="Slide One Image" src="/assets/images/slider/home2/slider-2-1.webp" />
            <div className="home2-slide2-product1">
              <button className="slide-pointer">
                <span>+</span>
              </button>
              <div className="slide-product">
                <div className="image">
                  <img alt="Slide Product Image" src="/assets/images/slider/home2/slider-2-2.webp" />
                </div>
                <h6 className="title">Country Feast set</h6>
                <span className="price">$39.00</span>
              </div>
            </div>
            <div className="home2-slide2-product2">
              <button className="slide-pointer">
                <span>+</span>
              </button>
              <div className="slide-product">
                <div className="image">
                  <img alt="Slide Product Image" src="/assets/images/slider/home2/slider-2-3.webp" />
                </div>
                <h6 className="title">Country Feast set</h6>
                <span className="price">$39.00</span>
              </div>
            </div>
          </div>
          <div className="home2-slide-content">
            <h5 className="sub-title">DAILY OFFER</h5>
            <h2 className="title">DESIGNS FOR YOU</h2>
            <div className="link">
              <Link to="/shop">shop collection</Link>
            </div>
          </div>
          <div className="home2-slide-pages">
            <span className="current">2</span>
            <span className="border"></span>
            <span className="total">3</span>
          </div>
        </div>

        {/* Slide 3 */}
        <div
          className="home2-slide-item swiper-slide"
          style={{ backgroundColor: "#F1DED0" }}
          data-swiper-autoplay="5000"
        >
          <div className="home2-slide3-image">
            <img alt="Slide One Image" src="/assets/images/slider/home2/slider-3-1.webp" />
            <div className="home2-slide3-product1">
              <button className="slide-pointer">
                <span>+</span>
              </button>
              <div className="slide-product">
                <div className="image">
                  <img alt="Slide Product Image" src="/assets/images/slider/home2/slider-3-2.webp" />
                </div>
                <h6 className="title">Country Feast set</h6>
                <span className="price">$39.00</span>
              </div>
            </div>
            <div className="home2-slide3-product2">
              <button className="slide-pointer">
                <span>+</span>
              </button>
              <div className="slide-product">
                <div className="image">
                  <img alt="Slide Product Image" src="/assets/images/slider/home2/slider-3-3.webp" />
                </div>
                <h6 className="title">Country Feast set</h6>
                <span className="price">$39.00</span>
              </div>
            </div>
          </div>
          <div className="home2-slide-content">
            <h5 className="sub-title">DAILY OFFER</h5>
            <h2 className="title">Country Feast Set</h2>
            <div className="link">
              <Link to="/shop">shop collection</Link>
            </div>
          </div>
          <div className="home2-slide-pages">
            <span className="current">3</span>
            <span className="border"></span>
            <span className="total">3</span>
          </div>
        </div>
      </div>
      
      {/* Slider controls */}
      <div className="home2-slider-prev swiper-button-prev">
        <i className="ti-angle-left"></i>
      </div>
      <div className="home2-slider-next swiper-button-next">
        <i className="ti-angle-right"></i>
      </div>
    </div>
  );
}
