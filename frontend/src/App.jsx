/* eslint-disable jsx-a11y/heading-has-content */
import './App.css';
import Navbars from './Pages/Navbars.jsx';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div className="max-w-screen-xl mx-auto px-3">
       <Navbars />
    </div>
  );
}

export default App;
