/* eslint-disable jsx-a11y/heading-has-content */
import './App.css';
import Dashboard from './Pages/Dashboard.jsx';
import Navbars from './Pages/Navbars.jsx';
import { useSelector } from "react-redux";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import SignIn from './Pages/SignIn.jsx';
import PrivateRoom from './Components/PrivateRoom.jsx';

function App() {

  const currentUser = useSelector(
    (state) => state.user && state.user.user.currentUser
  );

  return (
    <div className="max-w-screen-xl mx-auto px-3">
      <BrowserRouter>
        <Navbars />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={currentUser ? <Dashboard /> : <Navigate to="/signin" />}
          />

          <Route element={<PrivateRoom />} />
           {/* Upcoming route will comes here soon as possible...*/}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
