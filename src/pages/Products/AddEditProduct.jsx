import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaImage,
  FaTimes,
  FaPlus,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import VariantManager from "./VariationManager";

const AddEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountedPrice: "",
    shortDescription: "",
    fullDescription: "",
    tags: [],
    images: [],
    inventory: {
      quantity: "unlimited",
      sku: "",
      trackInventory: false,
    },
    variants: [],
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
  });

  // UI state
  const [activeSection, setActiveSection] = useState("information");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  // Load product data if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          // Replace with your API call
          const response = await fetch(`/api/products/${productId}`);
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error("Error loading product:", error);
        }
      }
    };

    loadProduct();
  }, [productId]);

  // Handlers
  const handleInputChange = (field, value, section = null) => {
    setFormData((prev) => ({
      ...prev,
      [section ? section : field]: section
        ? {
            ...prev[section],
            [field]: value,
          }
        : value,
    }));
    setIsDirty(true);
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      if (!formData.tags.includes(currentTag.trim())) {
        handleInputChange("tags", [...formData.tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    handleInputChange("images", [...formData.images, ...newImages]);
  };

  const handleImageRemove = (indexToRemove) => {
    handleInputChange(
      "images",
      formData.images.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleVariantAdd = (variantData) => {
    handleInputChange("variants", [...formData.variants, variantData]);
    setShowVariantModal(false);
  };

  const handleVariantRemove = (indexToRemove) => {
    handleInputChange(
      "variants",
      formData.variants.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Replace with your API call
      const response = await fetch(
        isEdit ? `/api/products/${productId}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to save product");

      setIsDirty(false);
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-link text-dark p-0"
            onClick={() => navigate("/products")}
          >
            <FaArrowLeft />
          </button>
          <h4 className="mb-0">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h4>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/products")}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving ? <FaSpinner className="spin" /> : <FaSave />}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="row">
        {/* Left Navigation */}
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "information" ? "active" : ""
              }`}
              onClick={() => setActiveSection("information")}
            >
              Product Information
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "media" ? "active" : ""
              }`}
              onClick={() => setActiveSection("media")}
            >
              Media
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "pricing" ? "active" : ""
              }`}
              onClick={() => setActiveSection("pricing")}
            >
              Pricing
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "inventory" ? "active" : ""
              }`}
              onClick={() => setActiveSection("inventory")}
            >
              Inventory
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "variants" ? "active" : ""
              }`}
              onClick={() => setActiveSection("variants")}
            >
              Variants
            </button>
            <button
              className={`list-group-item list-group-item-action ${
                activeSection === "seo" ? "active" : ""
              }`}
              onClick={() => setActiveSection("seo")}
            >
              SEO
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              {/* Product Information Section */}
              {activeSection === "information" && (
                <div>
                  <h5 className="card-title mb-4">Product Information</h5>
                  <div className="mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.category ? "is-invalid" : ""
                      }`}
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      placeholder="Enter category"
                    />
                    {errors.category && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-primary d-flex align-items-center gap-2"
                        >
                          {tag}
                          <FaTimes
                            className="cursor-pointer"
                            onClick={() => handleTagRemove(tag)}
                          />
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagAdd}
                      placeholder="Type and press Enter to add tags"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Short Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleInputChange("shortDescription", e.target.value)
                      }
                      placeholder="Enter a brief description"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Full Description</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      value={formData.fullDescription}
                      onChange={(e) =>
                        handleInputChange("fullDescription", e.target.value)
                      }
                      placeholder="Enter detailed description"
                    />
                  </div>
                </div>
              )}

              {/* Media Section */}
              {activeSection === "media" && (
                <div>
                  <h5 className="card-title mb-4">Product Media</h5>
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="img-thumbnail"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => handleImageRemove(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <label className="image-upload-area d-flex align-items-center justify-content-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="d-none"
                          onChange={handleImageUpload}
                        />
                        <div className="text-center">
                          <FaImage size={24} className="text-muted mb-2" />
                          <div className="text-muted">
                            Click to upload images
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Section */}
              {activeSection === "pricing" && (
                <div>
                  <h5 className="card-title mb-4">Pricing Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Regular Price *</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${
                            errors.price ? "is-invalid" : ""
                          }`}
                          value={formData.price}
                          onChange={(e) =>
                            handleInputChange("price", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sale Price</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.discountedPrice}
                          onChange={(e) =>
                            handleInputChange("discountedPrice", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Section */}
              {activeSection === "inventory" && (
                <div>
                  <h5 className="card-title mb-4">Inventory Management</h5>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.inventory.trackInventory}
                        onChange={(e) =>
                          handleInputChange(
                            "trackInventory",
                            e.target.checked,
                            "inventory"
                          )
                        }
                      />
                      <label className="form-check-label">
                        Track Inventory
                      </label>
                    </div>
                  </div>

                  {formData.inventory.trackInventory && (
                    <div className="mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.inventory.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            "quantity",
                            e.target.value,
                            "inventory"
                          )
                        }
                        placeholder="Enter quantity"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.inventory.sku}
                      onChange={(e) =>
                        handleInputChange("sku", e.target.value, "inventory")
                      }
                      placeholder="Enter SKU"
                    />
                  </div>
                </div>
              )}

              {/* Variants Section - Continued */}
              {activeSection === "variants" && (
                <div>
                  <h5 className="card-title mb-4">Product Variants</h5>
                  <VariantManager
                    onVariantChange={(newVariants) => {
                      handleInputChange("variants", newVariants);
                    }}
                    existingVariants={formData.variants}
                  />
                </div>
              )}

              {/* SEO Section */}
              {activeSection === "seo" && (
                <div>
                  <h5 className="card-title mb-4">SEO Settings</h5>

                  <div className="mb-4">
                    <label className="form-label">Meta Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.seo.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value, "seo")
                      }
                      placeholder="Enter meta title"
                    />
                    <small className="text-muted">
                      Recommended length: 50-60 characters
                    </small>
                    <div className="progress mt-2" style={{ height: "2px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(formData.seo.title.length / 60) * 100}%`,
                          backgroundColor:
                            formData.seo.title.length > 60
                              ? "#dc3545"
                              : "#28a745",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Meta Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.seo.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value, "seo")
                      }
                      placeholder="Enter meta description"
                    ></textarea>
                    <small className="text-muted">
                      Recommended length: 150-160 characters
                    </small>
                    <div className="progress mt-2" style={{ height: "2px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${
                            (formData.seo.description.length / 160) * 100
                          }%`,
                          backgroundColor:
                            formData.seo.description.length > 160
                              ? "#dc3545"
                              : "#28a745",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Focus Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.seo.keywords}
                      onChange={(e) =>
                        handleInputChange("keywords", e.target.value, "seo")
                      }
                      placeholder="Separate keywords with commas"
                    />
                    <small className="text-muted">
                      Add keywords that describe your product
                    </small>
                  </div>

                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Search Preview</h6>
                      <div className="search-preview mt-3">
                        <div style={{ color: "#1a0dab", fontSize: "18px" }}>
                          {formData.seo.title || "Product Title"}
                        </div>
                        <div style={{ color: "#006621", fontSize: "14px" }}>
                          {window.location.origin}/products/...
                        </div>
                        <div style={{ color: "#545454", fontSize: "14px" }}>
                          {formData.seo.description ||
                            "Product description will appear here..."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
