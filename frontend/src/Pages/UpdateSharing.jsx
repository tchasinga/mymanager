import { useSelector } from 'react-redux';
import { MdWavingHand } from 'react-icons/md';
import { TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function UpdateSharing() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [filePerc, setFilePerc] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrls: [],
  });

  // Adding image to the database
  const handlerImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.error(err);
          setImageUploadError('Image upload error (2 mb per image)');
        });
    } else {
      setImageUploadError('You can upload max 10 images maximum (2 mb per image)');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setFilePerc(Math.round(progress));
        },
        (error) => {
          reject(error);
          setFileUploadError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'dateinstert') {
      setFormData({ ...formData, [e.target.id]: new Date(e.target.value).toISOString().split('T')[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handlerSubmitForm = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(false);
      
      const res = await fetch(`http://localhost:5000/api/tasks/update/${params.sharingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id || currentUser.user._id || currentUser.user.currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === true) {
        setError(data.message);
        setLoading(false);
        return;
      }
      navigate(`/`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchingList = async () => {
      const sharingId = params.sharingId;
      const res = await fetch(`http://localhost:5000/api/tasks/taskbyid/${sharingId}`);
      const data = await res.json();
      setFormData(data);
    };

    fetchingList();
  }, [params.sharingId]);

  const handlerRemoveimg = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="max-w-7xl mx-auto mt-20">
      <div className="flex flex-wrap items-center gap-3 w-full mt-10">
        <h1 className="text-2xl font-light">Hello</h1>
        <MdWavingHand className="text-2xl text-yellow-600 animate__tada animate__animated" />
        <h1 className="text-2xl font-light">{currentUser.user.username}</h1>,
        <h1 className="text-2xl font-light">Update your idea here</h1>
      </div>
      <form onSubmit={handlerSubmitForm} className="mt-11">
        <div className="flex justify-end mb-4">
          <div className="flex flex-col">
            <Button type="submit" variant="contained">
              {loading ? 'Updating...' : 'Updated'}
            </Button>
            {error && <p className="text-red-700 text-xs">{error}</p>}
          </div>
        </div>
        <div className="gridsystem">
          <div className="text-black">
            <TextField
              type="text"
              variant="outlined"
              onChange={handleChange}
              value={formData.title}
              label="Enter your title here"
              name="title"
              id="title"
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="text-black input-group mt-3">
            <textarea
              type="text"
              required
              name="description"
              onChange={handleChange}
              value={formData.description}
              id="description"
              autoComplete="off"
              className="input w-full"
            />
            <label className="user-label">Write the full details of your idea</label>
          </div>
          <div className="flex gap-3">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              className="p-2 border w-full border-gray-300 rounded-lg"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handlerImageSubmit}
              className="font-medium w-full text-xs text-green-700 border rounded-xl p-3"
            >
              {uploading ? 'Uploading...' : 'Upload data'}
            </button>
          </div>
          <p className="text-red-700 text-xs">{imageUploadError && imageUploadError}</p>
        </div>
      </form>
      {formData.imageUrls.length > 0 &&
        formData.imageUrls.map((url, index) => (
          <div key={url} className="flex justify-between p-3 border items-center my-3">
            <img src={url} alt="Image listing" className="w-10 h-10 object-cover rounded-lg" />
            <button type="button" onClick={() => handlerRemoveimg(index)} className="text-red-700 p-2">
              Delete image
            </button>
          </div>
        ))}
      <div className="flex flex-col w-full">
        <p className="text-sm">
          {fileUploadError ? (
            <span className="text-red-500">
              Failed to upload image. Please try again. {currentUser?.user.username} (Your image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-950">Uploading image...{filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-500">Image uploaded successfully.</span>
          ) : null}
        </p>
      </div>
    </main>
  );
}