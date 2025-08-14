import React from "react";
import { FaShippingFast } from "react-icons/fa";

const DashboardPage = () => {
  return (
    <div className="container-fluid p-4">
      {/* Announcement Banner */}
      <div className="announcement-banner mb-4 p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span className="me-2">✨</span>
          <span>Announcement</span>
          <span className="me-2">✨</span>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-3">
            Shipping Gateway will be launched soon, please join the waitlist.
          </span>
          <button className="btn btn-warning btn-sm">Update</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Shipping Gateway</h2>
          <div>
            <button className="btn btn-outline-secondary me-2">
              How it works
            </button>
            <button className="btn btn-outline-secondary">Help</button>
          </div>
        </div>
      </div>

      {/* Empty State / Center Content */}
      <div className="text-center empty-state py-5">
        <div className="icon-container mb-4">
          <FaShippingFast size={80} className="text-primary" />
        </div>
        <h3 className="mb-3">Get more reach with PocketAngaadi Shipping</h3>
        <p className="text-muted mb-4">
          Now you can ship your products anywhere in India with our integrated
          shipping solution. Start shipping today and grow your business.
        </p>
        <button className="btn btn-primary px-4">Join Waitlist</button>
        <div className="mt-3">
          <a href="#" className="text-primary text-decoration-none">
            Learn more about shipping
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
