import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../layout/Navbar";
import "./addWorkout.css";

const AddWorkoutPage = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Cardio",
    duration: "",
    difficulty: "Media",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/workouts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Allenamento salvato con successo! 💪");
        setTimeout(() => navigate("/training"), 2000);
      } else {
        toast.error(data.message || "Errore durante il salvataggio");
      }
    } catch (err) {
      toast.error("Errore di connessione al server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-workout-bg">
      <Navbar user={user} onLogout={onLogout} />
      <ToastContainer />

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card add-workout-card shadow-lg border-0">
              <div className="card-header bg-gradient-primary text-white text-center py-4">
                <h2 className="mb-0">Nuovo Allenamento</h2>
                <p className="small mb-0 text-white-50">
                  Registra i tuoi progressi di oggi
                </p>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nome Esercizio</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="es. Panca Piana, Corsa..."
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Tipo</label>
                      <select
                        name="type"
                        className="form-select"
                        onChange={handleChange}
                      >
                        <option value="Cardio">Cardio</option>
                        <option value="Forza">Forza</option>
                        <option value="Flessibilità">Flessibilità</option>
                        <option value="HIIT">HIIT</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Durata (min)</label>
                      <input
                        type="number"
                        name="duration"
                        className="form-control"
                        placeholder="es. 30"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Difficoltà percepita
                    </label>
                    <div className="d-flex justify-content-between bg-light p-3 rounded">
                      {["Bassa", "Media", "Alta"].map((level) => (
                        <div key={level} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="difficulty"
                            value={level}
                            checked={formData.difficulty === level}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">{level}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Salvataggio..." : "Salva Allenamento"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/training")}
                    >
                      Annulla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;
