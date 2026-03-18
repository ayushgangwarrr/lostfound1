import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import PostLost from "./pages/PostLost"
import PostFound from "./pages/PostFound"
import Items from "./pages/Items"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Work from "./components/Work";
import Guide from "./components/Guide";
import Rules from "./components/Rules";
import Profile from  "./components/profile";
import Reporteditem from "./components/Reporteditem";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/report-lost" element={<PostLost />} />

        <Route path="/report-found" element={<PostFound />} />

        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/work" element={<Work/>} />
        <Route path="/guide" element={<Guide/>} /> 
        <Route path="/rules" element={<Rules/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-items" element={<Reporteditem />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
