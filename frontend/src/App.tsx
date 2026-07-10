import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminGuard from "./components/AdminGuard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Page404Page from "./pages/Page404Page";
import AboutUs2Page from "./pages/AboutUs2Page";
import AboutUsPage from "./pages/AboutUsPage";
import BlogDetailsFullwidthPage from "./pages/BlogDetailsFullwidthPage";
import BlogDetailsLeftSidebarPage from "./pages/BlogDetailsLeftSidebarPage";
import BlogDetailsRightSidebarPage from "./pages/BlogDetailsRightSidebarPage";
import BlogFullwidthPage from "./pages/BlogFullwidthPage";
import BlogGridFullwidthPage from "./pages/BlogGridFullwidthPage";
import BlogGridLeftSidebarPage from "./pages/BlogGridLeftSidebarPage";
import BlogGridRightSidebarPage from "./pages/BlogGridRightSidebarPage";
import BlogLeftSidebarPage from "./pages/BlogLeftSidebarPage";
import BlogListFullwidthPage from "./pages/BlogListFullwidthPage";
import BlogListLeftSidebarPage from "./pages/BlogListLeftSidebarPage";
import BlogListRightSidebarPage from "./pages/BlogListRightSidebarPage";
import BlogMasonryFullwidthPage from "./pages/BlogMasonryFullwidthPage";
import BlogMasonryLeftSidebarPage from "./pages/BlogMasonryLeftSidebarPage";
import BlogMasonryRightSidebarPage from "./pages/BlogMasonryRightSidebarPage";
import BlogRightSidebarPage from "./pages/BlogRightSidebarPage";
import CheckoutPage from "./pages/CheckoutPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import ContactUsPage from "./pages/ContactUsPage";
import ElementsBrandsPage from "./pages/ElementsBrandsPage";
import ElementsButtonsPage from "./pages/ElementsButtonsPage";
import ElementsCategoryBannerPage from "./pages/ElementsCategoryBannerPage";
import ElementsFaqPage from "./pages/ElementsFaqPage";
import ElementsIconBoxPage from "./pages/ElementsIconBoxPage";
import ElementsInstagramPage from "./pages/ElementsInstagramPage";
import ElementsMapPage from "./pages/ElementsMapPage";
import ElementsProductSaleBannerPage from "./pages/ElementsProductSaleBannerPage";
import ElementsProductsTabsPage from "./pages/ElementsProductsTabsPage";
import ElementsProductsPage from "./pages/ElementsProductsPage";
import ElementsTeamPage from "./pages/ElementsTeamPage";
import ElementsTestimonialsPage from "./pages/ElementsTestimonialsPage";
import Index10Page from "./pages/Index10Page";
import Index11Page from "./pages/Index11Page";
import Index3Page from "./pages/Index3Page";
import Index4Page from "./pages/Index4Page";
import Index5Page from "./pages/Index5Page";
import Index6Page from "./pages/Index6Page";
import Index7Page from "./pages/Index7Page";
import Index8Page from "./pages/Index8Page";
import Index9Page from "./pages/Index9Page";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import LostPasswordPage from "./pages/LostPasswordPage";
import MyAccountPage from "./pages/MyAccountPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import Portfolio3ColumnsPage from "./pages/Portfolio3ColumnsPage";
import Portfolio4ColumnsPage from "./pages/Portfolio4ColumnsPage";
import Portfolio5ColumnsPage from "./pages/Portfolio5ColumnsPage";
import PortfolioDetailsPage from "./pages/PortfolioDetailsPage";
import ProductDetails360Page from "./pages/ProductDetails360Page";
import ProductDetailsBackgroundPage from "./pages/ProductDetailsBackgroundPage";
import ProductDetailsExtraContentPage from "./pages/ProductDetailsExtraContentPage";
import ProductDetailsFullwidthPage from "./pages/ProductDetailsFullwidthPage";
import ProductDetailsGroupPage from "./pages/ProductDetailsGroupPage";
import ProductDetailsImageVariationPage from "./pages/ProductDetailsImageVariationPage";
import ProductDetailsSidebarPage from "./pages/ProductDetailsSidebarPage";
import ProductDetailsStickyPage from "./pages/ProductDetailsStickyPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShopFullwidthLeftSidebarPage from "./pages/ShopFullwidthLeftSidebarPage";
import ShopFullwidthNoGuttersPage from "./pages/ShopFullwidthNoGuttersPage";
import ShopFullwidthRightSidebarPage from "./pages/ShopFullwidthRightSidebarPage";
import ShopFullwidthPage from "./pages/ShopFullwidthPage";
import ShopLeftSidebarPage from "./pages/ShopLeftSidebarPage";
import ShopRightSidebarPage from "./pages/ShopRightSidebarPage";
import ShopPage from "./pages/ShopPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import WishlistPage from "./pages/WishlistPage";

