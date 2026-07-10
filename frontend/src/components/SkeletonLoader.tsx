import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="product" style={{ opacity: 0.85 }}>
      <div
        className="product-thumb"
        style={{
          background: "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          height: "320px",
          borderRadius: "8px",
        }}
      />
      <div className="product-info" style={{ marginTop: "15px" }}>
        <div
          style={{
            height: "14px",
            background: "#eee",
            borderRadius: "4px",
            width: "70%",
            marginBottom: "8px",
          }}
        />
        <div
          style={{
            height: "12px",
            background: "#eee",
            borderRadius: "4px",
            width: "40%",
          }}
        />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div
      className="category-banner2"
      style={{
        background: "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        height: "280px",
        borderRadius: "8px",
        opacity: 0.8,
      }}
    />
  );
}

export default function SkeletonLoader({ type = "product", count = 4 }: { type?: "product" | "category"; count?: number }) {
  const skeletons = Array.from({ length: count });

  // Inject animation keyframes globally
  React.useEffect(() => {
    const styleId = "skeleton-shimmer-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <React.Fragment>
      {skeletons.map((_, index) => (
        <div key={index} className="col">
          {type === "product" ? <ProductCardSkeleton /> : <CategorySkeleton />}
        </div>
      ))}
    </React.Fragment>
  );
}
