import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const navigate  = useNavigate();
  const addItem   = useCartStore((s) => s.addItem);
  const isFav     = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const toggleWL  = useWishlistStore((s) => s.toggleItem);

  /* ── helpers ── */
  const showToast = (html: string, accent: string) => {
    const el = document.createElement("div");
    el.innerHTML = html;
    Object.assign(el.style, {
      position: "fixed", bottom: "30px", right: "30px",
      background: "#fff", color: "#333",
      padding: "14px 18px", borderRadius: "8px",
      boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
      zIndex: "9999", transition: "all 0.3s ease",
      opacity: "0", transform: "translateY(16px)",
      borderLeft: `4px solid ${accent}`,
    });
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, 10);
    setTimeout(() => {
      el.style.opacity = "0"; el.style.transform = "translateY(16px)";
      setTimeout(() => el.remove(), 300);
    }, 2800);
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    showToast(
      `<div style="display:flex;align-items:center;gap:10px">
        <img src="${product.image}" style="width:38px;height:38px;object-fit:cover;border-radius:4px"/>
        <div><strong style="font-size:13px">Đã thêm vào giỏ</strong><br/>
        <span style="font-size:12px;color:#888">${product.title}</span></div></div>`,
      "#a87057"
    );
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWL(product);
    if (!isFav) {
      showToast(
        `<div style="display:flex;align-items:center;gap:10px">
          <img src="${product.image}" style="width:38px;height:38px;object-fit:cover;border-radius:4px"/>
          <div><strong style="font-size:13px">Đã thêm vào yêu thích</strong><br/>
          <span style="font-size:12px;color:#888">${product.title}</span></div></div>`,
        "#e25c5c"
      );
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const handleCardClick = () => navigate(`/product/${product.id}`);

  const { id, title, priceDisplay, oldPrice, image, hoverImage, badges = [] } = product;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pc-card" onClick={handleCardClick}>

      {/* ══════════════════════════════
          THUMBNAIL ZONE
      ══════════════════════════════ */}
      <div className="pc-thumb">

        {/* Badges — top-left, always on top */}
        {(badges.length > 0 || isOutOfStock) && (
          <div className="pc-badges" onClick={(e) => e.stopPropagation()}>
            {isOutOfStock ? (
              <span className="pc-badge pc-badge--out">Hết</span>
            ) : (
              badges.map((badge: string, idx: number) => {
                const b = badge.toLowerCase();
                let cls = "pc-badge--new";
                if (b === "hot" || b === "nóng") cls = "pc-badge--hot";
                else if (b.includes("%") || b === "sale" || b.includes("giảm") || b.includes("doanh"))
                  cls = "pc-badge--sale";
                return <span key={idx} className={`pc-badge ${cls}`}>{badge}</span>;
              })
            )}
          </div>
        )}

        {/* Main image */}
        <img className="pc-img pc-img--main" src={image} alt={title} />

        {/* Hover image — fades in on hover */}
        {hoverImage && (
          <img className="pc-img pc-img--hover" src={hoverImage} alt={title} />
        )}

        {/* Wishlist icon — top-right, appears on hover */}
        <button
          className={`pc-wishlist${isFav ? " pc-wishlist--active" : ""}`}
          onClick={handleWishlist}
          title={isFav ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <i className={isFav ? "fas fa-heart" : "far fa-heart"} />
        </button>
      </div>

      {/* ══════════════════════════════
          FOOTER ZONE  (fixed height)
          default  → title + price
          hover    → 3 action buttons
      ══════════════════════════════ */}
      <div className="pc-footer">

        {/* Info layer — visible by default */}
        <div className="pc-info">
          <h6 className="pc-title">
            <Link to={`/product/${id}`} onClick={(e) => e.stopPropagation()}>
              {title}
            </Link>
          </h6>
          <span className="pc-price">
            {oldPrice ? (
              <>
                <span className="pc-price--old">{oldPrice}</span>
                <span className="pc-price--new">{priceDisplay}</span>
              </>
            ) : priceDisplay}
          </span>
        </div>

        {/* Actions layer — hidden by default, appears on hover */}
        <div className="pc-actions" onClick={(e) => e.stopPropagation()}>
          {/* Quick view */}
          <button className="pc-action-btn" title="Xem nhanh" onClick={handleQuickView}>
            <i className="fas fa-search" />
          </button>

          {/* Add to cart */}
          {!isOutOfStock ? (
            <button className="pc-action-btn" title="Thêm vào giỏ hàng" onClick={handleCart}>
              <i className="fas fa-shopping-cart" />
            </button>
          ) : (
            <button className="pc-action-btn pc-action-btn--disabled" title="Hết hàng" disabled>
              <i className="fas fa-ban" />
            </button>
          )}

          {/* Compare */}
          <button className="pc-action-btn" title="So sánh" onClick={(e) => e.stopPropagation()}>
            <i className="fas fa-random" />
          </button>
        </div>

      </div>
    </div>
  );
}
