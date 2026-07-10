import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import { useProductDetails } from "../hooks/useProductDetails";
import { useWishlistStore } from "../store/wishlistStore";

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  
  const {
    product,
    relatedProducts,
    loading,
    activeImage,
    quantity,
    selectedProduct,
    setActiveImage,
    handleMinus,
    handlePlus,
    handleInputChange,
    handleAddToCart,
    handleQuickView,
    handleQuickViewAddToCart,
  } = useProductDetails(productId);

  const isFav = useWishlistStore((state) => state.items.some((item) => item.id === product?.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  // Sync jQuery plugins / template scripts after render
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
  }, [loading, productId]);

  if (loading) {
    return (
      <Layout>
        <div className="section section-padding text-center" style={{ minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem", color: "#a87057" }}>
              <span className="visually-hidden"></span>
            </div>
            <p style={{ marginTop: "15px", color: "#777" }}>Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="section section-padding text-center" style={{ minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <h3>Product not found.</h3>
            <p><Link to="/shop" className="btn btn-dark mt-3">Back to Shop</Link></p>
          </div>
        </div>
      </Layout>
    );
  }

  const { title, priceDisplay, oldPrice, category, sku, brand, description, stock, image, images = [] } = product;
  const isOutOfStock = stock <= 0;

  return (
    <Layout>

      {/* Breadcrumb */}
      <div className="page-title-section section" style={{ backgroundImage: "url(/assets/images/bg/page-title-1.webp)" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Shop</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><a href="/shop">Products</a></li>
                  <li className="breadcrumb-item active">{title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding border-bottom">
        <div className="container">
          <div className="row learts-mb-n40">

            {/* Product Images Gallery Start */}
            <div className="col-lg-6 col-12 learts-mb-40">
              <div className="product-images" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Main image container */}
                <div style={{ width: "100%", textAlign: "center", border: "1px solid #f2f2f2", borderRadius: "8px", padding: "10px", background: "#fafafa" }}>
                  <img
                    alt={title}
                    src={activeImage || image}
                    style={{ width: "100%", maxWidth: "450px", height: "auto", objectFit: "contain", maxHeight: "500px" }}
                  />
                </div>

                {/* Thumbnails grid */}
                {images.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    {images.map((imgSrc: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => setActiveImage(imgSrc)}
                        style={{
                          width: "70px",
                          height: "70px",
                          border: activeImage === imgSrc ? "2px solid #a87057" : "1px solid #eee",
                          borderRadius: "4px",
                          cursor: "pointer",
                          padding: "3px",
                          background: "#fff"
                        }}
                      >
                        <img
                          alt={`Thumbnail ${index + 1}`}
                          src={imgSrc}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Product Images End */}

            {/* Product Summary Start */}
            <div className="col-lg-6 col-12 learts-mb-40">
              <div className="product-summery" style={{ paddingLeft: "15px" }}>

                <div className="product-ratings">
                  <span className="star-rating">
                    <span className="rating-active" style={{ width: "100%" }}>ratings</span>
                  </span>
                  <a className="review-link" href="#reviews">(<span className="count">3</span> customer reviews)</a>
                </div>

                <h3 className="product-title" style={{ fontSize: "28px", margin: "10px 0" }}>{title}</h3>

                <div className="product-price" style={{ fontSize: "24px", fontWeight: "600", color: "#a87057", marginBottom: "20px" }}>
                  {oldPrice ? (
                    <>
                      <span className="old" style={{ textDecoration: "line-through", color: "#999", marginRight: "10px", fontSize: "18px" }}>{oldPrice}</span>
                      <span>{priceDisplay}</span>
                    </>
                  ) : (
                    priceDisplay
                  )}
                </div>

                <div className="product-description" style={{ marginBottom: "25px" }}>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#666" }}>{description}</p>
                </div>

                <div className="product-variations">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td className="label" style={{ width: "100px", verticalAlign: "middle" }}><span>Quantity</span></td>
                        <td className="value">
                          {!isOutOfStock ? (
                            <div className="product-quantity" style={{ display: "inline-flex", alignItems: "center" }}>
                              <span className="qty-btn minus" onClick={handleMinus} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-minus"></i></span>
                              <input className="input-qty" type="text" value={quantity} onChange={(e) => handleInputChange(e.target.value)} style={{ width: "50px", textAlign: "center" }} />
                              <span className="qty-btn plus" onClick={handlePlus} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-plus"></i></span>
                            </div>
                          ) : (
                            <span style={{ color: "#b2483c", fontWeight: "600" }}>Out of stock</span>
                          )}
                          {!isOutOfStock && (
                            <span style={{ marginLeft: "15px", fontSize: "12px", color: "#888" }}>
                              ({stock} items available in stock)
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="product-buttons" style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                  <a
                    className="btn btn-icon btn-outline-body btn-hover-dark"
                    href="#"
                    style={{ color: isFav ? "#e25c5c" : "" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (product) toggleWishlist(product);
                    }}
                  >
                    <i className={isFav ? "fas fa-heart" : "far fa-heart"}></i>
                  </a>
                  {!isOutOfStock ? (
                    <a className="btn btn-dark btn-outline-hover-dark" href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(); }}>
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </a>
                  ) : (
                    <a className="btn btn-dark disabled" href="#" style={{ cursor: "not-allowed", opacity: 0.6 }} onClick={(e) => e.preventDefault()}>
                      Out of Stock
                    </a>
                  )}
                </div>

                <div className="product-meta mb-0" style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                  <table style={{ width: "100%", fontSize: "14px", color: "#666" }}>
                    <tbody>
                      <tr>
                        <td className="label" style={{ width: "100px", padding: "6px 0" }}><span>SKU</span></td>
                        <td className="value" style={{ padding: "6px 0" }}>{sku || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="label" style={{ padding: "6px 0" }}><span>Category</span></td>
                        <td className="value" style={{ padding: "6px 0" }}>
                          <Link to={`/shop?category=${encodeURIComponent(category)}`} style={{ color: "#a87057" }}>{category}</Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="label" style={{ padding: "6px 0" }}><span>Brand</span></td>
                        <td className="value" style={{ padding: "6px 0" }}>{brand || "Learts"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Product Summary End */}

          </div>
        </div>
      </div>

      {/* Product tabs details description reviews */}
      <div className="section section-padding border-bottom">
        <div className="container">
          <ul className="nav product-info-tab-list">
            <li><a className="active" data-bs-toggle="tab" href="#tab-description">Description</a></li>
            <li><a data-bs-toggle="tab" href="#tab-reviews">Reviews (3)</a></li>
          </ul>
          <div className="tab-content product-infor-tab-content">
            <div className="tab-pane fade show active" id="tab-description">
              <div className="row">
                <div className="col-lg-10 col-12 mx-auto">
                  <p>{description}</p>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="tab-reviews">
              <div className="product-review-wrapper">
                <span className="title">3 reviews for {title}</span>
                <ul className="product-review-list">
                  <li>
                    <div className="product-review">
                      <div className="thumb"><img alt="" src="/assets/images/review/review-1.webp" /></div>
                      <div className="content">
                        <div className="ratings">
                          <span className="star-rating">
                            <span className="rating-active" style={{ width: "100%" }}>ratings</span>
                          </span>
                        </div>
                        <div className="meta">
                          <h5 className="title">Edna Watson</h5>
                          <span className="date">November 27, 2020</span>
                        </div>
                        <p>High-quality construction and beautiful glaze finish. It looks exactly like the product photos.</p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="product-review">
                      <div className="thumb"><img alt="" src="/assets/images/review/review-2.webp" /></div>
                      <div className="content">
                        <div className="ratings">
                          <span className="star-rating">
                            <span className="rating-active" style={{ width: "80%" }}>ratings</span>
                          </span>
                        </div>
                        <div className="meta">
                          <h5 className="title">Scott James</h5>
                          <span className="date">November 27, 2020</span>
                        </div>
                        <p>Wonderful purchase! The packaging was very secure, ensuring it arrived in perfect condition.</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      <div className="section section-padding">
        <div className="container">
          <div className="section-title2 text-center">
            <h2 className="title">You Might Also Like</h2>
          </div>

          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
            {relatedProducts.map((prod) => (
              <div key={prod.id} className="col">
                <ProductCard product={prod} onQuickView={handleQuickView} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuickViewModal product={selectedProduct} onAddToCart={handleQuickViewAddToCart} />
    </Layout>
  );
}
