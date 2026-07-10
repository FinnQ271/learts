import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface OrderCustomer {
  firstName: string;
  lastName: string;
  address: string;
  town: string;
  email: string;
  phone: string;
}

interface OrderItem {
  id: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const email = localStorage.getItem("adminEmail");

  useEffect(() => {
    // Auth Guard
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to retrieve orders.");
        }

        setOrders(data.data);
      } catch (err: any) {
        console.error("Fetch orders error:", err);
        setErrorMsg(err.message || "Failed to load orders lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Update state
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === orderId ? { ...o, status: data.data.status } : o))
      );
      alert(`Order status updated to "${newStatus}" successfully!`);
    } catch (err: any) {
      console.error("Update status error:", err);
      alert(err.message || "Failed to update order status.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning text-dark";
      case "Processing":
        return "badge bg-info text-white";
      case "Completed":
        return "badge bg-success";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <>
      <Header />

      <div className="section section-padding" style={{ background: "#f8f9fa", minHeight: "80vh" }}>
        <div className="container-fluid" style={{ maxWidth: "1250px", margin: "0 auto" }}>
          
          {/* Dashboard Banner Header */}
          <div className="row align-items-center mb-5" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="col-md-6 col-12">
              <h2 style={{ fontWeight: "700", margin: 0, fontSize: "24px" }}>Admin Dashboard</h2>
              <span style={{ fontSize: "14px", color: "#777" }}>Logged in as: <strong>{email}</strong></span>
            </div>
            <div className="col-md-6 col-12 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
              <Link className="btn btn-dark" to="/admin/products">Manage Products</Link>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <div className="row">
            <div className="col-12" style={{ background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              
              <div className="mb-4">
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Customer Order Processing</h3>
              </div>

              {errorMsg && (
                <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px" }}>
                  {errorMsg}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ color: "#a87057" }}></div>
                  <p className="mt-3 text-muted">Retrieving order lists...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No client orders recorded in the database yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle" style={{ fontSize: "13px" }}>
                    <thead>
                      <tr className="table-light">
                        <th style={{ width: "120px" }}>Order ID & Date</th>
                        <th>Customer Billing</th>
                        <th>Purchased Products</th>
                        <th>Grand Total</th>
                        <th style={{ width: "130px" }}>Status</th>
                        <th style={{ width: "150px" }}>Status Control</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.id}</strong>
                            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td>
                            <strong style={{ color: "#333" }}>{order.customer.firstName} {order.customer.lastName}</strong>
                            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                              <div><i className="fas fa-phone-alt" style={{ width: "16px", color: "#a87057" }}></i> {order.customer.phone}</div>
                              <div><i className="far fa-envelope" style={{ width: "16px", color: "#a87057" }}></i> {order.customer.email}</div>
                              <div><i className="fas fa-map-marker-alt" style={{ width: "16px", color: "#a87057" }}></i> {order.customer.address}, {order.customer.town}</div>
                            </div>
                          </td>
                          <td>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                              {order.items.map((item) => (
                                <li key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "6px", borderBottom: "1px dashed #eee", marginBottom: "4px" }}>
                                  <img src={item.image} alt={item.title} style={{ width: "30px", height: "30px", objectFit: "cover", borderRadius: "2px" }} />
                                  <div>
                                    <span style={{ fontWeight: "600" }}>{item.title}</span>{" "}
                                    <span style={{ color: "#777" }}>(${item.price} x {item.quantity})</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td style={{ color: "#a87057", fontWeight: "700", fontSize: "15px" }}>
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="text-center">
                            <span className={getStatusBadgeClass(order.status)}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{ padding: "6px", fontSize: "12px" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
