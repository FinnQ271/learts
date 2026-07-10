import { useState, useEffect } from "react";
import type { Product } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

interface QuickViewModalProps {
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function QuickViewModal({ product, onAddToCart }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const isFav = useWishlistStore((state) => state.items.some((item) => item.id === product?.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  // Reset quantity when product changes
  useEffect(() => {
    setQty(1);
  }, [product]);

  if (!product) {
    // Empty shell so bootstrap doesn't break
    return (
      <div
        className="quickViewModal modal fade"
        id="quickViewModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ minHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <button className="close" data-bs-dismiss="modal" style={{ position: "absolute", top: "15px", right: "20px", border: "none", background: "none", fontSize: "24px" }}>×</button>
            <p style={{ margin: 0, color: "#999" }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  const { title, priceDisplay, oldPrice, image, category, sku, brand, description, stock } = product;
  const isOutOfStock = stock <= 0;

  const handleMinus = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handlePlus = () => {
    setQty((prev) => Math.min(stock, prev + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setQty(Math.min(stock, Math.max(1, val)));
    } else {
      setQty(1);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOutOfStock) {
      onAddToCart(product, qty);
      // Close modal using bootstrap programmatic trigger or just data-bs-dismiss
      const closeBtn = document.querySelector<HTMLButtonElement>("#quickViewModal .close");
      closeBtn?.click();
    }
  };

  return (
    <div
      className="quickViewModal modal fade"
      id="quickViewModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <button className="close" data-bs-dismiss="modal">×</button>
          <div className="row learts-mb-n30">
            {/* Product Images Start */}
            <div className="col-lg-6 col-12 learts-mb-30">
              <div className="product-images" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
                <div style={{ width: "100%", maxWidth: "400px" }}>
                  <img alt={title} src={image} style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }} />
                </div>
              </div>
            </div>
            {/* Product Images End */}
            {/* Product Summary Start */}
            <div className="col-lg-6 col-12 overflow-hidden position-relative learts-mb-30">
              <div className="product-summery customScroll" style={{ padding: "20px 25px 20px 10px" }}>
                <div className="product-ratings">
                  <span className="star-rating">
                    <span className="rating-active" style={{ width: "100%" }}>ratings</span>
                  </span>
                  <a className="review-link" href="#reviews">(<span className="count">3</span> customer reviews)</a>
                </div>
                <h3 className="product-title" style={{ fontSize: "22px", margin: "10px 0" }}>{title}</h3>
                
                <div className="product-price" style={{ fontSize: "20px", fontWeight: "600", color: "#a87057", marginBottom: "15px" }}>
                  {oldPrice ? (
                    <>
                      <span className="old" style={{ textDecoration: "line-through", color: "#999", marginRight: "10px", fontSize: "16px" }}>{oldPrice}</span>
                      <span>{priceDisplay}</span>
                    </>
                  ) : (
                    priceDisplay
                  )}
                </div>

                <div className="product-description" style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#666" }}>{description}</p>
                </div>

                <div className="product-variations">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td className="label" style={{ width: "80px", verticalAlign: "middle" }}><span>Quantity</span></td>
                        <td className="value">
                          {!isOutOfStock ? (
                            <div className="product-quantity" style={{ display: "inline-flex", alignItems: "center" }}>
                              <span className="qty-btn minus" onClick={handleMinus} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-minus"></i></span>
                              <input className="input-qty" type="text" value={qty} onChange={handleInputChange} style={{ width: "50px", textAlign: "center" }} />
                              <span className="qty-btn plus" onClick={handlePlus} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-plus"></i></span>
                            </div>
                          ) : (
                            <span style={{ color: "#b2483c", fontWeight: "600" }}>Out of stock</span>
                          )}
                          {!isOutOfStock && (
                            <span style={{ marginLeft: "15px", fontSize: "12px", color: "#888" }}>
                              ({stock} available)
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="product-buttons" style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
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
                    <a className="btn btn-dark btn-outline-hover-dark" href="#" onClick={handleAdd}>
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </a>
                  ) : (
                    <a className="btn btn-dark disabled" href="#" style={{ cursor: "not-allowed", opacity: 0.6 }} onClick={(e) => e.preventDefault()}>
                      Out of Stock
                    </a>
                  )}
                </div>

                <div className="product-meta mb-0" style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                  <table style={{ width: "100%", fontSize: "13px", color: "#777" }}>
                    <tbody>
                      <tr>
                        <td className="label" style={{ width: "80px", padding: "4px 0" }}><span>SKU</span></td>
                        <td className="value" style={{ padding: "4px 0" }}>{sku || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="label" style={{ padding: "4px 0" }}><span>Category</span></td>
                        <td className="value" style={{ padding: "4px 0" }}>{category}</td>
                      </tr>
                      <tr>
                        <td className="label" style={{ padding: "4px 0" }}><span>Brand</span></td>
                        <td className="value" style={{ padding: "4px 0" }}>{brand || "Learts"}</td>
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
    </div>
  );
}
