// src/pages/Orders/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';

// Dummy data
const dummyOrders = [
  {
    orderId: "#18063027",
    date: "Today, 11:49 PM",
    customer: "Dharshan",
    items: 1,
    payment: "COD",
    status: "Accepted",
    amount: "₹99",
    channel: "Online Store",
    source: "Direct",
  },
  {
    orderId: "#18063028",
    date: "Today, 10:30 AM",
    customer: "Priya Sharma",
    items: 2,
    payment: "Prepaid",
    status: "Pending",
    amount: "₹299",
    channel: "Mobile App",
    source: "Google",
  },
  {
    orderId: "#18063029",
    date: "Yesterday, 3:20 PM",
    customer: "Rajesh Kumar",
    items: 3,
    payment: "COD",
    status: "Shipped",
    amount: "₹599",
    channel: "Online Store",
    source: "Direct",
  },
  {
    orderId: "#18063030",
    date: "Yesterday, 1:15 PM",
    customer: "Anita Patel",
    items: 1,
    payment: "Prepaid",
    status: "Delivered",
    amount: "₹199",
    channel: "Mobile App",
    source: "Facebook",
  },
  {
    orderId: "#18063031",
    date: "2 days ago",
    customer: "Mohan Singh",
    items: 4,
    payment: "COD",
    status: "Accepted",
    amount: "₹799",
    channel: "Online Store",
    source: "Direct",
  }
];

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState({ field: 'date', order: 'desc' });

  // Simulate API fetch with dummy data
  const fetchOrders = useCallback(() => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      try {
        // Apply filters to dummy data
        let filteredData = [...dummyOrders];
        
        // Apply search filter if exists
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(order => 
            order.orderId.toLowerCase().includes(searchLower) ||
            order.customer.toLowerCase().includes(searchLower)
          );
        }

        // Apply status filter if exists
        if (filters.status && filters.status !== 'all') {
          filteredData = filteredData.filter(order => 
            order.status.toLowerCase() === filters.status.toLowerCase()
          );
        }

        // Apply payment filter if exists
        if (filters.payment) {
          filteredData = filteredData.filter(order => 
            order.payment === filters.payment
          );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
          if (sortBy.order === 'asc') {
            return a[sortBy.field] > b[sortBy.field] ? 1 : -1;
          }
          return a[sortBy.field] < b[sortBy.field] ? 1 : -1;
        });

        setOrders(filteredData);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Error processing orders');
        setIsLoading(false);
      }
    }, 500); // 500ms delay to simulate network
  }, [filters, sortBy]);

  // Fetch orders on mount and when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Update sort
  const updateSort = useCallback((field) => {
    setSortBy(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Search orders
  const searchOrders = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  // Filter by status
  const filterByStatus = useCallback((status) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  // Get filtered orders by tab
  const getFilteredOrders = useCallback((activeTab) => {
    if (activeTab === 'all') return orders;
    
    return orders.filter(order => {
      switch (activeTab) {
        case 'pending':
          return order.status === 'Pending';
        case 'accepted':
          return order.status === 'Accepted';
        case 'shipped':
          return order.status === 'Shipped';
        case 'delivered':
          return order.status === 'Delivered';
        case 'others':
          return !['Pending', 'Accepted', 'Shipped', 'Delivered'].includes(order.status);
        default:
          return true;
      }
    });
  }, [orders]);

  // Refresh orders (for manual refresh)
  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    sortBy,
    filters,
    applyFilters,
    updateSort,
    refreshOrders,
    searchOrders,
    filterByStatus,
    getFilteredOrders
  };
};

export default useOrders;