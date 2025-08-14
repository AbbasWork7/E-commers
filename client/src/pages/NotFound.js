import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../pages/orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.user_id) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5004/api/orders/user/${user.user_id}`);
        setOrders(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="orders-container py-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="order-card shadow-sm mb-4">
            <div className="order-header d-flex justify-content-between">
              <div>
                <strong>Order ID:</strong> {order.order_id}<br />
                <strong>Status:</strong> <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span><br />
                <strong>Ordered On:</strong> {new Date(order.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Grand Total:</strong> ₹{order.grand_total}<br />
                <strong>Delivery Address:</strong><br />
                <span>{order.delivery_address}</span>
              </div>
            </div>

            <div className="order-items mt-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-product d-flex align-items-center mb-3">
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="product-img"
                  />
                  <div className="ms-3">
                    <h6 className="mb-1">{item.name}</h6>
                    <div>Price: ₹{item.price} × Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Container>
  );
};

export default Orders;
