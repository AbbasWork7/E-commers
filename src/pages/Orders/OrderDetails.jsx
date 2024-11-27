// src/pages/Orders/OrderDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint, FaPen } from "react-icons/fa";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  console.log("OrderDetails rendered with orderId:", orderId); // Add this for debugging

  // Sample order data - replace with your actual data
  const orderData = {
    orderId: "#18063027",
    date: "Today, 11:49 PM",
    status: "Accepted",
    items: [
      {
        name: "soap",
        quantity: 1,
        price: "₹99",
        image: "/placeholder.jpg",
      },
    ],
    subtotal: "₹99",
    delivery: "FREE",
    total: "₹99",
    customer: {
      name: "Dharshan",
      mobile: "+91-9600733080",
      email: "antojoel8020@gmail.com",
      address: "dfsd sdfsd sdfsd, Kamrup, 781024 Assam",
    },
    activity: [
      {
        action: "Order accepted",
        time: "26/11/24, 11:49 PM",
        automated: true,
      },
      {
        action: "Order received",
        time: "26/11/24, 11:49 PM",
        source: "online store",
      },
    ],
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-link text-dark p-0"
            onClick={() => navigate("/orders")}
          >
            <FaArrowLeft />
          </button>
          <h4 className="m-0">
            Order ID {orderData.orderId}
            <span className="badge bg-success ms-2">{orderData.status}</span>
          </h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger">Cancel order</button>
          <button className="btn btn-primary">Ship order</button>
        </div>
      </div>

      <div className="row">
        {/* Order Details */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h5>{orderData.orderId}</h5>
                  <p className="text-muted mb-0">{orderData.date}</p>
                </div>
                <button className="btn btn-outline-primary">
                  <FaPrint className="me-2" />
                  Receipt
                </button>
              </div>

              {/* Order Items */}
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center border-top py-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6>{item.name}</h6>
                    <p className="mb-0 text-muted">per piece</p>
                    <div>
                      {item.quantity} x {item.price}
                    </div>
                  </div>
                  <div className="text-end">
                    <h6>{item.price}</h6>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{orderData.subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span className="text-success">{orderData.delivery}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>{orderData.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Customer details</h5>
                <button className="btn btn-link">
                  <FaPen />
                </button>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted">Name</label>
                  <p className="mb-0">{orderData.customer.name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted">Mobile</label>
                  <p className="mb-0">{orderData.customer.mobile}</p>
                </div>
                <div className="col-12 mb-3">
                  <label className="text-muted">Email</label>
                  <p className="mb-0">{orderData.customer.email}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted">Shipping address</label>
                  <p className="mb-0">{orderData.customer.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Activity</h5>
                <button className="btn btn-link">Add note</button>
              </div>

              <div className="timeline">
                {orderData.activity.map((activity, index) => (
                  <div key={index} className="timeline-item mb-3">
                    <div className="d-flex align-items-center">
                      <div className="timeline-marker me-3"></div>
                      <div>
                        <p className="mb-0">{activity.action}</p>
                        <small className="text-muted">
                          {activity.automated
                            ? "Automated"
                            : `Via ${activity.source}`}
                        </small>
                        <small className="text-muted d-block">
                          {activity.time}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
