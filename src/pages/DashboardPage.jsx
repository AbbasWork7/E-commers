import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSales: "Loading...",
    totalOrders: 0,
    avgOrderValue: "Loading...",
    conversionRate: "Loading...",
  });
  const [selectedPeriod, setSelectedPeriod] = useState("week"); // Default to "week"

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchDashboardData = (period) => {
    // Fetch recent orders
    fetch(`http://localhost:5004/api/recent-orders?period=${period}`)
      .then((response) => response.json())
      .then((data) => setRecentOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));

      fetch(`http://localhost:5004/api/dashboard-metrics?period=${period}`)
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching metrics:", error));
  
    fetch(`http://localhost:5004/api/sales-data?period=${period}`)
      .then((response) => response.json())
      .then((data) => {
        const completeData = fillMissingDates(data);
        setSalesData(completeData);
      })
      .catch((error) => console.error("Error fetching sales data:", error));
  };

  const fillMissingDates = (data) => {
    const lastDays = selectedPeriod === "month" ? 30 : 7;
    const lastXDays = [];
    for (let i = lastDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];

      const existingData = data.find((item) => item.date === formattedDate);
      lastXDays.push(existingData || { date: formattedDate, sales: 0 });
    }
    return lastXDays;
  };

  const topProducts = [
    { name: "Product A", sales: 45 },
    { name: "Product B", sales: 38 },
    { name: "Product C", sales: 31 },
    { name: "Product D", sales: 25 },
    { name: "Product E", sales: 19 },
  ];

  const quickActions = [
    { text: "Create New Order", path: "/orders/new" },
    { text: "Add New Product", path: "/products/new" },
    { text: "View Orders", path: "/orders" },
    { text: "Customize Theme", path: "/appearance/themes" },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <div className="btn-group">
          {["today", "week", "month"].map((period) => (
            <button
              key={period}
              className={`btn btn-outline-secondary ${selectedPeriod === period ? "active" : ""}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted mb-3">Total Sales</h5>
              <h2 className="card-text mb-2">{stats.totalSales}</h2>
              <p className="text-muted mb-0">{stats.totalOrders} orders</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted mb-3">Avg. Order Value</h5>
              <h2 className="card-text mb-2">{stats.avgOrderValue}</h2>
              <p className="text-success mb-0">↑ 2.4% vs last {selectedPeriod}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted mb-3">Conversion Rate</h5>
              <h2 className="card-text mb-2">{stats.conversionRate}</h2>
              <p className="text-danger mb-0">↓ 0.3% vs last {selectedPeriod}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sales Overview</h5>
              <div className="mt-4" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                    ticks={selectedPeriod === "month" ? [0, 20000, 40000, 60000, 80000] : [0, 25000, 50000, 75000, 100000]}
                    tickFormatter={(value) => `₹${value}`}
                    domain={[0, 'auto']}
                    />


                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#343a40" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Top Products</h5>
              <div className="mt-4" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#343a40" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Recent Orders</h5>
              <div className="table-responsive mt-3">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.order_id}>
                          <td>{order.order_id}</td>
                          <td>{order.customer_name}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>₹{order.grand_total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No recent orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2 mt-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={
                      index === 0
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                    onClick={() => navigate(action.path)}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending": return "warning";
    case "completed": return "success";
    case "cancelled": return "danger";
    default: return "secondary";
  }
};

export default DashboardPage;
