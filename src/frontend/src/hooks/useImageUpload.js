import React, { useState } from "react";
import "../pages/CreateEvent/styles/image.css";
const ImageUpload = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    onImageChange(file);
  };

  return (
    <div>
      {imagePreview && (
        <img src={imagePreview} alt="Event preview" className="inputImagem" />
      )}
      <input type="file" onChange={handleImageUpload} className="input" />
    </div>
  );
};

export default ImageUpload;
