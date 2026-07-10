import { useEffect } from "react";
import Layout from "../components/Layout";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  // Sync jQuery plugins / template scripts after render
  useEffect(() => {
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
  }, [items]);

  return (
    <Layout>
      {/* Breadcrumb section */}
      <div className="page-title-section section" style={{ backgroundImage: "url(/assets/images/bg/page-title-1.webp)" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Wishlist</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Wishlist</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Table section */}
      <div className="section section-padding">
        <div className="container">
          {items.length === 0 ? (
            <div className="text-center" style={{ padding: "50px 0" }}>
              <i className="far fa-heart" style={{ fontSize: "64px", color: "#ddd", marginBottom: "20px" }}></i>
              <h3>Your wishlist is currently empty.</h3>
              <p style={{ color: "#777", marginBottom: "30px" }}>Add items to your wishlist to keep track of your favorite products.</p>
              <a className="btn btn-dark btn-outline-hover-dark" href="/shop">Go To Shop</a>
            </div>
          ) : (
            <form action="#" className="cart-form" onSubmit={(e) => e.preventDefault()}>
              <table className="cart-wishlist-table table">
                <thead>
                  <tr>
                    <th className="name" colSpan={2}>Product</th>
                    <th className="price">Unit Price</th>
                    <th className="add-to-cart">&nbsp;</th>
                    <th className="remove">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id}>
                      <td className="thumbnail">
                        <a href={`/product/${product.id}`}>
                          <img alt={product.title} src={product.image} />
                        </a>
                      </td>
                      <td className="name">
                        <a href={`/product/${product.id}`}>{product.title}</a>
                      </td>
                      <td className="price">
                        <span>{product.priceDisplay}</span>
                      </td>
                      <td className="add-to-cart">
                        <button
                          className="btn btn-light btn-hover-dark"
                          onClick={() => {
                            addToCart(product, 1);
                            
                            // Show premium toast
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
                              borderLeft: "4px solid #a87057"
                            });
                            document.body.appendChild(toast);
                            setTimeout(() => {
                              toast.style.opacity = "1";
                              toast.style.transform = "translateY(0)";
                            }, 10);
                            setTimeout(() => {
                              toast.style.opacity = "0";
                              toast.style.transform = "translateY(20px)";
                              setTimeout(() => {
                                toast.remove();
                              }, 300);
                            }, 3000);
                          }}
                        >
                          <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>Add to Cart
                        </button>
                      </td>
                      <td className="remove">
                        <button
                          className="btn"
                          style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                          onClick={() => removeItem(product.id)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <div className="col text-center mb-n3">
                  <a className="btn btn-light btn-hover-dark mb-3" href="/shop" style={{ marginRight: "15px" }}>Continue Shopping</a>
                  <a className="btn btn-dark btn-outline-hover-dark mb-3" href="/shopping-cart">View Cart</a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
