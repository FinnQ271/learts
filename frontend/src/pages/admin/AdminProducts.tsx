import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import type { Product } from "../../store/cartStore";
import type { Category } from "../../services/apiService";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Forms & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const email = localStorage.getItem("adminEmail");

  useEffect(() => {
    // Auth Guard
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // Fetch categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData.data);

        // Fetch products
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        setProducts(prodData.data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setErrorMsg("Failed to retrieve dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setPrice("");
    setStock("");
    setCategory(categories[0]?.title || "");
    setImage("");
    setDescription("");
    setSku("");
    setBrand("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategory(product.category);
    setImage(product.image);
    setDescription(product.description || "");
    setSku(product.sku || "");
    setBrand(product.brand || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !stock || !category || !image) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      title,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      image,
      description,
      sku,
      brand,
    };

    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      setErrorMsg(null);
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      // Refresh list
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      setProducts(prodData.data);
      
      handleCloseModal();
      alert(editingProduct ? "Product updated successfully!" : "Product created successfully!");
    } catch (err: any) {
      console.error("Save product error:", err);
      alert(err.message || "An error occurred while saving product.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (err: any) {
      console.error("Delete product error:", err);
      alert(err.message || "An error occurred while deleting product.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  return (
    <>
      <Header />

      <div className="section section-padding" style={{ background: "#f8f9fa", minHeight: "80vh" }}>
        <div className="container-fluid" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Dashboard Header Banner */}
          <div className="row align-items-center mb-5" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="col-md-6 col-12">
              <h2 style={{ fontWeight: "700", margin: 0, fontSize: "24px" }}>Admin Dashboard</h2>
              <span style={{ fontSize: "14px", color: "#777" }}>Logged in as: <strong>{email}</strong></span>
            </div>
            <div className="col-md-6 col-12 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
              <Link className="btn btn-dark" to="/admin/orders">Manage Orders</Link>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <div className="row">
            <div className="col-12" style={{ background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Product Inventory Management</h3>
                <button className="btn btn-dark" onClick={handleOpenAddModal}>
                  <i className="ti-plus" style={{ marginRight: "8px" }}></i> Add Product
                </button>
              </div>

              {errorMsg && (
                <div className="alert alert-danger" style={{ fontSize: "14px", padding: "10px 15px", borderRadius: "4px" }}>
                  {errorMsg}
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ color: "#a87057" }}></div>
                  <p className="mt-3 text-muted">Retrieving inventory records...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No products recorded. Click "Add Product" to populate.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle" style={{ fontSize: "14px" }}>
                    <thead>
                      <tr className="table-light">
                        <th style={{ width: "80px" }}>Image</th>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th style={{ width: "150px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id}>
                          <td>
                            <img src={prod.image} alt={prod.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                          </td>
                          <td>
                            <strong style={{ display: "block", color: "#333" }}>{prod.title}</strong>
                            <span style={{ fontSize: "12px", color: "#888" }}>SKU: {prod.sku || "N/A"} | Brand: {prod.brand || "Learts"}</span>
                          </td>
                          <td>{prod.category}</td>
                          <td style={{ color: "#a87057", fontWeight: "600" }}>{prod.priceDisplay}</td>
                          <td>
                            <span className={prod.stock <= 0 ? "badge bg-danger" : prod.stock < 5 ? "badge bg-warning text-dark" : "badge bg-success"}>
                              {prod.stock <= 0 ? "Out of Stock" : `${prod.stock} units`}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleOpenEditModal(prod)} style={{ padding: "4px 8px", marginRight: "8px" }}>
                              <i className="far fa-edit"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(prod.id, prod.title)} style={{ padding: "4px 8px" }}>
                              <i className="far fa-trash-alt"></i> Delete
                            </button>
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

      {/* Product Add/Edit Modal Backdrop Form */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)", zIndex: 10000 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "8px", border: "none" }}>
              <div className="modal-header" style={{ borderBottom: "1px solid #eee" }}>
                <h5 className="modal-title" style={{ fontWeight: "700" }}>
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Product"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "25px" }}>
                  <div className="row g-3">
                    
                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Product Title <abbr style={{ color: "red" }}>*</abbr></label>
                      <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Category <abbr style={{ color: "red" }}>*</abbr></label>
                      <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.title}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Price ($) <abbr style={{ color: "red" }}>*</abbr></label>
                      <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Stock Quantity <abbr style={{ color: "red" }}>*</abbr></label>
                      <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>

                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Image URL Link <abbr style={{ color: "red" }}>*</abbr></label>
                      <input type="text" className="form-control" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/assets/images/product/..." required />
                    </div>

                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>SKU (optional)</label>
                      <input type="text" className="form-control" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-..." />
                    </div>

                    <div className="col-md-6 col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Brand (optional)</label>
                      <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Learts" />
                    </div>

                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: "600" }}>Description (optional)</label>
                      <textarea className="form-control" rows={3} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: "1px solid #eee" }}>
                  <button type="button" className="btn btn-light" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-dark">
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
