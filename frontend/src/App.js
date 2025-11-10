import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import BuyCrypto from "@/pages/BuyCrypto";
import SellCrypto from "@/pages/SellCrypto";
import History from "@/pages/History";
import Profile from "@/pages/Profile";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} setUser={setUser} /></PrivateRoute>} />
          <Route path="/buy" element={<PrivateRoute><BuyCrypto user={user} setUser={setUser} /></PrivateRoute>} />
          <Route path="/sell" element={<PrivateRoute><SellCrypto user={user} setUser={setUser} /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History user={user} setUser={setUser} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile user={user} setUser={setUser} /></PrivateRoute>} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;