import React from "react";

const ColumnsPopup = ({ selectedColumns, setSelectedColumns, onClose }) => {
  return (
    <div className="popup-container" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h5 className="mb-0">Customize Columns</h5>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="popup-body">
          {Object.entries(selectedColumns).map(([column, isSelected]) => (
            <div className="form-check mb-2" key={column}>
              <input
                type="checkbox"
                className="form-check-input"
                id={`col-${column}`}
                checked={isSelected}
                onChange={(e) =>
                  setSelectedColumns({
                    ...selectedColumns,
                    [column]: e.target.checked,
                  })
                }
              />
              <label className="form-check-label" htmlFor={`col-${column}`}>
                {column}
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

export default ColumnsPopup;
