import { useSelector } from 'react-redux';
import { MdWavingHand } from 'react-icons/md';
import { TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateSharing() {
  const currentUser = useSelector((state) => state.user && state.user.user.currentUser);
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

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
              {loading ? 'Updating...' : 'Update'}
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
        </div>
      </form>
    </main>
  );
}