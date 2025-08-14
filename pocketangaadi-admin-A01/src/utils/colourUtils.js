export const getColorName = async (hexColor) => {
  try {
    const colorHex = hexColor.replace("#", "");
    const response = await fetch(
      `https://www.thecolorapi.com/id?hex=${colorHex}&format=json`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.name.value;
  } catch (error) {
    console.error("Error fetching color name:", error);

    // Retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await fetch(
          `https://www.thecolorapi.com/id?hex=${colorHex}&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          return data.name.value;
        }
      } catch (retryError) {
        retries -= 1;
        console.error(`Retrying... ${retries} attempts left`);
      }
    }

    // Fallback if all retries fail
    return getFallbackColorName(hexColor);
  }
};
