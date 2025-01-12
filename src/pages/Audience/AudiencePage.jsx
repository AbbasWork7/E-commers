import React, { useState } from "react";
import {
  FaSearch,
  FaTimes,
  FaQuestionCircle,
  FaBell,
  FaEllipsisV,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";

const AudienceManagement = () => {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const customers = [
    {
      name: "Dharshan",
      mobile: "+91-9600733080",
      email: "antojoel8020@gmail.com",
      city: "Kamrup",
      totalOrders: 1,
    },
  ];

  const AddCustomerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Customer details</h2>
          <button onClick={() => setShowAddCustomerModal(false)}>
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email address</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mobile number</label>
            <div className="flex border rounded-md">
              <div className="flex items-center px-2 border-r">
                <img
                  src="/api/placeholder/20/15"
                  alt="IN flag"
                  className="mr-1"
                />
                <span>+91</span>
              </div>
              <input
                type="tel"
                placeholder="0123456789"
                className="flex-1 p-2"
              />
            </div>
          </div>

          <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-md mt-4">
            Add customer
          </button>
        </div>
      </div>
    </div>
  );

  const ImportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">
            Import customers by Excel file
          </h2>
          <button onClick={() => setShowImportModal(false)}>
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <p className="text-sm mb-4">
          Download a{" "}
          <a href="#" className="text-blue-500">
            XLSX template
          </a>{" "}
          to see an example of the format required.
        </p>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <button className="px-4 py-1 border rounded-md mb-2">Add file</button>
          <p className="text-sm text-gray-500">or drag files to upload</p>
        </div>

        <button className="w-full bg-blue-100 text-blue-600 py-2 rounded-md mt-4">
          Import
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Audience</h1>
          <FaQuestionCircle className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex items-center gap-4">
          <FaBell className="h-5 w-5 text-gray-500" />
          <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
          <FaEllipsisV className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="px-4 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-2">
          All{" "}
          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            1
          </span>
        </button>
        <button className="px-4 py-1 bg-gray-100 rounded-md flex items-center gap-2">
          New{" "}
          <span className="bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            1
          </span>
        </button>
        <button className="px-4 py-1 bg-gray-100 rounded-md">Returning</button>
        <button className="px-4 py-1 bg-gray-100 rounded-md">Imported</button>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative">
          <FaSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Name, mobile, or a city..."
            className="pl-9 pr-4 py-2 border rounded-md w-64"
          />
        </div>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 border rounded-md"
            onClick={() => setShowAddCustomerModal(true)}
          >
            Add customer
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => setShowImportModal(true)}
          >
            Import customers
          </button>
          <button className="px-4 py-2 border rounded-md flex items-center gap-2">
            <FaDownload className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 border rounded-md flex items-center gap-2">
            <FaCalendarAlt className="h-4 w-4" />
            Lifetime
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left w-8">
                <input type="checkbox" />
              </th>
              <th className="p-4 text-left font-medium">Customer Name</th>
              <th className="p-4 text-left font-medium">Mobile Number</th>
              <th className="p-4 text-left font-medium">Email</th>
              <th className="p-4 text-left font-medium">City</th>
              <th className="p-4 text-left font-medium">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <input type="checkbox" />
                </td>
                <td className="p-4 text-blue-600">{customer.name}</td>
                <td className="p-4">{customer.mobile}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">{customer.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddCustomerModal && <AddCustomerModal />}
      {showImportModal && <ImportModal />}
    </div>
  );
};

export default AudienceManagement;
