import './App.css';
import Dashboard from './Pages/Dashboard.jsx';
import Navbars from './Pages/Navbars.jsx';
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './Pages/SignIn.jsx';
import PrivateRoom from './Components/PrivateRoom.jsx';
import Signup from './Pages/Singup.jsx';
import { Toaster } from 'react-hot-toast';
import Createtask from './Pages/Createtask.jsx';

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const currentUser = useSelector((state) => state.user?.user?.currentUser);

  return (
    <div className="max-w-screen-xl mx-auto px-3">
      <Toaster />
      <Navbars />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={!currentUser ? <SignIn /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={!currentUser ? <SignIn /> : <Navigate to="/dashboard" />} />
        <Route path="/create" element={currentUser ? <Createtask /> : <Navigate to="/signin" />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/signin" />} />

        {/* Private Route Placeholder */}
        <Route element={<PrivateRoom />} />
      </Routes>
    </div>
  );
}

export default App;
