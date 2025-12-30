import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, uploadImg } from "../services/path";

export const HomePage = () => {
  const [images, setImages] = useState({
    sec_1: null,
    sec_2: null,
    sec_3: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("sec_1");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${baseUrl}${uploadImg}`);
        setImages(res.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to fetch images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  const tabLabels = {
    sec_1: "1:00 PM",
    sec_2: "6:00 PM",
    sec_3: "8:00 PM",
  };

  const sections = ["sec_1", "sec_2", "sec_3"];

  return (
    <div>
      <h2>Section Images</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveTab(sec)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: activeTab === sec ? "#007bff" : "#f0f0f0",
              color: activeTab === sec ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {tabLabels[sec]}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {images[activeTab] ? (
        <div style={{ textAlign: "center" }}>
          <h3>{images[activeTab].title}</h3>
          <img
            src={`http://localhost:3000${images[activeTab].imageUrl}`}
            alt={images[activeTab].title}
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ) : (
        <p>No image uploaded for this section.</p>
      )}
    </div>
  );
};
