import React from "react";
import { FaDownload, FaColumns, FaSort, FaFilter } from "react-icons/fa";

const ActionButtons = ({
  toggleFilter,
  toggleSort,
  toggleColumns,
  showFilter,
  showSortBy,
  showColumns,
}) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      <div className="btn-group">
        <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
          <FaDownload size={14} />
          <span className="d-none d-md-inline">Export</span>
        </button>

        <div className="position-relative">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={toggleColumns}
          >
            <FaColumns size={14} />
            <span className="d-none d-md-inline">Columns</span>
          </button>
        </div>

        <div className="position-relative">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={toggleSort}
          >
            <FaSort size={14} />
            <span className="d-none d-md-inline">Sort by</span>
          </button>
        </div>

        <div className="position-relative">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={toggleFilter}
          >
            <FaFilter size={14} />
            <span className="d-none d-md-inline">Filter</span>
          </button>
        </div>
      </div>

      <button className="btn btn-primary d-flex align-items-center gap-1">
        <span>+</span>
        Create order
      </button>
    </div>
  );
};

export default ActionButtons;
