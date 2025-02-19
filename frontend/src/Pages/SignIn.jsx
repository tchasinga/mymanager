import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { TextField, Button, CircularProgress, Typography, Alert, Container, Box, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector(state => state.user && state.user.user);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch(`https://mymanagerapi.onrender.com/apis/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        dispatch(signInFailure());
        setShowError(true);
        toast.error('Please check your credentials.');
        return;
      }

      dispatch(signInSuccess(data));
      setUserName(data.username || "User"); 
      setShowSuccess(true);
      setShowError(false);
      setOpenModal(true);
      toast.success('Welcom to mymanager app!');

      // Delay before redirecting
      setTimeout(() => {
        setOpenModal(false);
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setShowError(true);
      dispatch(signInFailure());
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Welcome to Mymanager
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            helperText="Don't share your password"
          />

          <Typography variant="body2" color="textSecondary" align="center">
            Don't have an account? <Link to="/signup" className='hover:text-green-800 font-semibold cursor-pointer'>Sign Up</Link>
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>

        {showSuccess && <Alert severity="success">Welcome!</Alert>}
        {showError && <Alert severity="error">Please check your credentials.</Alert>}

        {/* Welcome Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="welcome-modal"
          aria-describedby="welcome-message"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography id="welcome-modal" variant="h6">
              Welcome, {userName}!
            </Typography>
            <Typography id="welcome-message" sx={{ mt: 2 }}>
              You will be redirected shortly...
            </Typography>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}
