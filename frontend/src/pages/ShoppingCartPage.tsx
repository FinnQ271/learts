import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useCartStore } from "../store/cartStore";

export default function ShoppingCartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const handleMinus = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty - 1);
  };

  const handlePlus = (id: string, currentQty: number, stock: number) => {
    updateQuantity(id, Math.min(stock, currentQty + 1));
  };

  const handleInputChange = (id: string, valStr: string, stock: number) => {
    const val = parseInt(valStr, 10);
    if (!isNaN(val)) {
      updateQuantity(id, Math.min(stock, Math.max(1, val)));
    }
  };

  return (
    <Layout>
      
      {/* Breadcrumb section */}
      <div className="page-title-section section" style={{ backgroundImage: "url(/assets/images/bg/page-title-1.webp)" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Cart</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Cart</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        <div className="container">
          
          {items.length === 0 ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <i className="fas fa-shopping-basket" style={{ fontSize: "64px", color: "#ddd", marginBottom: "20px" }}></i>
              <h3 style={{ marginBottom: "20px", fontWeight: "600" }}>Your Cart is Empty</h3>
              <p style={{ color: "#777", marginBottom: "30px" }}>Add some beautiful handmade items to your cart first.</p>
              <Link className="btn btn-dark btn-outline-hover-dark" to="/shop">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <form action="#" className="cart-form" onSubmit={(e) => e.preventDefault()}>
                <table className="cart-wishlist-table table">
                  <thead>
                    <tr>
                      <th className="name" colSpan={2}>Product</th>
                      <th className="price">Price</th>
                      <th className="quantity">Quantity</th>
                      <th className="subtotal">Total</th>
                      <th className="remove">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="thumbnail">
                          <Link to={`/product/${item.id}`}>
                            <img alt={item.title} src={item.image} />
                          </Link>
                        </td>
                        <td className="name">
                          <Link to={`/product/${item.id}`}>{item.title}</Link>
                        </td>
                        <td className="price">
                          <span>{item.priceDisplay}</span>
                        </td>
                        <td className="quantity">
                          <div className="product-quantity" style={{ display: "inline-flex", alignItems: "center" }}>
                            <span className="qty-btn minus" onClick={() => handleMinus(item.id, item.quantity)} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-minus"></i></span>
                            <input
                              className="input-qty"
                              type="text"
                              value={item.quantity}
                              onChange={(e) => handleInputChange(item.id, e.target.value, item.stock)}
                              style={{ width: "50px", textAlign: "center" }}
                            />
                            <span className="qty-btn plus" onClick={() => handlePlus(item.id, item.quantity, item.stock)} style={{ cursor: "pointer", userSelect: "none" }}><i className="ti-plus"></i></span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                            {item.stock} in stock
                          </div>
                        </td>
                        <td className="subtotal">
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </td>
                        <td className="remove">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => removeItem(item.id)}
                            style={{ background: "none", border: "none", fontSize: "18px", color: "#999" }}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="row justify-content-between mb-n3" style={{ marginTop: "20px" }}>
                  <div className="col-auto mb-3">
                    <div className="cart-coupon">
                      <input placeholder="Enter your coupon code" type="text" />
                      <button className="btn"><i className="fas fa-gift"></i></button>
                    </div>
                  </div>
                  <div className="col-auto">
                    <Link className="btn btn-light btn-hover-dark mr-3 mb-3" to="/shop" style={{ marginRight: "10px" }}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </form>

              {/* Cart totals summary */}
              <div className="cart-totals mt-5" style={{ maxWidth: "450px", marginLeft: "auto" }}>
                <h2 className="title" style={{ fontSize: "20px", fontWeight: "700", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
                  Cart totals
                </h2>
                <table style={{ width: "100%", marginBottom: "25px" }}>
                  <tbody>
                    <tr className="subtotal" style={{ borderBottom: "1px solid #eee" }}>
                      <th style={{ textAlign: "left", padding: "10px 0", fontWeight: "600" }}>Subtotal</th>
                      <td style={{ textAlign: "right", padding: "10px 0" }}><span className="amount">${totalPrice.toFixed(2)}</span></td>
                    </tr>
                    <tr className="total">
                      <th style={{ textAlign: "left", padding: "15px 0", fontWeight: "700", fontSize: "16px" }}>Total</th>
                      <td style={{ textAlign: "right", padding: "15px 0" }}><strong><span className="amount" style={{ fontSize: "18px", color: "#a87057" }}>${totalPrice.toFixed(2)}</span></strong></td>
                    </tr>
                  </tbody>
                </table>
                <Link className="btn btn-dark btn-outline-hover-dark w-100 text-center" to="/checkout" style={{ display: "block" }}>
                  Proceed to checkout
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

    </Layout>
  );
}
