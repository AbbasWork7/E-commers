import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaUser, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const navigate = useNavigate();
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: 'New order received', time: '5 min ago' },
    { id: 2, text: 'Payment confirmed', time: '1 hour ago' },
    { id: 3, text: 'New user registered', time: '2 hours ago' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-fluid">
        <button 
          className="btn sidebar-toggle d-block"
          onClick={toggleSidebar}
        >
          <FaBars className="text-dark" />
        </button>

        <div className="d-flex align-items-center ms-auto">
          {/* Store Status Toggle with Label */}
          <div className="store-status-container me-4 d-none d-lg-flex align-items-center">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="storeStatus"
                checked={isLive}
                onChange={() => setIsLive(!isLive)}
              />
              <label className="form-check-label ms-2" htmlFor="storeStatus">
                <span className={`status-indicator ${isLive ? 'text-success' : 'text-danger'}`}>
                  {isLive ? 'Live Mode' : 'Maintenance Mode'}
                </span>
              </label>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="nav-item dropdown me-3" ref={notificationRef}>
            <button
              className="btn position-relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <FaBell className="text-dark" />
              <span className="notification-badge">3</span>
            </button>
            {notificationsOpen && (
              <div className="dropdown-menu notification-menu show">
                <h6 className="dropdown-header">Notifications</h6>
                {notifications.map(notification => (
                  <a key={notification.id} className="dropdown-item notification-item" href="#">
                    <div className="notification-content">
                      <p className="notification-text mb-0">{notification.text}</p>
                      <small className="notification-time text-muted">{notification.time}</small>
                    </div>
                  </a>
                ))}
                <div className="dropdown-divider"></div>
                <a className="dropdown-item text-center" href="#">View all</a>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="nav-item dropdown" ref={profileRef}>
            <button
              className="btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <FaUser className="text-dark" />
            </button>
            {profileOpen && (
              <div className="dropdown-menu profile-menu show">
                <a className="dropdown-item" href="#">Profile</a>
                <a className="dropdown-item" href="#">Settings</a>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;