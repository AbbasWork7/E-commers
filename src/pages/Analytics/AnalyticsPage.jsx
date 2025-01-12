import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FaDownload,
  FaCalendar,
  FaChartLine,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";

// Sample data - Replace with actual API data
const revenueData = [
  { month: "Jan", revenue: 45000, orders: 150 },
  { month: "Feb", revenue: 52000, orders: 170 },
  { month: "Mar", revenue: 49000, orders: 160 },
  { month: "Apr", revenue: 58000, orders: 190 },
  { month: "May", revenue: 55000, orders: 180 },
  { month: "Jun", revenue: 62000, orders: 200 },
];

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 20 },
  { name: "Books", value: 15 },
  { name: "Others", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("month");

  const stats = {
    totalRevenue: "₹3,21,000",
    totalOrders: 1050,
    avgOrderValue: "₹3,057",
    activeUsers: 824,
    conversionRate: "3.2%",
    returnRate: "2.1%",
  };

  const downloadAnalytics = (format) => {
    // Implementation for downloading analytics in CSV/PDF format
    console.log(`Downloading analytics in ${format} format`);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Analytics</h2>
          <p className="text-muted mb-0">Monitor your store's performance</p>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group">
            <button
              className={`btn ${
                dateRange === "week" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setDateRange("week")}
            >
              Week
            </button>
            <button
              className={`btn ${
                dateRange === "month" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setDateRange("month")}
            >
              Month
            </button>
            <button
              className={`btn ${
                dateRange === "year" ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setDateRange("year")}
            >
              Year
            </button>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <FaDownload className="me-2" />
              Download
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => downloadAnalytics("csv")}
                >
                  CSV
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => downloadAnalytics("pdf")}
                >
                  PDF
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <FaRupeeSign className="text-primary" size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h4 className="mb-0">{stats.totalRevenue}</h4>
                </div>
              </div>
              <div className="text-success small">+8.3% from last month</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <FaShoppingCart className="text-success" size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h4 className="mb-0">{stats.totalOrders}</h4>
                </div>
              </div>
              <div className="text-success small">+12.5% from last month</div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <FaUsers className="text-warning" size={24} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Active Users</h6>
                  <h4 className="mb-0">{stats.activeUsers}</h4>
                </div>
              </div>
              <div className="text-success small">+5.2% from last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        {/* Revenue Chart */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Revenue Overview</h5>
              <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0088FE"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#00C49F"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sales by Category</h5>
              <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Key Metrics</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <h6 className="text-muted">Average Order Value</h6>
                    <h3>{stats.avgOrderValue}</h3>
                    <div className="text-success small">
                      +4.5% from last month
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <h6 className="text-muted">Conversion Rate</h6>
                    <h3>{stats.conversionRate}</h3>
                    <div className="text-success small">
                      +1.2% from last month
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <h6 className="text-muted">Return Rate</h6>
                    <h3>{stats.returnRate}</h3>
                    <div className="text-danger small">
                      +0.3% from last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
