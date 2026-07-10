import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMsg("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (error: any) {
      console.error("Admin register error:", error);
      setErrorMsg(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="section section-padding" style={{ background: "#f8f9fa", minHeight: "65vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: "8px", padding: "40px" }}>
                <div className="text-center mb-4">
                  <h2 style={{ fontWeight: "700", color: "#333", fontSize: "28px" }}>Admin Register</h2>
                  <p style={{ color: "#777", fontSize: "14px", marginTop: "5px" }}>Create a new administrative account</p>
                </div>

                {errorMsg && (
                  <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px" }}>
                    <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="alert alert-success" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px" }}>
                    <i className="fas fa-check-circle" style={{ marginRight: "8px" }}></i>
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="form-group mb-3">
                    <label htmlFor="regEmail" style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Email address <abbr className="required" title="required">*</abbr></label>
                    <input
                      id="regEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@learts.com"
                      style={{ width: "100%", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="regPassword" style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Password <abbr className="required" title="required">*</abbr></label>
                    <input
                      id="regPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "12px 15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="regConfirmPassword" style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Confirm Password <abbr className="required" title="required">*</abbr></label>
                    <input
                      id="regConfirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Registering...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="text-center mt-4" style={{ fontSize: "14px", color: "#666" }}>
                  Already have an admin account?{" "}
                  <Link to="/admin/login" style={{ color: "#a87057", fontWeight: "600" }}>
                    Login
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
