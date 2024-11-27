// src/pages/Orders/components/Popups/SortByPopup.jsx
import React from 'react';

const SortByPopup = ({ currentSort, setSort, onClose }) => {
  const sortOptions = [
    { id: 'date', label: 'Order Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'status', label: 'Status' },
    { id: 'customer', label: 'Customer Name' }
  ];

  return (
    <div className="popup-container" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h5 className="mb-0">Sort Orders</h5>
          <button className="popup-close" onClick={onClose}>×</button>
        </div>
        <div className="popup-body">
          {sortOptions.map((option) => (
            <div className="form-check mb-2" key={option.id}>
              <input
                type="radio"
                className="form-check-input"
                name="sortBy"
                id={option.id}
                checked={currentSort === option.id}
                onChange={() => setSort(option.id)}
              />
              <label className="form-check-label" htmlFor={option.id}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
        <div className="popup-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortByPopup;