import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../store/cartStore";

export function useShopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);

        // Check for category filter in query string
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get("category");
        if (catParam) {
          setSelectedCategory(catParam);
        }
      } catch (error) {
        console.error("Failed to load shop products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoriesList = [
    "All",
    "Gift ideas",
    "Home Decor",
    "Kids & Babies",
    "Kitchen",
    "Kniting & Sewing",
    "Pots",
    "Toys",
  ];

  const getCategoryCount = (catName: string) => {
    if (catName === "All") return products.length;
    return products.filter((p) => p.category === catName).length;
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "All") return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    setVisibleCount(8); // Reset page count on filter change
  };

  const handleSortChange = (sortByValue: string) => {
    setSortBy(sortByValue);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);

    // Dynamic Toast
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
    products,
    loading,
    selectedCategory,
    sortBy,
    visibleCount,
    selectedProduct,
    displayedProducts,
    categoriesList,
    totalCount: sortedProducts.length,
    getCategoryCount,
    handleCategoryClick,
    handleSortChange,
    handleLoadMore,
    handleQuickView,
    handleAddToCart,
  };
}
