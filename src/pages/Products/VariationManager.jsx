import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { getColorName } from "../../utils/colourUtils";

const VariantManager = ({ onVariantChange, existingVariants = [] }) => {
  const [variations, setVariations] = useState(
    existingVariants.length > 0 ? existingVariants : []
  );
  const [currentVariation, setCurrentVariation] = useState({
    option1: "",
    option2: [],
  });

  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#000000");
  const [isCustomName, setIsCustomName] = useState(false);
  const [isLoadingColorName, setIsLoadingColorName] = useState(false);
  const [currentOptionValue, setCurrentOptionValue] = useState("");
  const [error, setError] = useState("");

  const handleOption1Change = (value) => {
    setCurrentVariation((prev) => ({
      ...prev,
      option1: value,
      option2: [],
    }));
    setColorName("");
    setColorCode("#000000");
    setCurrentOptionValue("");
    setError("");
    setIsCustomName(false);
  };

  const handleColorCodeChange = async (newColorCode) => {
    // Validate hex code format
    if (!/^#[0-9A-F]{6}$/i.test(newColorCode)) {
      setError("Invalid color code format");
      return;
    }

    setColorCode(newColorCode);
    setError("");

    if (!isCustomName) {
      setIsLoadingColorName(true);
      try {
        const name = await getColorName(newColorCode);
        setColorName(name);
      } catch (err) {
        setError("Failed to get color name");
      } finally {
        setIsLoadingColorName(false);
      }
    }
  };

  const handleColorNameChange = (e) => {
    setColorName(e.target.value);
    setIsCustomName(true);
  };

  const handleAddColor = () => {
    if (colorName.trim() && colorCode.trim()) {
      const colorValue = `${colorName.trim()}:${colorCode.trim()}`;
      if (!currentVariation.option2.includes(colorValue)) {
        setCurrentVariation((prev) => ({
          ...prev,
          option2: [...prev.option2, colorValue],
        }));
        // Reset inputs but keep color code for next color
        setColorName("");
        setIsCustomName(false);
        setError("");
      } else {
        setError("This color has already been added");
      }
    }
  };

  const handleAddOptionValue = () => {
    if (currentOptionValue.trim()) {
      if (!currentVariation.option2.includes(currentOptionValue.trim())) {
        setCurrentVariation((prev) => ({
          ...prev,
          option2: [...prev.option2, currentOptionValue.trim()],
        }));
        setCurrentOptionValue("");
        setError("");
      } else {
        setError("This value has already been added");
      }
    }
  };

  const handleAddVariation = () => {
    if (currentVariation.option1 && currentVariation.option2.length > 0) {
      // Check if variation type already exists
      if (variations.some((v) => v.option1 === currentVariation.option1)) {
        setError("A variation with this type already exists");
        return;
      }

      const newVariations = [...variations, { ...currentVariation }];
      setVariations(newVariations);
      onVariantChange(newVariations);

      // Reset all inputs
      setCurrentVariation({ option1: "", option2: [] });
      setCurrentOptionValue("");
      setColorName("");
      setColorCode("#000000");
      setIsCustomName(false);
      setError("");
    }
  };

  const handleRemoveVariation = (index) => {
    const newVariations = variations.filter((_, i) => i !== index);
    setVariations(newVariations);
    onVariantChange(newVariations);
  };

  const handleRemoveOption2Value = (variationIndex, valueIndex) => {
    const newVariations = variations.map((variation, index) => {
      if (index === variationIndex) {
        return {
          ...variation,
          option2: variation.option2.filter((_, i) => i !== valueIndex),
        };
      }
      return variation;
    });
    setVariations(newVariations);
    onVariantChange(newVariations);
  };

  return (
    <div className="variant-manager">
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="card-title">Add New Variation</h6>

          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Option Type</label>
            <select
              className="form-select"
              value={currentVariation.option1}
              onChange={(e) => handleOption1Change(e.target.value)}
            >
              <option value="">Select option type</option>
              <option value="Size">Size</option>
              <option value="Color">Color</option>
              <option value="Flavor">Flavor</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {currentVariation.option1 && (
            <div className="mb-3">
              <label className="form-label">
                {currentVariation.option1} Values
              </label>

              {currentVariation.option1 === "Color" ? (
                <div className="color-input-group">
                  <div className="row g-2">
                    <div className="col-sm-5">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Color name (auto-generated)"
                          value={isLoadingColorName ? "Loading..." : colorName}
                          onChange={handleColorNameChange}
                          disabled={isLoadingColorName}
                        />
                        {isCustomName && (
                          <button
                            className="btn btn-outline-secondary"
                            onClick={async () => {
                              setIsCustomName(false);
                              await handleColorCodeChange(colorCode);
                            }}
                            disabled={isLoadingColorName}
                            title="Reset to auto-generated name"
                          >
                            ↺
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-5">
                      <div className="d-flex gap-2">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={colorCode}
                          onChange={(e) =>
                            handleColorCodeChange(e.target.value)
                          }
                          title="Choose color"
                          disabled={isLoadingColorName}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Color code"
                          value={colorCode}
                          onChange={(e) =>
                            handleColorCodeChange(e.target.value)
                          }
                          disabled={isLoadingColorName}
                        />
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleAddColor}
                        disabled={
                          isLoadingColorName ||
                          !colorName.trim() ||
                          !colorCode.trim()
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      {isLoadingColorName
                        ? "Loading color name..."
                        : isCustomName
                        ? "Using custom color name"
                        : "Color name is auto-generated. Edit to customize."}
                    </small>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={currentOptionValue}
                    onChange={(e) => setCurrentOptionValue(e.target.value)}
                    placeholder={`Enter ${currentVariation.option1.toLowerCase()} value`}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddOptionValue}
                    disabled={!currentOptionValue.trim()}
                  >
                    <FaPlus />
                  </button>
                </div>
              )}

              {/* Current Values Display */}
              {currentVariation.option2.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {currentVariation.option2.map((value, index) => {
                    const [label, color] = value.split(":");
                    return (
                      <span
                        key={index}
                        className="badge rounded-pill d-flex align-items-center gap-2"
                        style={{
                          backgroundColor: color || "#f8f9fa",
                          color: color ? "#fff" : "#000",
                          border: "1px solid #dee2e6",
                          padding: "8px 12px",
                        }}
                      >
                        {label}
                        {color && (
                          <span className="ms-1" style={{ fontSize: "0.8em" }}>
                            ({color})
                          </span>
                        )}
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() => {
                            setCurrentVariation((prev) => ({
                              ...prev,
                              option2: prev.option2.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            className="btn btn-primary mt-3"
            onClick={handleAddVariation}
            disabled={
              !currentVariation.option1 || currentVariation.option2.length === 0
            }
          >
            Add Variation
          </button>
        </div>
      </div>

      {/* Existing Variations */}
      {variations.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h6 className="card-title">Current Variations</h6>
            {variations.map((variation, variationIndex) => (
              <div key={variationIndex} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{variation.option1}</h6>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveVariation(variationIndex)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {variation.option2.map((value, valueIndex) => {
                    const [label, color] = value.split(":");
                    return (
                      <span
                        key={valueIndex}
                        className="badge rounded-pill d-flex align-items-center gap-2"
                        style={{
                          backgroundColor: color || "#f8f9fa",
                          color: color ? "#fff" : "#000",
                          border: "1px solid #dee2e6",
                          padding: "8px 12px",
                        }}
                      >
                        {label}
                        {color && (
                          <span className="ms-1" style={{ fontSize: "0.8em" }}>
                            ({color})
                          </span>
                        )}
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() =>
                            handleRemoveOption2Value(variationIndex, valueIndex)
                          }
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantManager;
