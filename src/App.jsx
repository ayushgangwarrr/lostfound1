import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
import PostLost from "./pages/PostLost"
import PostFound from "./pages/PostFound"
import Items from "./pages/Items"
import ItemDetails from "./pages/ItemDetails"
import Messages from "./pages/Messages"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Work from "./components/Work";
import Guide from "./components/Guide";
import Rules from "./components/Rules";
import Profile from "./components/profile";
import Reporteditem from "./components/Reporteditem";
import AdminPanel from "./pages/AdminPanel";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import ReportIssue from "./pages/ReportIssue";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CommunityStudents from "./pages/CommunityStudents";
import CommunityHelpdesk from "./pages/CommunityHelpdesk";
import CommunityRules from "./pages/CommunityRules";
import SafetyGuidelines from "./pages/SafetyGuidelines";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/report-lost" element={<PostLost />} />

        <Route path="/report-found" element={<PostFound />} />

        <Route path="/items" element={<Items />} />
        <Route path="/browse" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/work" element={<Work/>} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/guide" element={<Guide/>} /> 
        <Route path="/rules" element={<Rules/>} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        <Route path="/support" element={<Support />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/community/students" element={<CommunityStudents />} />
        <Route path="/community/helpdesk" element={<CommunityHelpdesk />} />
        <Route path="/community/rules" element={<CommunityRules />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-items" element={<Reporteditem />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
