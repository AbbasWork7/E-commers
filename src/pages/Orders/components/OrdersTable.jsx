import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "order_date", direction: "desc" });

  useEffect(() => {
    axios
      .get("http://localhost:5004/api/v3/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => console.error("Error fetching orders:", error.message));
  }, []);

  const filterOrdersByStatus = (data) => {
    if (activeTab === "all") return data;
    return data.filter((order) => order.status.toLowerCase() === activeTab.toLowerCase());
  };

  const sortData = (data, sortKey, direction) => {
    return [...data].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "order_date") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <FaSort className="ms-1 text-muted" />;
    return sortConfig.direction === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  const tabCounts = useMemo(() => {
    const counts = orders.reduce(
      (acc, order) => {
        acc.all++;
        acc[order.status.toLowerCase()] = (acc[order.status.toLowerCase()] || 0) + 1;
        return acc;
      },
      { all: 0 }
    );
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => filterOrdersByStatus(orders), [orders, activeTab]);
  const sortedOrders = useMemo(
    () => sortData(filteredOrders, sortConfig.key, sortConfig.direction),
    [filteredOrders, sortConfig]
  );

  return (
    <div>
      <div className="d-flex mb-3">
        {["all", "pending", "accepted", "shipped", "delivered", "others"].map((tab) => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? "btn-dark" : "btn-light"} me-2`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCounts[tab] || 0})
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr className="bg-light">
              {['Order ID', 'Date', 'Customer', 'Items', 'Payment', 'Status'].map((col) => (
                <th key={col} onClick={() => handleSort(col.toLowerCase().replace(' ', '_'))}>
                  {col} {getSortIcon(col.toLowerCase().replace(' ', '_'))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <tr
  key={order.order_id}
  onClick={() => {
    console.log("Navigating to order:", order.order_id); // Debugging log
    navigate(`/orders/${String(order.order_id).replace("#", "")}`);
  }}
  style={{ cursor: "pointer" }}
>



                  <td>{order.order_id}</td>
                  <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A"}</td>
                  <td>{order.customer_name || "Unknown"}</td>
                  <td>{order.items ?? 0}</td>
                  <td>{order.payment_method || "cd"}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'pending' ? 'warning' : order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'secondary'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
