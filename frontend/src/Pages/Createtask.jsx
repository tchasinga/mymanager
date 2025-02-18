import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Checkbox, FormControlLabel, CircularProgress, Snackbar, Alert } from "@mui/material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Createtask() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const [files, setFiles] = useState([]);
  const [filePerc, setFilePerc] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrls: [],
    status: "pending",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setError(null);
      const promises = Array.from(files).map(file => storeImage(file));
      Promise.all(promises)
        .then(urls => {
          setFormData(prevData => ({
            ...prevData,
            imageUrls: [...prevData.imageUrls, ...urls],
          }));
          setUploading(false);
        })
        .catch(err => {
          console.error(err);
          setError("Image upload error. (2 MB per image)");
          setUploading(false);
        });
    } else {
      setError("You can upload a maximum of 10 images. Please select at least one image.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        error => {
          reject(error);
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: type === 'checkbox' ? (checked ? "completed" : "pending") : value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id || currentUser.user._id || currentUser.user.currentUser._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOpenSnackbar(true);
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <main className="max-w-7xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Complete the Form</h1>

      <form onSubmit={handleSubmitForm} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <TextField
            type="text"
            variant="outlined"
            onChange={handleChange}
            value={formData.title}
            label="Title"
            id="title"
            className="w-full"
            required
          />
        </div>
        <div>
          <TextField
            type="text"
            variant="outlined"
            label="Description"
            onChange={handleChange}
            value={formData.description}
            id="description"
            className="w-full"
            multiline
            rows={4}
            required
          />
        </div>
        <div>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full border rounded-md p-2"
            accept="image/*"
            multiple
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleImageSubmit}
            disabled={uploading}
            className="mt-4 w-full py-2"
          >
            {uploading ? <CircularProgress size={24} /> : "Upload Images"}
          </Button>
          {uploading && <p className="text-blue-600 mt-2">Uploading {filePerc}%</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.status === "completed"}
                onChange={handleChange}
                id="status"
              />
            }
            label="Completed"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-1/2 py-3"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Application submitted successfully!
        </Alert>
      </Snackbar>
    </main>
  );
}