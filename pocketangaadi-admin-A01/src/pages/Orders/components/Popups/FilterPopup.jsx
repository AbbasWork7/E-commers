// src/pages/Orders/components/Popups/FilterPopup.jsx
import React from "react";

const FilterPopup = ({ filters, setFilters, onClose }) => {
  const defaultFilters = {
    payment: {
      paid: false,
      unpaid: false,
      cod: false,
      prepaid: false,
    },
    amount: {
      condition: "select",
    },
    quantity: {
      condition: "select",
    },
    channel: {
      online: false,
      manual: false,
    },
    others: {
      dukaan: false,
      selfShipped: false,
      returned: false,
    },
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="popup-container" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h5 className="mb-0">Filter Orders</h5>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="popup-body">
          <h6>Payment</h6>
          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="cod"
                checked={filters.payment?.cod || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    payment: { ...filters.payment, cod: e.target.checked },
                  })
                }
              />
              <label className="form-check-label" htmlFor="cod">
                COD
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="prepaid"
                checked={filters.payment?.prepaid || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    payment: { ...filters.payment, prepaid: e.target.checked },
                  })
                }
              />
              <label className="form-check-label" htmlFor="prepaid">
                Prepaid
              </label>
            </div>
          </div>

          <h6>Amount</h6>
          <div className="mb-3">
            <select
              className="form-select"
              value={filters.amount?.condition || "select"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  amount: { condition: e.target.value },
                })
              }
            >
              <option value="select">Select condition</option>
              <option value="greater">Greater than</option>
              <option value="less">Less than</option>
              <option value="equal">Equal to</option>
            </select>
          </div>

          <h6>Order Source</h6>
          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="online"
                checked={filters.channel?.online || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    channel: { ...filters.channel, online: e.target.checked },
                  })
                }
              />
              <label className="form-check-label" htmlFor="online">
                Online Store
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="manual"
                checked={filters.channel?.manual || false}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    channel: { ...filters.channel, manual: e.target.checked },
                  })
                }
              />
              <label className="form-check-label" htmlFor="manual">
                Manual Order
              </label>
            </div>
          </div>
        </div>
        <div className="popup-footer">
          <button className="btn btn-outline-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;
