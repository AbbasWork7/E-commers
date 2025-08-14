import { useState, useEffect } from "react";

export const useProductForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountedPrice: "",
    shortDescription: "",
    fullDescription: "",
    tags: [],
    images: [],
    inventory: "unlimited",
    sku: "",
    variants: [],
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    ...(initialData || {}),
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const resetForm = () => {
    setFormData(initialData || {});
    setIsDirty(false);
  };

  return {
    formData,
    isDirty,
    handleInputChange,
    resetForm,
  };
};
