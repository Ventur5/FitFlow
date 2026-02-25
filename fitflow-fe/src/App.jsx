import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import UserProfilePage from "./components/userProfilePage/UserProfilePage";
import TrainingPage from "./components/trainingPage/TrainingPage";
import AddWorkoutPage from "./components/trainingPage/AddWorkoutPage";
import WorkoutDetail from "./components/trainingPage/WorkoutDetail";

const ProtectedRoute = ({ user, children, forceProfileUpdate = true }) => {
  if (!user) return <Navigate to="/login" replace />;

  if (forceProfileUpdate && (user.height === 0 || user.weight === 0)) {
   
    if (window.location.pathname !== "/profile") {
      return <Navigate to="/profile" replace />;
    }
  }

  return children;
};

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
        {/* ROTTE PUBBLICHE */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />

        {/* ROTTE PROTETTE */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} onLogout={handleLogout} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} forceProfileUpdate={false}> 
              <UserProfilePage user={user} onLogout={handleLogout} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/training"
          element={
            <ProtectedRoute user={user}>
              <TrainingPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-workout"
          element={
            <ProtectedRoute user={user}>
              <AddWorkoutPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workout/:id"
          element={
            <ProtectedRoute user={user}>
              <WorkoutDetail user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;