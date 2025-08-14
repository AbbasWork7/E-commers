// src/pages/Orders/components/OrderTabs.jsx
import React from 'react';

const OrderTabs = ({ activeTab, setActiveTab, tabCounts = {} }) => {
  // Default counts if not provided
  const counts = {
    all: tabCounts.all || 0,
    pending: tabCounts.pending || 0,
    accepted: tabCounts.accepted || 0,
    shipped: tabCounts.shipped || 0,
    delivered: tabCounts.delivered || 0,
    others: tabCounts.others || 0
  };

  const tabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'accepted', label: 'Accepted', count: counts.accepted },
    { id: 'shipped', label: 'Shipped', count: counts.shipped },
    { id: 'delivered', label: 'Delivered', count: counts.delivered },
    { id: 'others', label: 'Others', count: counts.others }
  ];

  return (
    <div className="order-tabs mb-4">
      <div className="d-flex overflow-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`btn position-relative me-2 ${
              activeTab === tab.id ? 'btn-dark' : 'btn-light'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="badge bg-secondary ms-2">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderTabs;