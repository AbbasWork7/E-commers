// src/utils/colorUtils.js
export const getColorName = async (hexColor) => {
  try {
    const colorHex = hexColor.replace("#", "");
    const response = await fetch(
      `https://www.thecolorapi.com/id?hex=${colorHex}&format=json`
    );

    if (!response.ok) {
      throw new Error("Color API request failed");
    }

    const data = await response.json();
    return data.name.value;
  } catch (error) {
    console.error("Error fetching color name:", error);
    return getFallbackColorName(hexColor);
  }
};

export const getFallbackColorName = (hexColor) => {
  // Extended color map for better fallback coverage
  const colorMap = {
    "#FF0000": "Red",
    "#00FF00": "Green",
    "#0000FF": "Blue",
    "#FFFF00": "Yellow",
    "#FF00FF": "Magenta",
    "#00FFFF": "Cyan",
    "#000000": "Black",
    "#FFFFFF": "White",
    "#808080": "Gray",
    "#800000": "Maroon",
    "#808000": "Olive",
    "#008000": "Dark Green",
    "#800080": "Purple",
    "#008080": "Teal",
    "#000080": "Navy",
    "#FFA500": "Orange",
    "#FFC0CB": "Pink",
    "#800020": "Burgundy",
    "#A52A2A": "Brown",
    "#DEB887": "Beige",
    "#E6E6FA": "Lavender",
    "#FFD700": "Gold",
    "#C0C0C0": "Silver",
    "#F0E68C": "Khaki",
  };

  // Find closest color
  let minDistance = Infinity;
  let closestColorName = "Custom Color";

  const targetRGB = hexToRgb(hexColor);
  if (!targetRGB) return "Custom Color";

  Object.entries(colorMap).forEach(([hex, name]) => {
    const currentRGB = hexToRgb(hex);
    if (!currentRGB) return;

    const distance = colorDistance(targetRGB, currentRGB);
    if (distance < minDistance) {
      minDistance = distance;
      closestColorName = name;
    }
  });

  return closestColorName;
};

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const colorDistance = (color1, color2) => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
};
