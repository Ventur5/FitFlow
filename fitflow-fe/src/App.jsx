import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import UserProfilePage from "./components/userProfilePage/UserProfilePage";
import TrainingPage from "./components/trainingPage/TrainingPage";
import AddWorkoutPage from "./components/trainingPage/AddWorkoutPage";
import WorkoutDetail from "./components/trainingPage/WorkoutDetail";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && (data._id || data.id)) setUser(data);
        else localStorage.removeItem("token");
      } catch (err) {
        console.error("Errore fetch /me:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-5">Caricamento...</p>;

  return (
    <div>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} 
        />
        <Route
          path="/"
          element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <UserProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/training"
          element={user ? <TrainingPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-workout"
          element={user ? <AddWorkoutPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/workout/:id"
          element={user ? <WorkoutDetail user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;