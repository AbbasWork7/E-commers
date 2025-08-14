import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { THEME_COLORS } from "../../constants/colors";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Sign-In
    const loadGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    };
5
    // Load Google Sign-In Script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = loadGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = (response) => {
    // Handle Google Sign-In response
    const token = response.credential;
    localStorage.setItem("token", token);
    navigate("/");
  };

  const handleSendOTP = async () => {
    try {
      // Implement your OTP sending logic here
      // For demo, we'll just simulate it
      setOtpSent(true);
      alert("OTP sent to your phone number!");
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginMethod === "phone") {
      // Verify OTP logic
      if (credentials.otp === "1234") {
        // Replace with actual OTP verification
        localStorage.setItem("token", "dummy-token");
        navigate("/");
      } else {-2
        alert("Invalid OTP");
      }
    } else {
      // Email login logic
      localStorage.setItem("token", "dummy-token");
      navigate("/");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Login</h3>

              <div className="btn-group w-100 mb-4">
                <button
                  className={`btn ${
                    loginMethod === "email"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setLoginMethod("email")}
                  style={{
                    backgroundColor:
                      loginMethod === "email" ? THEME_COLORS.primary : "white",
                    borderColor: THEME_COLORS.primary,
                    color:
                      loginMethod === "email" ? "white" : THEME_COLORS.primary,
                  }}
                >
                  Email
                </button>
                <button
                  className={`btn ${
                    loginMethod === "phone"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setLoginMethod("phone")}
                  style={{
                    backgroundColor:
                      loginMethod === "phone" ? THEME_COLORS.primary : "white",
                    borderColor: THEME_COLORS.primary,
                    color:
                      loginMethod === "phone" ? "white" : THEME_COLORS.primary,
                  }}
                >
                  Phone
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {loginMethod === "email" ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={credentials.email}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <input
                          type="tel"
                          className="form-control"
                          value={credentials.phone}
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleSendOTP}
                          style={{
                            borderColor: THEME_COLORS.primary,
                            color: THEME_COLORS.primary,
                          }}
                        >
                          Send OTP
                        </button>
                      </div>
                    </div>
                    {otpSent && (
                      <div className="mb-3">
                        <label className="form-label">Enter OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={credentials.otp}
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              otp: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  style={{
                    backgroundColor: THEME_COLORS.primary,
                    borderColor: THEME_COLORS.primary,
                  }}
                >
                  Login
                </button>
              </form>

              <div className="text-center mb-3">
                <span className="text-muted">OR</span>
              </div>

              <div id="googleSignInDiv" className="w-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
