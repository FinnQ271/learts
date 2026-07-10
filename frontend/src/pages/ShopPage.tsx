import { useEffect } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import SkeletonLoader from "../components/SkeletonLoader";
import { useShopProducts } from "../hooks/useShopProducts";

export default function ShopPage() {
  const {
    loading,
    selectedCategory,
    sortBy,
    visibleCount,
    selectedProduct,
    displayedProducts,
    categoriesList,
    totalCount,
    getCategoryCount,
    handleCategoryClick,
    handleSortChange,
    handleLoadMore,
    handleQuickView,
    handleAddToCart,
  } = useShopProducts();

  // Sync jQuery plugins / template scripts after render
  useEffect(() => {
    if (!loading) {
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
    }
  }, [loading, selectedCategory, sortBy, visibleCount]);

  return (
    <Layout>

      {/* Breadcrumb section */}
      <div className="page-title-section section" style={{ backgroundImage: "url(/assets/images/bg/page-title-1.webp)" }}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title">Shop</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-padding pt-0">
        {/* Shop Toolbar Start */}
        <div className="shop-toolbar border-bottom">
          <div className="container">
            <div className="row learts-mb-n20 align-items-center">

              {/* Category Filter Pills (Horizontal filter helper) */}
              <div className="col-md col-12 align-self-center learts-mb-20">
                <div className="isotope-filter shop-product-filter" style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                  {["All", "Toys", "Kitchen", "Pots", "Home Decor"].map((cat) => (
                    <button
                      key={cat}
                      className={selectedCategory === cat ? "active" : ""}
                      style={{
                        background: "none",
                        border: "none",
                        fontWeight: selectedCategory === cat ? "700" : "400",
                        color: selectedCategory === cat ? "#a87057" : "#666",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        padding: "5px 0"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(cat);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting and controls */}
              <div className="col-md-auto col-12 learts-mb-20">
                <ul className="shop-toolbar-controls" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <li>
                    <div className="product-sorting">
                      <select
                        className="nice-select"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        style={{ padding: "8px 15px", borderRadius: "4px", borderColor: "#ddd", fontSize: "14px" }}
                      >
                        <option value="default">Default sorting</option>
                        <option value="price-asc">Sort by price: low to high</option>
                        <option value="price-desc">Sort by price: high to low</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <a className="product-filter-toggle" href="#product-filter">Filters</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Shop Toolbar End */}

        {/* Categories Sidebar Filter Widget dropdown */}
        <div className="product-filter bg-light" id="product-filter">
          <div className="container">
            <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1 learts-mb-n30">

              {/* Categories list widget */}
              <div className="col learts-mb-30">
                <h3 className="widget-title product-filter-widget-title">Categories</h3>
                <ul className="widget-list product-filter-widget customScroll">
                  {categoriesList.map((catName) => (
                    <li key={catName}>
                      <a
                        href="#"
                        className={selectedCategory === catName ? "active" : ""}
                        style={{ color: selectedCategory === catName ? "#a87057" : "", fontWeight: selectedCategory === catName ? "600" : "" }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryClick(catName);
                        }}
                      >
                        {catName}
                      </a>{" "}
                      <span className="count">({getCategoryCount(catName)})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sort by widget duplicates */}
              <div className="col learts-mb-30">
                <h3 className="widget-title product-filter-widget-title">Sort by</h3>
                <ul className="widget-list product-filter-widget customScroll">
                  <li><a href="#" className={sortBy === "default" ? "active" : ""} onClick={(e) => { e.preventDefault(); handleSortChange("default"); }}>Default</a></li>
                  <li><a href="#" className={sortBy === "price-asc" ? "active" : ""} onClick={(e) => { e.preventDefault(); handleSortChange("price-asc"); }}>Price: low to high</a></li>
                  <li><a href="#" className={sortBy === "price-desc" ? "active" : ""} onClick={(e) => { e.preventDefault(); handleSortChange("price-desc"); }}>Price: high to low</a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Product Grid section */}
        <div className="section learts-mt-70">
          <div className="container">
            <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-4">
              {loading ? (
                <SkeletonLoader type="product" count={8} />
              ) : displayedProducts.length === 0 ? (
                <div className="col-12 text-center" style={{ padding: "50px 0" }}>
                  <h3>No products found in this category.</h3>
                </div>
              ) : (
                displayedProducts.map((product) => (
                  <div key={product.id} className="col">
                    <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
                ))
              )}
            </div>

            {/* Load More Pagination */}
            {!loading && totalCount > visibleCount && (
              <div className="text-center learts-mt-70">
                <a className="btn btn-dark btn-outline-hover-dark" href="#" onClick={(e) => { e.preventDefault(); handleLoadMore(); }}>
                  <i className="ti-plus"></i> More
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      <QuickViewModal product={selectedProduct} onAddToCart={handleAddToCart} />
    </Layout>
  );
}
