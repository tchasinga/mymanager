import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { TextField, Button, CircularProgress, Typography, Alert, Container, Box } from '@mui/material';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector(state => state.user && state.user.user);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch(`https://dashboard-manager-apis-connection.onrender.com/apis/auth/signin`, {
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
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/dashboard');
      setShowSuccess(true);
      setShowError(false);
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
          Sign in as admin
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
        {showSuccess && (
          <Alert severity="success">Welcome!</Alert>
        )}
        {showError && (
          <Alert severity="error">Please check your credentials.</Alert>
        )}
      </Box>
    </Container>
  );
}
