import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaDownload, FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: 'productNumber',
    direction: 'asc'
  });

  // Sample products data
  const products = [
    {
      id: 1,
      name: "Soap",
      category: "Bathroom",
      price: 99,
      discountedPrice: 89,
      productNumber: "PROD001",
      inventory: "Unlimited",
      status: "Active"
    },
    {
      id: 2,
      name: "Shampoo",
      category: "Bathroom",
      price: 199,
      discountedPrice: 179,
      productNumber: "PROD002",
      inventory: "150 units",
      status: "Active"
    },
    {
      id: 3,
      name: "Face Wash",
      category: "Skincare",
      price: 299,
      discountedPrice: 249,
      productNumber: "PROD003",
      inventory: "75 units",
      status: "Low Stock"
    },
    {
      id: 4,
      name: "Body Lotion",
      category: "Skincare",
      price: 399,
      discountedPrice: 349,
      productNumber: "PROD004",
      inventory: "200 units",
      status: "Active"
    },
    {
      id: 5,
      name: "Hand Cream",
      category: "Skincare",
      price: 149,
      discountedPrice: 129,
      productNumber: "PROD005",
      inventory: "Out of Stock",
      status: "Inactive"
    }
  ];

  // Sorting function
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (sortConfig.key === 'price' || sortConfig.key === 'discountedPrice') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply search filter
    if (searchQuery) {
      return sortedProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sortedProducts;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' 
        ? <FaSortUp className="ms-1" /> 
        : <FaSortDown className="ms-1" />;
    }
    return <FaSort className="ms-1 text-muted" />;
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = (productId, e) => {
    e.stopPropagation();
    // Add delete logic here
    console.log("Delete product:", productId);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">All Products</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products/new")}
        >
          + Add Product
        </button>
      </div>

      {/* Search and Export Row */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="search-bar flex-grow-1">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by product number, name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-outline-secondary">
          <FaDownload className="me-2" /> Export
        </button>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('productNumber')}>
                Product Number {getSortIcon('productNumber')}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('name')}>
                Product {getSortIcon('name')}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('discountedPrice')}>
                Price {getSortIcon('discountedPrice')}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('inventory')}>
                Inventory {getSortIcon('inventory')}
              </th>
              <th className="cursor-pointer" onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getSortedProducts().map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product.id)}>
                <td>{product.productNumber}</td>
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
                      product.status === "Active"
                        ? "success"
                        : product.status === "Low Stock"
                        ? "warning"
                        : "danger"
                    }-subtle text-${
                      product.status === "Active"
                        ? "success"
                        : product.status === "Low Stock"
                        ? "warning"
                        : "danger"
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