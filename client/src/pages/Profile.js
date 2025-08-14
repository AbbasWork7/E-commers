import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Badge, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ theme }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const storedUserId = user?.user_id || localStorage.getItem('user_id');
  if (storedUserId) {
    console.log("Calling API for user ID:", storedUserId);
    axios.get(`http://localhost:5004/api/orders/${storedUserId}`)
      .then(res => {
        console.log("Orders:", res.data);
        const pending = res.data.filter(order =>
          ['pending', 'accepted', 'shipped'].includes(order.status)
        );
        const completed = res.data.filter(order => order.status === 'delivered');
        setPendingOrders(pending);
        setCompletedOrders(completed);
      })
      .catch(err => console.error('Error fetching orders:', err));
  } else {
    console.log("User not available yet");
  }
}, [user]);


  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

  return (
    <Container fluid className="py-4">
      {/* Profile Header */}
      <Row className="mb-4">
        <Col>
          <Card className={`border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="ms-4">
                  <h2 className="mb-1">{user?.name}</h2>
                  <p className={`mb-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                    @{user?.username}
                  </p>
                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/edit-profile" className="btn btn-primary">
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Profile Content */}
      <Row>
        <Col>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Card className={theme === 'dark' ? 'bg-dark text-light' : ''}>
              <Card.Header className="bg-transparent">
                <Nav variant="tabs" className="border-bottom-0">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="overview" 
                      className={`${theme === 'dark' ? 'text-light' : ''} ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="orders" 
                      className={`${theme === 'dark' ? 'text-light' : ''} ${activeTab === 'orders' ? 'active' : ''}`}
                    >
                      Orders
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                <Tab.Content>
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <Row>
                      <Col md={8}>
                        <h5 className="mb-3">Recent Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {pendingOrders.map(order => (
                            <ListGroup.Item 
                              key={order.order_id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.order_id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {formatDate(order.created_at)} - {order.items?.join(', ') || order.customer_name}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg={
                                    order.status === 'pending' ? 'secondary' :
                                    order.status === 'accepted' ? 'warning' :
                                    order.status === 'shipped' ? 'info' :
                                    'success'
                                  }>
                                    {order.status}
                                  </Badge>
                                  <p className="mb-0 mt-1">${order.grand_total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <Row>
                      <Col>
                        <h5 className="mb-3">Pending Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {pendingOrders.map(order => (
                            <ListGroup.Item 
                              key={order.order_id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.order_id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {formatDate(order.created_at)} - {order.customer_name}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg={
                                    order.status === 'pending' ? 'secondary' :
                                    order.status === 'accepted' ? 'warning' :
                                    order.status === 'shipped' ? 'info' :
                                    'success'
                                  }>
                                    {order.status}
                                  </Badge>
                                  <p className="mb-0 mt-1">${order.grand_total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>

                        <h5 className="mb-3 mt-4">Completed Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {completedOrders.map(order => (
                            <ListGroup.Item 
                              key={order.order_id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.order_id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {formatDate(order.created_at)} - {order.customer_name}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg="success">{order.status}</Badge>
                                  <p className="mb-0 mt-1">${order.grand_total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
