import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint, FaPen } from "react-icons/fa";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`http://localhost:5004/api/v3/orders/${orderId}/activity`);
        setActivity(res.data);
      } catch (err) {
        console.error("Error fetching activity log:", err);
      }
    };
    fetchActivity();
  }, [orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await axios.get(`http://localhost:5004/api/v3/orders/${orderId}`);
        setOrderData(orderRes.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };

    const fetchItems = async () => {
      try {
        const itemsRes = await axios.get(`http://localhost:5004/api/v3/ord/${orderId}`);
        setItems(itemsRes.data);
      } catch (err) {
        console.error("Error fetching order items:", err);
      }
    };

    Promise.all([fetchOrder(), fetchItems()]).then(() => setLoading(false));
  }, [orderId]);

  const updateOrderStatus = (newStatus) => {
    axios
      .put("http://localhost:5004/api/v3/orders/update-status", {
        orderId,
        status: newStatus,
      })
      .then(() => {
        setOrderData((prev) => ({ ...prev, status: newStatus }));
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const downloadReceipt = () => {
    const input = document.getElementById("receipt-content");
  
    // Wait until all images inside the element are fully loaded
    const images = input.querySelectorAll("img");
    const promises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });
  
    Promise.all(promises).then(() => {
      html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`Order_${orderId}_Receipt.pdf`);
      });
    });
  };
  

  if (loading) return <div>Loading order details...</div>;
  if (!orderData) return <div>Order not found</div>;

  const paymentMethod = orderData.payment_method || "Cash on Delivery";

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link text-dark p-0" onClick={() => navigate("/orders")}>
            <FaArrowLeft />
          </button>
          <h4 className="m-0">
            Order ID {orderData.order_id}
            <span
              className={`badge bg-${
                orderData.status === "pending"
                  ? "warning"
                  : orderData.status === "accepted"
                  ? "primary"
                  : orderData.status === "shipped"
                  ? "info"
                  : orderData.status === "delivered"
                  ? "success"
                  : "secondary"
              } ms-2`}
            >
              {orderData.status}
            </span>
          </h4>
        </div>
        <div className="d-flex gap-2">
          {orderData.status === "pending" && (
            <>
              <button className="btn btn-success" onClick={() => updateOrderStatus("accepted")}>
                Accept Order
              </button>
              <button className="btn btn-outline-danger" onClick={() => updateOrderStatus("canceled")}>
                Cancel
              </button>
            </>
          )}
          {orderData.status === "accepted" && (
            <>
              <button className="btn btn-primary" onClick={() => updateOrderStatus("shipped")}>
                Confirm Shipment
              </button>
              <button className="btn btn-outline-danger" onClick={() => updateOrderStatus("canceled")}>
                Cancel
              </button>
            </>
          )}
          {orderData.status === "shipped" && (
            <>
              <button className="btn btn-info" onClick={() => updateOrderStatus("delivered")}>
                Mark as Delivered
              </button>
              <button className="btn btn-outline-danger" onClick={() => updateOrderStatus("canceled")}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h5>#{orderData.order_id}</h5>
                  <p className="text-muted mb-0">
                    {new Date(orderData.created_at).toLocaleString()}
                  </p>
                </div>
                <button className="btn btn-outline-primary" onClick={downloadReceipt}>
                  <FaPrint className="me-2" />
                  Receipt
                </button>
              </div>

              <div id="receipt-content">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={index} className="d-flex align-items-center border-top py-3">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.product_name}
                        className="me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6>{item.product_name}</h6>
                        <p className="mb-0 text-muted">per piece</p>
                        <div>
                          {item.quantity} x ₹{item.price}
                        </div>
                      </div>
                      <div className="text-end">
                        <h6>₹{(item.quantity * item.price).toFixed(2)}</h6>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No items in this order.</p>
                )}

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{orderData.total_amount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>GST ({orderData.gst_percent}%)</span>
                    <span>
                      ₹
                      {(
                        (orderData.total_amount * orderData.gst_percent) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Discount</span>
                    <span>
                      - ₹
                      {(
                        (orderData.total_amount * orderData.discount) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Payment Method</span>
                    <span>{paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Grand Total</span>
                    <span>₹{orderData.grand_total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  <p className="mb-0">{orderData.customer_name}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted">Mobile</label>
                  <p className="mb-0">{orderData.customer_phone}</p>
                </div>
                <div className="col-12 mb-3">
                  <label className="text-muted">Email</label>
                  <p className="mb-0">{orderData.customer_email}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted">Payment Method</label>
                  <p className="mb-0">{paymentMethod}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted">Shipping address</label>
                  <p className="mb-0">
                    {orderData.delivery_address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Activity</h5>
                <button className="btn btn-link">Add note</button>
              </div>

              <div className="timeline">
                {activity.length > 0 ? (
                  activity.map((act, index) => (
                    <div key={index} className="timeline-item mb-3">
                      <div className="d-flex align-items-center">
                        <div className="timeline-marker me-3"></div>
                        <div>
                          <p className="mb-0">{act.action}</p>
                          <small className="text-muted">
                            {act.automated ? "Automated" : `By ${act.changed_by}`}
                          </small>
                          <small className="text-muted d-block">
                            {new Date(act.time).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No activity for this order.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
