import React from "react";
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

  const salesData = [
    { date: "Mon", sales: 2400, orders: 24 },
    { date: "Tue", sales: 1398, orders: 13 },
    { date: "Wed", sales: 9800, orders: 98 },
    { date: "Thu", sales: 3908, orders: 39 },
    { date: "Fri", sales: 4800, orders: 48 },
    { date: "Sat", sales: 3800, orders: 38 },
    { date: "Sun", sales: 4300, orders: 43 },
  ];

  const topProducts = [
    { name: "Product A", sales: 45 },
    { name: "Product B", sales: 38 },
    { name: "Product C", sales: 31 },
    { name: "Product D", sales: 25 },
    { name: "Product E", sales: 19 },
  ];

  const stats = {
    totalSales: "₹27,406",
    totalOrders: 303,
    avgOrderValue: "₹90.45",
    conversionRate: "3.2%",
    pendingOrders: 12,
    returnRate: "2.1%",
  };

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
          <button className="btn btn-outline-secondary">Today</button>
          <button className="btn btn-outline-secondary active">Week</button>
          <button className="btn btn-outline-secondary">Month</button>
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
              <p className="text-success mb-0">↑ 2.4% vs last week</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted mb-3">Conversion Rate</h5>
              <h2 className="card-text mb-2">{stats.conversionRate}</h2>
              <p className="text-danger mb-0">↓ 0.3% vs last week</p>
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
                    <YAxis />
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
                    <tr>
                      <td>#18063027</td>
                      <td>John Doe</td>
                      <td>
                        <span className="badge bg-success">Delivered</span>
                      </td>
                      <td>₹99</td>
                    </tr>
                    <tr>
                      <td>#18063026</td>
                      <td>Jane Smith</td>
                      <td>
                        <span className="badge bg-warning">Pending</span>
                      </td>
                      <td>₹149</td>
                    </tr>
                    <tr>
                      <td>#18063025</td>
                      <td>Mike Johnson</td>
                      <td>
                        <span className="badge bg-info">Shipped</span>
                      </td>
                      <td>₹299</td>
                    </tr>
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

export default DashboardPage;
