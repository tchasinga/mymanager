import './App.css';
import Dashboard from './Pages/Dashboard.jsx';
import Navbars from './Pages/Navbars.jsx';
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignIn from './Pages/SignIn.jsx';
import PrivateRoom from './Components/PrivateRoom.jsx';
import { useEffect } from 'react';
import Singup from './Pages/Singup.jsx';

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const currentUser = useSelector((state) => state.user?.user?.currentUser);
  const location = useLocation();

  useEffect(() => {
    if (currentUser && location.pathname !== "/dashboard") {
      window.location.replace("/dashboard");
    }
  }, [currentUser, location.pathname]);

  return (
    <div className="max-w-screen-xl mx-auto px-3">
      <Navbars />
      <Routes>
        <Route path="/signup" element={<Singup />} />
        <Route path="/signin" element={!currentUser ? <SignIn /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route element={<PrivateRoom />} />
        {/* Upcoming routes will come here */}
      </Routes>
    </div>
  );
}

export default App;
