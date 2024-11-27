// src/pages/Orders/components/OrdersTable.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const OrdersTable = ({ orders, selectedColumns }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Sorting function
  const sortData = (data, sortKey, direction) => {
    return [...data].sort((a, b) => {
      // Handle numeric values (amount, items)
      if (sortKey === "amount") {
        const aValue = parseFloat(a[sortKey].replace("₹", ""));
        const bValue = parseFloat(b[sortKey].replace("₹", ""));
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortKey === "items") {
        return direction === "asc"
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      }

      // Handle string values
      const aValue = String(a[sortKey]).toLowerCase();
      const bValue = String(b[sortKey]).toLowerCase();

      if (direction === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="ms-1 text-muted" />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );
  };

  const sortedOrders = sortData(orders, sortConfig.key, sortConfig.direction);

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr className="bg-light">
            {selectedColumns["Order ID"] && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("orderId")}
              >
                Order ID {getSortIcon("orderId")}
              </th>
            )}
            {selectedColumns.Date && (
              <th className="cursor-pointer" onClick={() => handleSort("date")}>
                Date {getSortIcon("date")}
              </th>
            )}
            {selectedColumns.Customer && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("customer")}
              >
                Customer {getSortIcon("customer")}
              </th>
            )}
            {selectedColumns.Items && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("items")}
              >
                Items {getSortIcon("items")}
              </th>
            )}
            {selectedColumns.Payment && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("payment")}
              >
                Payment {getSortIcon("payment")}
              </th>
            )}
            {selectedColumns.Status && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {getSortIcon("status")}
              </th>
            )}
            {selectedColumns.Amount && (
              <th
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount {getSortIcon("amount")}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr
              key={order.orderId}
              onClick={() =>
                navigate(`/orders/${order.orderId.replace("#", "")}`)
              }
              className="cursor-pointer"
            >
              {selectedColumns["Order ID"] && (
                <td className="text-primary">{order.orderId}</td>
              )}
              {selectedColumns.Date && <td>{order.date}</td>}
              {selectedColumns.Customer && <td>{order.customer}</td>}
              {selectedColumns.Items && <td>{order.items}</td>}
              {selectedColumns.Payment && (
                <td>
                  <span className="badge bg-warning-subtle text-warning-emphasis">
                    {order.payment}
                  </span>
                </td>
              )}
              {selectedColumns.Status && (
                <td>
                  <span
                    className={`badge ${
                      order.status === "Accepted"
                        ? "bg-success-subtle text-success-emphasis"
                        : order.status === "Pending"
                        ? "bg-warning-subtle text-warning-emphasis"
                        : "bg-info-subtle text-info-emphasis"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              )}
              {selectedColumns.Amount && <td>{order.amount}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedOrders.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted mb-0">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
