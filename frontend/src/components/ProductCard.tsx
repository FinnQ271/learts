import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isFav = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap: 10px;">
        <img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
        <div>
          <h6 style="margin: 0; font-size: 14px; font-weight: 600;">Added to Cart</h6>
          <span style="font-size: 12px; color: #777;">${product.title}</span>
        </div>
      </div>
    `;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      background: "#fff",
      color: "#333",
      padding: "15px 20px",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      zIndex: "9999",
      transition: "all 0.3s ease",
      opacity: "0",
      transform: "translateY(20px)",
      borderLeft: "4px solid #a87057",
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);

    if (!isFav) {
      const toast = document.createElement("div");
      toast.className = "wishlist-toast";
      toast.innerHTML = `
        <div style="display:flex; align-items:center; gap: 10px;">
          <img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
          <div>
            <h6 style="margin: 0; font-size: 14px; font-weight: 600;">Added to Wishlist</h6>
            <span style="font-size: 12px; color: #777;">${product.title}</span>
          </div>
        </div>
      `;
      Object.assign(toast.style, {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "#fff",
        color: "#333",
        padding: "15px 20px",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        zIndex: "9999",
        transition: "all 0.3s ease",
        opacity: "0",
        transform: "translateY(20px)",
        borderLeft: "4px solid #e25c5c",
      });
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      }, 10);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  const { id, title, priceDisplay, oldPrice, image, hoverImage, badges = [] } = product;
  const link = `/product/${id}`;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pc-card">
      {/* ── THUMBNAIL ── */}
      <div className="pc-thumb">
        {/* Badges — top-left, always visible */}
        {(badges.length > 0 || isOutOfStock) && (
          <span className="pc-badges">
            {isOutOfStock ? (
              <span className="pc-badge pc-badge--out">
                <i className="far fa-frown" />
              </span>
            ) : (
              badges.map((badge: string, idx: number) => {
                const bLower = badge.toLowerCase();
                let cls = "pc-badge--new";
                if (bLower === "hot" || bLower === "nóng") cls = "pc-badge--hot";
                else if (
                  bLower.includes("%") ||
                  bLower === "sale" ||
                  bLower.includes("giảm") ||
                  bLower.includes("doanh")
                )
                  cls = "pc-badge--sale";
                return (
                  <span key={idx} className={`pc-badge ${cls}`}>
                    {badge}
                  </span>
                );
              })
            )}
          </span>
        )}

        {/* Main image */}
        <Link className="pc-img-link" to={link} tabIndex={-1}>
          <img className="pc-img pc-img--main" src={image} alt={title} />
          {hoverImage && (
            <img className="pc-img pc-img--hover" src={hoverImage} alt={title} />
          )}
        </Link>

        {/* ── HOVER OVERLAY ── */}
        <div className="pc-overlay">
          {/* Wishlist — top-right */}
          <a
            className="pc-wishlist"
            href="#"
            title={isFav ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            onClick={handleToggleWishlist}
          >
            <i className={isFav ? "fas fa-heart" : "far fa-heart"} />
          </a>

          {/* 3 action buttons — center-bottom */}
          <div className="pc-actions">
            {/* Quick View */}
            <a
              className="pc-action-btn"
              href="#"
              title="Xem nhanh"
              onClick={(e) => {
                e.preventDefault();
                if (onQuickView) onQuickView(product);
              }}
            >
              <i className="fas fa-search" />
            </a>

            {/* Add to Cart */}
            {!isOutOfStock ? (
              <a
                className="pc-action-btn"
                href="#"
                title="Thêm vào giỏ hàng"
                onClick={handleAddToCart}
              >
                <i className="fas fa-shopping-cart" />
              </a>
            ) : (
              <a
                className="pc-action-btn pc-action-btn--disabled"
                href="#"
                title="Hết hàng"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-ban" />
              </a>
            )}

            {/* Compare */}
            <a className="pc-action-btn" href="#" title="So sánh">
              <i className="fas fa-random" />
            </a>
          </div>
        </div>
      </div>

      {/* ── INFO (title + price) — hidden on hover ── */}
      <div className="pc-info">
        <h6 className="pc-title">
          <Link to={link}>{title}</Link>
        </h6>
        <span className="pc-price">
          {oldPrice ? (
            <>
              <span className="pc-price--old">{oldPrice}</span>
              <span className="pc-price--new">{priceDisplay}</span>
            </>
          ) : (
            priceDisplay
          )}
        </span>
      </div>
    </div>
  );
}
