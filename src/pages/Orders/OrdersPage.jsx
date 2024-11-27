// src/pages/Orders/OrdersPage.jsx
import React, { useState } from "react";
import OrderTabs from "./components/OrderTabs";
import OrdersTable from "./components/OrdersTable";
import useOrders from "./hooks/useOrders";

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { orders, isLoading, error } = useOrders();
  const [selectedColumns, setSelectedColumns] = useState({
    "Order ID": true,
    Date: true,
    Customer: true,
    Items: true,
    Payment: true,
    Status: true,
    Amount: true,
  });

  // Calculate tab counts
  const tabCounts = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "Pending").length,
    accepted: orders.filter((order) => order.status === "Accepted").length,
    shipped: orders.filter((order) => order.status === "Shipped").length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
    others: orders.filter(
      (order) =>
        !["Pending", "Accepted", "Shipped", "Delivered"].includes(order.status)
    ).length,
  };

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">All Orders</h5>
          <span className="text-muted ms-2 small">lifetime</span>
        </div>
        <button className="btn btn-link text-dark text-decoration-none">
          <span className="me-2">?</span>
          Help
        </button>
      </div>

      {/* Order Tabs */}
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCounts={tabCounts}
      />

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          selectedColumns={selectedColumns}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default OrdersPage;
