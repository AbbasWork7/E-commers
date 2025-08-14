import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CustomizeThemePage = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("header");
  const [theme, setTheme] = useState({
    logo: null,
    showStoreName: true,
    favicon: null,
    font: "Arial",
    colors: {
      primary: "#3B4064",
      secondary: "#E51E57",
    },
    banners: {
      mobile: [],
      desktop: [],
    },
  });

  const sections = [
    { id: "header", name: "Header & Favicon" },
    { id: "footer", name: "Footer" },
    { id: "banners", name: "Banners" },
    { id: "sections", name: "Sections" },
    { id: "fonts", name: "Fonts & Colors" },
    { id: "advanced", name: "Advanced" },
  ];

  const updateTheme = (section, value) => {
    setTheme((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateTheme("logo", URL.createObjectURL(file));
    }
  };

  const handleFaviconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateTheme("favicon", URL.createObjectURL(file));
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="border-bottom bg-white sticky-top">
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link text-dark p-0 me-3"
              onClick={() => navigate("/appearance/themes")}
            >
              ←
            </button>
            <h5 className="mb-0">Customize Theme</h5>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary">Preview</button>
            <button className="btn btn-primary">Update</button>
          </div>
        </div>
      </div>

      <div className="row g-0">
        {/* Sidebar */}
        <div
          className="col-md-3 border-end bg-light"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          <div className="p-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-2 rounded cursor-pointer mb-1 ${
                  activeSection === section.id ? "bg-white shadow-sm" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.name}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <div className="p-4">
            {activeSection === "header" && (
              <div>
                <h6>Store Logo</h6>
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {theme.logo ? (
                      <img
                        src={theme.logo}
                        alt="Store logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-light border rounded d-flex align-items-center justify-content-center"
                        style={{ width: "100px", height: "100px" }}
                      >
                        No logo
                      </div>
                    )}
                    <input
                      type="file"
                      className="d-none"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <label
                      className="btn btn-outline-primary mb-0"
                      htmlFor="logo-upload"
                    >
                      Update image
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={theme.showStoreName}
                      onChange={(e) =>
                        updateTheme("showStoreName", e.target.checked)
                      }
                    />
                    <label className="form-check-label">Show store name</label>
                  </div>
                </div>

                <h6>Favicon</h6>
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3">
                    {theme.favicon ? (
                      <img
                        src={theme.favicon}
                        alt="Favicon"
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-light border rounded d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <small>32px</small>
                      </div>
                    )}
                    <input
                      type="file"
                      className="d-none"
                      id="favicon-upload"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                    />
                    <label
                      className="btn btn-outline-primary mb-0"
                      htmlFor="favicon-upload"
                    >
                      Change image
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "fonts" && (
              <div>
                <h6>Store Font</h6>
                <div className="mb-4">
                  <select
                    className="form-select"
                    value={theme.font}
                    onChange={(e) => updateTheme("font", e.target.value)}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <h6>Colors</h6>
                <div className="mb-4">
                  <div className="mb-3">
                    <label>Primary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={theme.colors.primary}
                      onChange={(e) =>
                        updateTheme("colors", {
                          ...theme.colors,
                          primary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label>Secondary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={theme.colors.secondary}
                      onChange={(e) =>
                        updateTheme("colors", {
                          ...theme.colors,
                          secondary: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeThemePage;
