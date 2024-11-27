import React, { useState } from "react";

import "../styles/Products.css";

const VariantModal = ({ show, onClose, onSave }) => {
  const [variantData, setVariantData] = useState({
    optionName: "",
    optionValues: "",
  });

  const handleSave = () => {
    onSave(variantData);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Variants</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Option Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g. Size, Color, Material"
                value={variantData.optionName}
                onChange={(e) =>
                  setVariantData({ ...variantData, optionName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Option Values *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Separate values with commas"
                value={variantData.optionValues}
                onChange={(e) =>
                  setVariantData({
                    ...variantData,
                    optionValues: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Add Variants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;