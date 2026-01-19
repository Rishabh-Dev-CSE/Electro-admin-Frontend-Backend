import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

import PrivateRoute from "./pages/auth/PrivateRoute";
import EcomAdminPanel from "./admin_dashbord/panel_design/AdminPanelRoute";

// Admin Pages
import Dashboard from "./admin_dashbord/dashboard/Dashboard";
import Products from "./admin_dashbord/products/Products";
import AddProduct from "./admin_dashbord/products/AddProduct";
import OrdersLayout from "./admin_dashbord/orders/Orders"

import Categories from "./admin_dashbord/products/AddCategory";
import Reports from "./admin_dashbord/reports/Reports";
import Reviews from "./admin_dashbord/reviews/Reviews";

// Settings
import SettingsLayout from "./admin_dashbord/Settings/Settings";
import GeneralSettings from "./admin_dashbord/settings/GeneralSettings";
import PaymentGateway from "./admin_dashbord/settings/PaymentGeteway";
import ShippingSettings from "./admin_dashbord/settings/ShippingSettings";
import TaxSettings from "./admin_dashbord/settings/TexSettings";
import OrderSettings from "./admin_dashbord/settings/OrderSettings";
import NotificationSettings from "./admin_dashbord/settings/NotificationSettings";
import SecuritySettings from "./admin_dashbord/settings/SecuritySettings";
import RoleSettings from "./admin_dashbord/settings/RoleSettings";
import Users from "./admin_dashbord/Users/Users";
import NotFound from "./module/error/error_404";

//orders
import OrderList from "./admin_dashbord/orders/OrderList";
import ReadyToShip from "./admin_dashbord/orders/ReadyToShip";
import Delivered from "./admin_dashbord/orders/Delivered";
import Cancelled from "./admin_dashbord/orders/Cancelled";
import Shipped from "./admin_dashbord/orders/Shipped";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* ================= ADMIN PROTECTED ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <EcomAdminPanel />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* {Users} */}
          <Route path="/admin/users/list" element={<Users />} />

          {/* {category} */}
          <Route path="categories/add" element={<Categories />} />

          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />

          {/* Orders */}
          {/* ================= ORDERS (NESTED LIKE SETTINGS) ================= */}
          <Route path="orders" element={<OrdersLayout />}>
            <Route index element={<Navigate to="pending" replace />} />
            <Route path="pending" element={<OrderList />} />
            <Route path="ready-to-ship" element={<ReadyToShip/>} />
            <Route path="shipped" element={<Shipped/>} />
            <Route path="delivered" element={<Delivered />} />
            <Route path="cancelled" element={<Cancelled />} />
          </Route>

          {/* Reports & Reviews */}
          <Route path="reports" element={<Reports />} />
          <Route path="reviews" element={<Reviews />} />

          {/* ================= SETTINGS (NESTED MODULE) ================= */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<GeneralSettings />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="payment" element={<PaymentGateway />} />
            <Route path="shipping" element={<ShippingSettings />} />
            <Route path="tax" element={<TaxSettings />} />
            <Route path="orders" element={<OrderSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="security" element={<SecuritySettings />} />
            <Route path="roles" element={<RoleSettings />} />
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
