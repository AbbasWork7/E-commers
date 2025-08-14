// src/pages/Appearance/ThemesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ThemesPage = () => {
  const navigate = useNavigate();

  const themes = [
    {
      id: "nirvana",
      name: "Nirvana",
      isPremium: false,
      thumbnail: "/themes/nirvana.png",
    },
    {
      id: "juggernaut",
      name: "Juggernaut",
      isPremium: true,
      thumbnail: "/themes/juggernaut.png",
    },
    {
      id: "impulse",
      name: "Impulse",
      isPremium: false,
      thumbnail: "/themes/impulse.png",
    },
    {
      id: "magnus",
      name: "Magnus",
      isPremium: true,
      thumbnail: "/themes/magnus.png",
    },
    {
      id: "london",
      name: "London",
      isPremium: true,
      thumbnail: "/themes/london.png",
    },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2>Themes</h2>
        <p className="text-muted">Discover the perfect theme for your store</p>
      </div>

      <div className="row g-4">
        {themes.map((theme) => (
          <div key={theme.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <img
                src={theme.thumbnail}
                className="card-img-top"
                alt={theme.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{theme.name}</h5>
                  {theme.isPremium && (
                    <span className="badge bg-warning">Premium</span>
                  )}
                </div>
              </div>
              <div className="card-footer bg-white border-top-0">
                <div className="d-flex gap-2">
                  {theme.isPremium ? (
                    <button className="btn btn-primary w-100">Buy Now</button>
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() =>
                        navigate(`/appearance/themes/customize/${theme.id}`)
                      }
                    >
                      Customize
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemesPage;
