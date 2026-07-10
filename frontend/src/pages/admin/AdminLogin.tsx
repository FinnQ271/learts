import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminEmail", data.data.email);

      // Redirect to dashboard
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Admin login error:", error);
      setErrorMsg(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="section section-padding" style={{ background: "#f8f9fa", minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: "8px", padding: "40px" }}>
                <div className="text-center mb-4">
                  <h2 style={{ fontWeight: "700", color: "#333", fontSize: "28px" }}>Admin Login</h2>
                  <p style={{ color: "#777", fontSize: "14px", marginTop: "5px" }}>Access your administrative dashboard</p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px" }}>
                    <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-group mb-3">
                    <label htmlFor="loginEmail" style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Email address <abbr className="required" title="required">*</abbr></label>
                    <input
                      id="loginEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@learts.com"
                      style={{ width: "100%", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="loginPassword" style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Password <abbr className="required" title="required">*</abbr></label>
                    <input
                      id="loginPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark btn-outline-hover-dark w-100"
                    disabled={loading}
                    style={{ minHeight: "48px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ color: "#fff" }}></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4" style={{ fontSize: "14px", color: "#666" }}>
                  Don't have an admin account?{" "}
                  <Link to="/admin/register" style={{ color: "#a87057", fontWeight: "600" }}>
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
