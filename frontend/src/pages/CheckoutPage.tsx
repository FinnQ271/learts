import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "../components/Layout";
import { useCartStore } from "../store/cartStore";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  address: z.string().min(5, "Street address must be at least 5 characters"),
  town: z.string().min(1, "Town or City is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\d{10}$/.test(val), {
      message: "Phone number must be digits only and exactly 10 characters",
    }),
  companyName: z.string().optional(),
  postcode: z.string().optional(),
  orderNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Sync template scripts on mount
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      town: "",
      email: "",
      phone: "",
      companyName: "",
      postcode: "",
      orderNotes: "",
    },
  });

  const onSubmit = async (_data: CheckoutFormData) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        ..._data,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "Order placement failed");
      }

      setSuccess(true);
      clearCart();
    } catch (error: any) {
      console.error("Order submission failed:", error);
      setErrorMsg(error.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccess(false);
    navigate("/");
  };

  return (
    <Layout>

      {/* Breadcrumb section */}
      <div className="page-title-section section" style={{ backgroundImage: "url(/assets/images/bg/page-title-1.webp)" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Checkout</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        <div className="container">
          
          {items.length === 0 && !success ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <i className="fas fa-credit-card" style={{ fontSize: "64px", color: "#ddd", marginBottom: "20px" }}></i>
              <h3 style={{ marginBottom: "20px", fontWeight: "600" }}>Your Cart is Empty</h3>
              <p style={{ color: "#777", marginBottom: "30px" }}>You cannot checkout without items in your cart.</p>
              <Link className="btn btn-dark btn-outline-hover-dark" to="/shop">
                Go to Shop
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form-container">
              <div className="row learts-mb-n50">
                
                {/* Billing details form */}
                <div className="col-lg-7 col-12 learts-mb-50">
                  <div className="section-title2" style={{ marginBottom: "25px" }}>
                    <h2 className="title" style={{ fontSize: "22px", fontWeight: "700" }}>Billing details</h2>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 col-12 learts-mb-20">
                      <label htmlFor="bdFirstName">First Name <abbr className="required" title="required">*</abbr></label>
                      <input id="bdFirstName" type="text" {...register("firstName")} />
                      {errors.firstName && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.firstName.message}</span>}
                    </div>
                    <div className="col-md-6 col-12 learts-mb-20">
                      <label htmlFor="bdLastName">Last Name <abbr className="required" title="required">*</abbr></label>
                      <input id="bdLastName" type="text" {...register("lastName")} />
                      {errors.lastName && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.lastName.message}</span>}
                    </div>
                    
                    <div className="col-12 learts-mb-20">
                      <label htmlFor="bdCompanyName">Company name (optional)</label>
                      <input id="bdCompanyName" type="text" {...register("companyName")} />
                    </div>

                    <div className="col-12 learts-mb-20">
                      <label htmlFor="bdAddress1">Street address <abbr className="required" title="required">*</abbr></label>
                      <input id="bdAddress1" placeholder="House number and street name" type="text" {...register("address")} />
                      {errors.address && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.address.message}</span>}
                    </div>

                    <div className="col-12 learts-mb-20">
                      <label htmlFor="bdTownOrCity">Town / City <abbr className="required" title="required">*</abbr></label>
                      <input id="bdTownOrCity" type="text" {...register("town")} />
                      {errors.town && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.town.message}</span>}
                    </div>

                    <div className="col-12 learts-mb-20">
                      <label htmlFor="bdPostcode">Postcode / ZIP (optional)</label>
                      <input id="bdPostcode" type="text" {...register("postcode")} />
                    </div>

                    <div className="col-md-6 col-12 learts-mb-20">
                      <label htmlFor="bdEmail">Email address <abbr className="required" title="required">*</abbr></label>
                      <input id="bdEmail" type="text" {...register("email")} />
                      {errors.email && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.email.message}</span>}
                    </div>

                    <div className="col-md-6 col-12 learts-mb-30">
                      <label htmlFor="bdPhone">Phone <abbr className="required" title="required">*</abbr></label>
                      <input id="bdPhone" type="text" {...register("phone")} />
                      {errors.phone && <span style={{ color: "#b2483c", fontSize: "12px", marginTop: "4px", display: "block" }}>{errors.phone.message}</span>}
                    </div>

                    <div className="col-12 learts-mb-20">
                      <label htmlFor="bdOrderNote">Order Notes (optional)</label>
                      <textarea id="bdOrderNote" placeholder="Notes about your order, e.g. special notes for delivery." {...register("orderNotes")}></textarea>
                    </div>
                  </div>
                </div>

                {/* Order review column */}
                <div className="col-lg-5 col-12 learts-mb-50" style={{ paddingLeft: "30px" }}>
                  <div className="section-title2 text-center" style={{ marginBottom: "25px" }}>
                    <h2 className="title" style={{ fontSize: "22px", fontWeight: "700" }}>Your order</h2>
                  </div>
                  
                  <div className="order-review" style={{ background: "#fafafa", padding: "30px", borderRadius: "8px", border: "1px solid #f2f2f2" }}>
                    <table className="table" style={{ width: "100%", marginBottom: "20px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #333" }}>
                          <th className="name" style={{ textAlign: "left", paddingBottom: "10px", fontWeight: "700" }}>Product</th>
                          <th className="total" style={{ textAlign: "right", paddingBottom: "10px", fontWeight: "700" }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td className="name" style={{ padding: "12px 0", fontSize: "14px" }}>
                              {item.title}&nbsp; <strong className="quantity">×&nbsp;{item.quantity}</strong>
                            </td>
                            <td className="total" style={{ textAlign: "right", padding: "12px 0", fontSize: "14px" }}>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="subtotal" style={{ borderBottom: "1px solid #eee" }}>
                          <th style={{ padding: "15px 0", fontWeight: "600", fontSize: "14px" }}>Subtotal</th>
                          <td style={{ textAlign: "right", padding: "15px 0", fontSize: "14px" }}>
                            <span>${totalPrice.toFixed(2)}</span>
                          </td>
                        </tr>
                        <tr className="total">
                          <th style={{ padding: "15px 0", fontWeight: "700", fontSize: "16px" }}>Total</th>
                          <td style={{ textAlign: "right", padding: "15px 0" }}>
                            <strong><span style={{ fontSize: "18px", color: "#a87057" }}>${totalPrice.toFixed(2)}</span></strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="order-payment" style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                      <div className="payment-method">
                        <div className="accordion" id="paymentMethod">
                          <div className="card active" style={{ border: "none", background: "none" }}>
                            <div className="card-header" style={{ padding: "10px 0", background: "none", border: "none" }}>
                              <button type="button" style={{ background: "none", border: "none", fontWeight: "600", fontSize: "14px", color: "#333", display: "flex", alignItems: "center" }}>
                                <input type="radio" defaultChecked name="pm" style={{ marginRight: "10px" }} /> Cash on delivery
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center" style={{ marginTop: "25px" }}>
                        <p className="payment-note" style={{ fontSize: "12px", color: "#888", lineHeight: "1.5", marginBottom: "20px" }}>
                          Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                        </p>
                        
                        {errorMsg && (
                          <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px", marginBottom: "15px", textAlign: "left" }}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
                            {errorMsg}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="btn btn-dark btn-outline-hover-dark w-100"
                          disabled={submitting}
                          style={{ minHeight: "50px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ color: "#fff" }}></span>
                              Processing...
                            </>
                          ) : (
                            "Place Order"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          )}

        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 10000 }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
              <div className="modal-body text-center" style={{ padding: "40px 30px" }}>
                <i className="far fa-check-circle" style={{ fontSize: "72px", color: "#a87057", marginBottom: "20px" }}></i>
                <h3 style={{ fontWeight: "700", marginBottom: "15px" }}>Order Placed Successfully!</h3>
                <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
                  Thank you for your purchase. Your order details have been recorded and will be processed immediately.
                </p>
                <button
                  type="button"
                  className="btn btn-dark btn-outline-hover-dark"
                  onClick={handleCloseSuccessModal}
                  style={{ minWidth: "150px" }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
