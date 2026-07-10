import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../store/cartStore";

export function useProductDetails(productId: string | undefined) {
  const idToFetch = productId || "1";

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productsList = await apiService.getProducts();
        const found = productsList.find((p) => p.id === idToFetch);

        if (found) {
          setProduct(found);
          setActiveImage(found.image);
          setQuantity(1); // Reset qty on product change

          // Get 4 related products
          const related = productsList
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 4);

          if (related.length === 0) {
            setRelatedProducts(productsList.filter((p) => p.id !== found.id).slice(0, 4));
          } else {
            setRelatedProducts(related);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [idToFetch]);

  const handleMinus = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handlePlus = () => {
    if (product) {
      setQuantity((prev) => Math.min(product.stock, prev + 1));
    }
  };

  const handleInputChange = (valStr: string) => {
    if (!product) return;
    const val = parseInt(valStr, 10);
    if (!isNaN(val)) {
      setQuantity(Math.min(product.stock, Math.max(1, val)));
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
      showToast(product, quantity);
    }
  };

  const handleQuickView = (prod: Product) => {
    setSelectedProduct(prod);
  };

  const handleQuickViewAddToCart = (prod: Product, q: number) => {
    addItem(prod, q);
    showToast(prod, q);
  };

  const showToast = (prod: Product, q: number) => {
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap: 10px;">
        <img src="${prod.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
        <div>
          <h6 style="margin: 0; font-size: 14px; font-weight: 600;">Added to Cart</h6>
          <span style="font-size: 12px; color: #777;">${prod.title} (x${q})</span>
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
    product,
    relatedProducts,
    loading,
    activeImage,
    quantity,
    selectedProduct,
    setActiveImage,
    handleMinus,
    handlePlus,
    handleInputChange,
    handleAddToCart,
    handleQuickView,
    handleQuickViewAddToCart,
  };
}
