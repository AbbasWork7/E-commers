import React, { useState, useEffect } from "react";
import {
  FaSearch, FaBell, FaEllipsisV, FaDownload, FaCalendarAlt
} from "react-icons/fa";
import "../Audience/Audience.css";  // External CSS

const AudienceManagement = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5004/api/customers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched customers:", data); // Debug
        setCustomers(data);
      })
      .catch((err) => console.error("Failed to fetch customers", err));
  }, []);

  const handleAddCustomer = () => {
    const newCustomer = {
      name: "New Customer",
      mobile: "+91-9000000000",
      email: "new@example.com",
      city: "New City",
      totalOrders: 0,
    };
    setCustomers([...customers, newCustomer]);
    setShowAddCustomerModal(false);
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const search = searchQuery.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(search)) ||
      (customer.email && customer.email.toLowerCase().includes(search)) ||
      (customer.mobile && customer.mobile.toLowerCase().includes(search)) ||
      (customer.city && customer.city.toLowerCase().includes(search))
    );
  });

  return (
    <div className="audience-container">
      {/* Header Section */}
      <div className="audience-header">
        <h1 className="audience-title">Audience</h1>
        <div className="search-bar-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="icon-group">
            <FaBell />
            <FaEllipsisV />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="primary" onClick={() => setShowAddCustomerModal(true)}>Add Customer</button>
        <button className="primary" onClick={() => setShowImportModal(true)}>Import</button>
        <button className="primary"><FaDownload /> Export</button>
        <button className="primary"><FaCalendarAlt /> Lifetime</button>
      </div>

      {/* Customer Table */}
      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>City</th>
              <th>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.email}</td>
                  <td>{customer.city}</td>
                  <td>{customer.totalOrders}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No matching customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Customer</h2>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="tel" placeholder="Mobile" />
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowAddCustomerModal(false)}>Cancel</button>
              <button className="confirm" onClick={handleAddCustomer}>Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Import Customers</h2>
            <p>Upload an Excel file to import customers.</p>
            <button>Choose File</button>
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowImportModal(false)}>Cancel</button>
              <button className="confirm">Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceManagement;
