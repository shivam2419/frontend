import React, { useState } from 'react';
import '../style/ImageClassifier.css';

const ImageClassifier = () => {
  const [fileName, setFileName] = useState('No File Chosen');
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      setUploadedFileUrl(URL.createObjectURL(file));
    } else {
      setFileName('No File Chosen');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!uploadedFileUrl) {
      alert('Please select an image first');
      return;
    }

    setLoading(true); // ⏳ Start loading

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch("http://localhost:8000/api/classify-image/", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setPrediction(result.classification[0]);
      setAccuracy((result.classification[1] * 100).toFixed(2));
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  return (
    <div id="classifier-container">
      <h1>Upload an Image for Classification</h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="classifier-file-upload">
          <input
            type="file"
            name="image"
            accept="image/*"
            id="classifier-imageInput"
            required
            onChange={handleFileChange}
          />
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/upload-button-3d-icon-download-in-png-blend-fbx-gltf-file-formats--uploading-up-arrow-pack-user-interface-icons-6307890.png?f=webp"
            alt="Upload Icon"
          />
          <p id="classifier-file-name" style={{ color: '#929292', fontSize: '14px' }}>
            {fileName}
          </p>
          <p>Click to Upload Image</p>
        </label>

        <button type="submit" id="classifier-submitBtn" disabled={loading}>
          {loading ? 'Classifying...' : 'Classify'}
        </button>
      </form>

      {/* 🔄 Loader */}
      {loading && <div className="loader"></div>}

      {/* ✅ Result */}
      {prediction && !loading && (
        <div id="classifier-result">
          Predicted: <span>{prediction}</span>
          <br />
          Accuracy: <span style={{ color: accuracy < 70 ? "red" : "green" }}>{accuracy}%</span>
        </div>
      )}

      {/* 🖼️ Image */}
      {uploadedFileUrl && (
        <div id="classifier-uploaded-image">
          <img src={uploadedFileUrl} alt="Uploaded Image" />
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
