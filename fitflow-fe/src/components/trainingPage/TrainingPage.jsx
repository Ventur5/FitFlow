import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../layout/Navbar";
import "./trainingPage.css";

const TrainingPage = ({ user, onLogout }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !user) {
      navigate("/");
      return;
    }
    fetchWorkouts();
  }, [token, user, navigate]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/workouts/user/${user._id || user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // DA ELIMINARE! 
      if (!res.ok) {
        console.warn("Backend non trovato o errore, carico dati di test");
        setWorkouts([
          {
            id: "test-1",
            name: "Corsa Mattutina",
            type: "Cardio",
            duration: 30,
            difficulty: "Media",
          },
          {
            id: "test-2",
            name: "Panca Piana",
            type: "Forza",
            duration: 45,
            difficulty: "Alta",
          },
        ]);
        return;
      }

      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error(err.message);
      toast.error("Errore nel caricamento allenamenti");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) return null;

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="container training-container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5 fw-bold">I Tuoi Allenamenti</h1>
          <button
            className="btn btn-success shadow-sm"
            onClick={() => navigate("/add-workout")}
          >
            + Nuovo Allenamento
          </button>
        </div>

        <hr />

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Caricamento scheda...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="alert alert-info text-center mt-4">
            Non hai ancora creato nessun allenamento. Inizia ora!
          </div>
        ) : (
          <div className="row">
            {workouts.map((workout) => (
              <div key={workout._id || workout.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card workout-card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{workout.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {workout.type}
                    </h6>
                    <p className="card-text">
                      <strong>Durata:</strong> {workout.duration} min <br />
                      <strong>Difficoltà:</strong> {workout.difficulty}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() =>
                        navigate(`/workout/${workout._id || workout.id}`)
                      }
                    >
                      Vedi Dettagli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TrainingPage;