// src/pages/Products/ProductsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaColumns,
  FaSort,
  FaDownload,
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import './styles/Products.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Sample products data
  const products = [
    {
      id: 1,
      name: "Soap",
      category: "Bathroom",
      price: 99,
      discountedPrice: 89,
      inventory: "Unlimited",
      status: "Active",
    },
    // Add more sample products...
  ];

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = (productId, e) => {
    e.stopPropagation();
    // Add delete logic here
  };

  return (
    <div className="products-container container-fluid p-4">
      {/* Header */}
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h4 className="page-title mb-0">All Products</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/new")}
        >
          + Add Product
        </button>
      </div>

      {/* Search and Actions Row */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="search-bar flex-grow-1">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">
            <FaFilter /> Filter
          </button>
          <button className="btn btn-outline-secondary">
            <FaSort /> Sort
          </button>
          <button className="btn btn-outline-secondary">
            <FaColumns /> Columns
          </button>
          <button className="btn btn-outline-secondary">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(products.map((p) => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(
                          selectedProducts.filter((id) => id !== product.id)
                        );
                      }
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  <div>₹{product.discountedPrice}</div>
                  <small className="text-muted text-decoration-line-through">
                    ₹{product.price}
                  </small>
                </td>
                <td>{product.inventory}</td>
                <td>
                  <span
                    className={`badge bg-${
                      product.status === "Active" ? "success" : "warning"
                    }-subtle text-${
                      product.status === "Active" ? "success" : "warning"
                    }-emphasis`}
                  >
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}/edit`);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => handleDeleteProduct(product.id, e)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