const routes: Record<string, React.ComponentType> = {
  "/": Home,
  "/404": Page404Page,
  "/about-us-2": AboutUs2Page,
  "/about-us": AboutUsPage,
  "/blog-details-fullwidth": BlogDetailsFullwidthPage,
  "/blog-details-left-sidebar": BlogDetailsLeftSidebarPage,
  "/blog-details-right-sidebar": BlogDetailsRightSidebarPage,
  "/blog-fullwidth": BlogFullwidthPage,
  "/blog-grid-fullwidth": BlogGridFullwidthPage,
  "/blog-grid-left-sidebar": BlogGridLeftSidebarPage,
  "/blog-grid-right-sidebar": BlogGridRightSidebarPage,
  "/blog-left-sidebar": BlogLeftSidebarPage,
  "/blog-list-fullwidth": BlogListFullwidthPage,
  "/blog-list-left-sidebar": BlogListLeftSidebarPage,
  "/blog-list-right-sidebar": BlogListRightSidebarPage,
  "/blog-masonry-fullwidth": BlogMasonryFullwidthPage,
  "/blog-masonry-left-sidebar": BlogMasonryLeftSidebarPage,
  "/blog-masonry-right-sidebar": BlogMasonryRightSidebarPage,
  "/blog-right-sidebar": BlogRightSidebarPage,
  "/checkout": CheckoutPage,
  "/coming-soon": ComingSoonPage,
  "/contact-us": ContactUsPage,
  "/elements-brands": ElementsBrandsPage,
  "/elements-buttons": ElementsButtonsPage,
  "/elements-category-banner": ElementsCategoryBannerPage,
  "/elements-faq": ElementsFaqPage,
  "/elements-icon-box": ElementsIconBoxPage,
  "/elements-instagram": ElementsInstagramPage,
  "/elements-map": ElementsMapPage,
  "/elements-product-sale-banner": ElementsProductSaleBannerPage,
  "/elements-products-tabs": ElementsProductsTabsPage,
  "/elements-products": ElementsProductsPage,
  "/elements-team": ElementsTeamPage,
  "/elements-testimonials": ElementsTestimonialsPage,
  "/index-10": Index10Page,
  "/index-11": Index11Page,
  "/index-2": Home,
  "/index-3": Index3Page,
  "/index-4": Index4Page,
  "/index-5": Index5Page,
  "/index-6": Index6Page,
  "/index-7": Index7Page,
  "/index-8": Index8Page,
  "/index-9": Index9Page,
  "/index": Home,
  "/login-register": LoginRegisterPage,
  "/lost-password": LostPasswordPage,
  "/my-account": MyAccountPage,
  "/order-tracking": OrderTrackingPage,
  "/portfolio-3-columns": Portfolio3ColumnsPage,
  "/portfolio-4-columns": Portfolio4ColumnsPage,
  "/portfolio-5-columns": Portfolio5ColumnsPage,
  "/portfolio-details": PortfolioDetailsPage,
  "/product-details-360": ProductDetails360Page,
  "/product-details-background": ProductDetailsBackgroundPage,
  "/product-details-extra-content": ProductDetailsExtraContentPage,
  "/product-details-fullwidth": ProductDetailsFullwidthPage,
  "/product-details-group": ProductDetailsGroupPage,
  "/product-details-image-variation": ProductDetailsImageVariationPage,
  "/product-details-sidebar": ProductDetailsSidebarPage,
  "/product-details-sticky": ProductDetailsStickyPage,
  "/product-details": ProductDetailsPage,
  "/shop-fullwidth-left-sidebar": ShopFullwidthLeftSidebarPage,
  "/shop-fullwidth-no-gutters": ShopFullwidthNoGuttersPage,
  "/shop-fullwidth-right-sidebar": ShopFullwidthRightSidebarPage,
  "/shop-fullwidth": ShopFullwidthPage,
  "/shop-left-sidebar": ShopLeftSidebarPage,
  "/shop-right-sidebar": ShopRightSidebarPage,
  "/shop": ShopPage,
  "/shopping-cart": ShoppingCartPage,
  "/wishlist": WishlistPage,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {Object.entries(routes).map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        {/* Admin Dashboard Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
        <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
        {/* Dynamic Route for Product Detail */}
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        {/* 404 Route */}
        <Route path="*" element={<Page404Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
