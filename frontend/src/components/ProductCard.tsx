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
    
    // Show a premium custom toast
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
    
    // Add custom inline styles for premium look
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
      borderLeft: "4px solid #a87057"
    });

    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);

    if (!isFav) {
      // Show a premium custom toast
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
      
      // Add custom inline styles for premium look
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
        borderLeft: "4px solid #e25c5c"
      });

      document.body.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      }, 10);

      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, 3000);
    }
  };

  const { id, title, priceDisplay, oldPrice, image, hoverImage, badges = [] } = product;
  const link = `/product/${id}`;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product">
      <div className="product-thumb">
        <Link className="image" to={link}>
          {(badges.length > 0 || isOutOfStock) && (
            <span className="product-badges">
              {isOutOfStock ? (
                <span className="outofstock">
                  <i className="far fa-frown"></i>
                </span>
              ) : (
                badges.map((badge: string, idx: number) => {
                  const bLower = badge.toLowerCase();
                  if (bLower === "hot" || bLower === "nóng" || bLower === "hot product") {
                    return <span key={idx} className="hot">{badge}</span>;
                  } else if (
                    bLower.includes("%") ||
                    bLower === "sale" ||
                    bLower.includes("giảm") ||
                    bLower.includes("khuyến mãi") ||
                    bLower.includes("doanh")
                  ) {
                    return <span key={idx} className="onsale">{badge}</span>;
                  } else {
                    return <span key={idx} className="new">{badge}</span>;
                  }
                })
              )}
            </span>
          )}
          <img alt={title} src={image} />
          {hoverImage && <img alt={title} className="image-hover" src={hoverImage} />}
        </Link>
        <a
          className="add-to-wishlist hintT-left"
          data-hint={isFav ? "Remove from wishlist" : "Add to wishlist"}
          href="#"
          onClick={handleToggleWishlist}
          style={{ color: isFav ? "#e25c5c" : "" }}
        >
          <i className={isFav ? "fas fa-heart" : "far fa-heart"}></i>
        </a>
      </div>
      <div className="product-info">
        <h6 className="title">
          <Link to={link}>{title}</Link>
        </h6>
        <span className="price">
          {oldPrice ? (
            <>
              <span className="old">{oldPrice}</span>
              <span className="new">{priceDisplay}</span>
            </>
          ) : (
            priceDisplay
          )}
        </span>
        <div className="product-buttons">
          <a
            className="product-button hintT-top"
            data-bs-toggle="modal"
            data-hint="Quick View"
            href="#quickViewModal"
            onClick={(e) => {
              if (onQuickView) {
                e.preventDefault();
                onQuickView(product);
              }
            }}
          >
            <i className="fas fa-search"></i>
          </a>
          {!isOutOfStock ? (
            <a
              className="product-button hintT-top"
              data-hint="Add to Cart"
              href="#"
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-cart"></i>
            </a>
          ) : (
            <a
              className="product-button hintT-top disabled"
              data-hint="Out of Stock"
              href="#"
              style={{ cursor: "not-allowed", opacity: 0.5 }}
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-ban"></i>
            </a>
          )}
          <a className="product-button hintT-top" data-hint="Compare" href="#">
            <i className="fas fa-random"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
