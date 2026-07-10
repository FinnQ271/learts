import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import type { Category } from "../services/apiService";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../store/cartStore";

export function useHomeData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);

        const productsData = await apiService.getProducts();
        const featured = productsData.filter((p) => p.isFeatured === true);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Failed to load home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);

    // Show visual toast feedback
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap: 10px;">
        <img src="${product.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
        <div>
          <h6 style="margin: 0; font-size: 14px; font-weight: 600;">Added to Cart</h6>
          <span style="font-size: 12px; color: #777;">${product.title} (x${quantity})</span>
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
      borderLeft: "4px solid #a87057",
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return {
    categories,
    featuredProducts,
    loading,
    selectedProduct,
    handleQuickView,
    handleAddToCart,
  };
}
