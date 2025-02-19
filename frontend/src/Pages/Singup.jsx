import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Alert, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://mymanagerapi.onrender.com/apis/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setShowError(true);
        toast.error('Please check your credentials.');
        return;
      }
      toast.success('Welcome to mymanager app!');
      navigate('/signin');
      setShowError(false);
    } catch (error) {
      setShowError(true);
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
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
          Create an account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Your username"
            name="username"
            autoComplete="username"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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

          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
          >
            Already have an account? <Link to="/signin" className='hover:text-green-800 font-semibold cursor-pointer'>Sign In</Link>
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
              'Sign Up'
            )}
          </Button>
        </Box>
        {showError && (
          <Alert key="error" severity="error">Please check your credentials.</Alert>
        )}
      </Box>
    </Container>
  );
}