import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { jsPDF } from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
  const [analytics, setAnalytics] = useState({
    totalRevenue: null,
    totalOrders: null,
    avgOrderValue: null, // Add this
  });
  const [revenueData, setRevenueData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/analytics?dateRange=${dateRange}`)
      .then((response) => {
        console.log("API Response:", response.data);

        const totalRevenue = response.data.totalRevenue || 0;
        const totalOrders = response.data.totalOrders || 1; // Avoid division by zero
        const avgOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

        // **Retrieve previous period values**
        const prevTotalRevenue = response.data.prevTotalRevenue || 0;
        const prevTotalOrders = response.data.prevTotalOrders || 1;
        const prevAvgOrderValue = prevTotalOrders > 0 ? Number((prevTotalRevenue / prevTotalOrders).toFixed(2)) : 0;

        // **Calculate Percentage Change**
        const revenueChange = prevTotalRevenue 
          ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(2) 
          : 0;

        const ordersChange = prevTotalOrders 
          ? (((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(2) 
          : 0;

        const avgOrderChange = prevAvgOrderValue 
          ? (((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100).toFixed(2) 
          : 0;

        setAnalytics({
          totalRevenue: `₹${Number(totalRevenue).toLocaleString()}`,
          totalOrders: totalOrders,
          avgOrderValue: `₹${Number(avgOrderValue).toLocaleString()}`,
          revenueChange: response.data.revenueChange + "%",  // ✅ Use API value
          ordersChange: response.data.ordersChange + "%",    // ✅ Use API value
          avgOrderChange,
        });

        // Ensure all months are present in the data
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Create a map from API response for easy lookup
        const revenueMap = new Map(response.data.revenueOverview?.map(item => [item.month, item]));

        // Fill missing months with zero revenue/orders
        const completeRevenueData = allMonths.map(month =>
          revenueMap.get(month) || { month, revenue: 0, orders: 0 }
        );

        setRevenueData(completeRevenueData);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
        setAnalytics({
          totalRevenue: "₹0",
          totalOrders: 0,
          avgOrderValue: "₹0",
          revenueChange: 0,
          ordersChange: 0,
          avgOrderChange: 0,
        });
        setRevenueData([]);
      });
  }, [dateRange]);




  const stats = {
    activeUsers: 824,
    conversionRate: "3.2%",
    returnRate: "2.1%",
  };



  const downloadAnalytics = (format) => {
    if (format === "pdf") {
      console.log("Downloading PDF...");
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Analytics Report", 20, 20);

      // Revenue and Orders
      doc.setFontSize(14);
      doc.text(`Total Revenue: ${analytics.totalRevenue}`, 20, 40);
      doc.text(`Total Orders: ${analytics.totalOrders}`, 20, 50);
      doc.text(`Average Order Value: ${analytics.avgOrderValue}`, 20, 60);

      // Additional Metrics
      doc.text(`Active Users: ${stats.activeUsers}`, 20, 80);
      doc.text(`Conversion Rate: ${stats.conversionRate}`, 20, 90);
      doc.text(`Return Rate: ${stats.returnRate}`, 20, 100);

      // Save the PDF
      doc.save("analytics.pdf");
    }
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
            <button className={`btn ${dateRange === "week" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setDateRange("week")}>
              Week
            </button>
            <button className={`btn ${dateRange === "month" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setDateRange("month")}>
              Month
            </button>
            <button className={`btn ${dateRange === "year" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setDateRange("year")}>
              Year
            </button>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaDownload className="me-2" />
              Download
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => downloadAnalytics("pdf")}>
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
                  <h4 className="mb-0">{analytics.totalRevenue || "Loading..."}</h4>
                </div>
              </div>
              <div className="text-success small">
                {analytics.revenueChange >= 0 ? "+" : ""}
                {analytics.revenueChange}% from last {dateRange}
              </div>
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
                  <h4 className="mb-0">{analytics.totalOrders !== null ? analytics.totalOrders : "Loading..."}</h4>
                </div>
              </div>
              <div className="text-success small">
                {analytics.ordersChange >= 0 ? "+" : ""}
                {analytics.ordersChange}% from last {dateRange}
              </div>
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
                    <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#00C49F" strokeWidth={2} />
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
                    <h3>{analytics.avgOrderValue || "Loading..."}</h3>
                    <div className="text-success small">
                      {analytics.avgOrderChange >= 0 ? "+" : ""}
                      {analytics.avgOrderChange}% from last {dateRange}
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