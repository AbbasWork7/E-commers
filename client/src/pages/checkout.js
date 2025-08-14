import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Table } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderUpload = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [paymentStatus, setPaymentStatus] = useState('pending');
  
  useEffect(() => {
    if (user && user.user_id) {
      alert(`Your user ID is: ${user.user_id}`); // Log the user ID
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5004/api/users/${user.user_id}`);
          const userDetails = response.data;
          setShippingDetails({
            fullName: userDetails.name || '',
            address: userDetails.address || '',
            city: '', // You may need to extract this from address if it's combined
            postalCode: '', // You may need to extract this from address if it's combined
            phone: userDetails.phone_number || userDetails.phone || ''
          });
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          alert('Failed to fetch user details.');
        }
      };
  
      fetchUserDetails();
    } else {
      alert('No user data available');
    }
  }, [user]);
  

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const totalAmount = cartItems.reduce(
        (total, item) => total + (item.price || item.sale_price) * item.quantity,
        0
      );
      
      const gstPercent = 18;
      const gstAmount = (totalAmount * gstPercent) / 100;
      const grandTotal = totalAmount + gstAmount;

      const deliveryAddress = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.postalCode}`;

      const orderData = {
        user_id: user.user_id, // Include user_id here
        business_id: user.business_id || null,
        customer_name: shippingDetails.fullName,
        customer_email: user.email,
        customer_phone: shippingDetails.phone,
        total_amount: totalAmount.toFixed(2),
        gst_percent: gstPercent,
        discount: 0,
        status: 'pending',
        delivery_address: deliveryAddress,
        grand_total: grandTotal.toFixed(2),
        items: cartItems
      };

      await axios.post('http://localhost:5004/api/ord', orderData);

      clearCart();
      alert('Order placed successfully!');
      navigate('/ThankYou');
    } catch (error) {
      console.error('Order upload failed:', error);
      alert('Failed to upload order.');
    }
  };
  
  return (
    <Container className="py-4">
      <h2 className="mb-4">Shipping & Order Details</h2>
      <Row>
        <Col md={7}>
          <Form onSubmit={handleOrderSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={shippingDetails.fullName}
                required
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                value={shippingDetails.address}
                required
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                value={shippingDetails.city}
                required
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                name="postalCode"
                value={shippingDetails.email}
                required
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={shippingDetails.phone}
                required
                onChange={handleChange}
              />
            </Form.Group>

            <h5 className="mt-4">Order Items</h5>
            <Table striped bordered hover responsive className="mb-4">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price || item.sale_price}</td>
                    <td>₹{(item.price || item.sale_price) * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <p><strong>Payment Status:</strong> {paymentStatus}</p>
            <Button type="submit" variant="success">Place Order</Button>
          </Form>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Body>
              <h5>Order Summary</h5>
              {cartItems.map(item => (
                <div key={item.id} className="mb-2">
                  {item.name} × {item.quantity} = ₹{(item.price || item.sale_price) * item.quantity}
                </div>
              ))}
              <hr />
              <strong>
                Total: ₹
                {Math.round(
                  cartItems.reduce(
                    (total, item) => total + (item.price || item.sale_price) * item.quantity,
                    0
                  )
                )}
              </strong>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderUpload;
