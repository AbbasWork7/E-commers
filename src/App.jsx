import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import OrderDetails from "./pages/Orders/OrderDetails";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProductsPage from "./pages/Products/ProductsPage";
import AddEditProduct from "./pages/Products/AddEditProduct";
import ThemesPage from "./pages/Appearance/ThemesPage";
import CustomizeThemePage from "./pages/Appearance/CustomizeThemePage";
import DeliveryPage from "./pages/Delivery/DeliveryPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import AudiencePage from "./pages/Audience/AudiencePage";
// import SettingsPage from "./pages/Settings/SettingsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="orders">
            <Route index element={<OrdersPage />} />
            <Route path=":orderId" element={<OrderDetails />} />
          </Route>

          <Route path="products">
            <Route index element={<ProductsPage />} />
            <Route path="new" element={<AddEditProduct />} />
            <Route path=":productId/edit" element={<AddEditProduct />} />
          </Route>

          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="audience" element={<AudiencePage />} /> 

          <Route path="appearance">
            <Route path="themes" element={<ThemesPage />} />
            <Route
              path="themes/customize/:themeId"
              element={<CustomizeThemePage />}
            />
          </Route>

          {/* <Route path="settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
