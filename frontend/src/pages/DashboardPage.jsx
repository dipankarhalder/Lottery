import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { baseUrl, uploadImg } from "../services/path";

export const DashboardPage = () => {
  const authToken = localStorage.getItem("token");
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    for (let i = 1; i <= 3; i++) {
      const title = data[`title${i}`];
      const file = data[`image${i}`]?.[0];
      if (title && file) {
        formData.append(`title${i}`, title);
        formData.append(`image${i}`, file);
      }
    }

    if (
      !formData.has("title1") &&
      !formData.has("title2") &&
      !formData.has("title3")
    ) {
      console.log("Please add at least one row with title and image.");
      return;
    }

    axios
      .post(`${baseUrl}${uploadImg}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        console.log("Upload successful:", res.data);
      })
      .catch((err) => {
        console.error("Upload failed:", err.response?.data || err.message);
      });
  };

  return (
    <div>
      <h2>Upload Section Images</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <label>Title {i}:</label>
            <input
              type="text"
              {...register(`title${i}`)}
              placeholder={`Enter title ${i}`}
            />
            <label>Image {i}:</label>
            <input type="file" {...register(`image${i}`)} accept="image/*" />
          </div>
        ))}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
