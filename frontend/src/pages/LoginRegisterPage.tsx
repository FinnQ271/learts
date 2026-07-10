import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function LoginRegisterPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerEmail, setRegisterEmail] = useState("");
  
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reload template scripts once data has finished loading and is rendered in DOM
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
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setMessage({ type: "danger", text: "Please enter both email and password." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const authData = data.data;
      setMessage({ type: "success", text: `Login successful! Logged in as ${authData.role}.` });
      
      if (authData.role === "admin") {
        localStorage.setItem("adminToken", authData.token);
        localStorage.setItem("adminEmail", authData.email);
        setTimeout(() => navigate("/admin/products"), 1200);
      } else {
        localStorage.setItem("customerToken", authData.token);
        localStorage.setItem("customerEmail", authData.email);
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage({ type: "danger", text: err.message || "Invalid credentials." });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail) {
      setMessage({ type: "danger", text: "Please enter an email address." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: "customerpassword", // default password to maintain clean UI inputs matching template
          role: "customer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage({
        type: "success",
        text: `Account registered successfully! Default password is: customerpassword`,
      });
      setRegisterEmail("");
    } catch (err: any) {
      console.error("Registration error:", err);
      setMessage({ type: "danger", text: err.message || "Registration failed." });
    } finally {
      setLoading(false);
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
                <h1 className="title">Login &amp; Register</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Login &amp; Register</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        <div className="container">
          
          {/* Status Message Display */}
          {message && (
            <div className={`alert alert-${message.type} text-center`} style={{ maxWidth: "600px", margin: "0 auto 30px auto", fontSize: "14px", borderRadius: "4px" }}>
              {message.type === "success" ? (
                <i className="fas fa-check-circle" style={{ marginRight: "8px" }}></i>
              ) : (
                <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
              )}
              {message.text}
            </div>
          )}

          <div className="row g-0">
            
            {/* Login Column */}
            <div className="col-lg-6">
              <div className="user-login-register bg-light">
                <div className="login-register-title">
                  <h2 className="title">Login</h2>
                  <p className="desc">Great to have you back!</p>
                </div>
                <div className="login-register-form">
                  <form onSubmit={handleLogin}>
                    <div className="row learts-mb-n50">
                      
                      <div className="col-12 learts-mb-50">
                        <input
                          placeholder="Username or email address"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12 learts-mb-50">
                        <input
                          placeholder="Password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12 text-center learts-mb-50">
                        <button className="btn btn-dark btn-outline-hover-dark" type="submit" disabled={loading}>
                          login
                        </button>
                      </div>

                      <div className="col-12 learts-mb-50">
                        <div className="row learts-mb-n20">
                          <div className="col-12 learts-mb-20">
                            <div className="form-check">
                              <input className="form-check-input" id="rememberMe" type="checkbox" />
                              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                            </div>
                          </div>
                          <div className="col-12 learts-mb-20">
                            <a className="fw-400" href="/lost-password">Lost your password?</a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Register Column */}
            <div className="col-lg-6">
              <div className="user-login-register">
                <div className="login-register-title">
                  <h2 className="title">Register</h2>
                  <p className="desc">If you don’t have an account, register now!</p>
                </div>
                <div className="login-register-form">
                  <form onSubmit={handleRegister}>
                    <div className="row learts-mb-n50">
                      
                      <div className="col-12 learts-mb-20">
                        <label htmlFor="registerEmail">Email address <abbr className="required" title="required">*</abbr></label>
                        <input
                          id="registerEmail"
                          type="email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12 learts-mb-50">
                        <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy</p>
                      </div>

                      <div className="col-12 text-center learts-mb-50">
                        <button className="btn btn-dark btn-outline-hover-dark" type="submit" disabled={loading}>
                          Register
                        </button>
                      </div>

                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </Layout>
  );
}
