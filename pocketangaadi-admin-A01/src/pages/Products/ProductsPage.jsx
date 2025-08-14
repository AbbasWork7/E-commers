import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaDownload, FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'productNumber', direction: 'asc' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5004/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    const handleEdit = (id) => {
        navigate(`/products/${id}/edit`);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedProducts = () => {
        const sorted = [...products].sort((a, b) => {
            if (sortConfig.key === 'price' || sortConfig.key === 'discountedPrice') {
                return sortConfig.direction === 'asc'
                    ? a[sortConfig.key] - b[sortConfig.key]
                    : b[sortConfig.key] - a[sortConfig.key];
            }
            return sortConfig.direction === 'asc'
                ? a[sortConfig.key]?.localeCompare(b[sortConfig.key])
                : b[sortConfig.key]?.localeCompare(a[sortConfig.key]);
        });

        if (searchQuery) {
            return sorted.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.id.toString().includes(searchQuery.toLowerCase()) ||  // ✅ Use `id` instead of `productNumber`
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );

        }
        return sorted;
    };

    const handleDeleteProduct = async (productId, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:5004/api/products/${productId}`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort className="text-muted" />;
    };


    const handleExport = () => {
        if (products.length === 0) {
            alert("No products to export!");
            return;
        }

        const csvHeaders = [
            "Product Number",
            "Product Name",
            "Category",
            "Regular Price",
            "Sale Price",
            "Quantity",
            "Status"
        ];

        const csvRows = [
            csvHeaders.join(",")
        ];

        products.forEach(product => {
            const status = product.quantity === 0
                ? 'Out of Stock'
                : product.quantity <= 75
                    ? 'Low Stock'
                    : 'Unlimited';

            const row = [
                product.id,
                product.name,
                product.category,
                product.regular_price,
                product.sale_price,
                product.quantity,
                status
            ].join(",");

            csvRows.push(row);
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>All Products</h4>
                <button className="btn btn-primary" onClick={() => navigate("/products/new")}>+ Add Product</button>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="search-bar flex-grow-1">
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-outline-secondary" onClick={handleExport}>
                    <FaDownload /> Export
                </button>

            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('productNumber')}>Product Number {getSortIcon('productNumber')}</th>
                            <th onClick={() => handleSort('name')}>Product {getSortIcon('name')}</th>
                            <th onClick={() => handleSort('category')}>Category {getSortIcon('category')}</th>
                            <th onClick={() => handleSort('discountedPrice')}>Price {getSortIcon('discountedPrice')}</th>
                            <th onClick={() => handleSort('inventory')}>Inventory {getSortIcon('inventory')}</th>
                            <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getSortedProducts().map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{product.sale_price} <small className="text-muted text-decoration-line-through">₹{product.regular_price}</small></td>
                                <td>{product.quantity}</td>
                                <td>
                                    <span className={`badge ${product.quantity === 0
                                        ? 'bg-danger'
                                        : product.quantity <= 75
                                            ? 'bg-warning'
                                            : 'bg-success'}`}>
                                        {product.quantity === 0
                                            ? 'Out of Stock'
                                            : product.quantity <= 75
                                                ? 'Low Stock'
                                                : 'Unlimited'}
                                    </span>
                                </td>

                                <td>

                                    <button className="btn btn-sm btn-outline-danger" onClick={(e) => handleDeleteProduct(product.id, e)}><FaTrash /></button>
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
