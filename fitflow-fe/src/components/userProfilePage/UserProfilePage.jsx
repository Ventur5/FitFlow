import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userProfilePage.css";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const UserProfilePage = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    diet: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        height: user.height || "",
        weight: user.weight || "",
        diet: user.diet || "",
        goal: user.goal || "",
      });
    }
  }, [user]);

  const token = localStorage.getItem("token");

  const userId = user?._id || user?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Aggiorna profilo ---
  const updatePreferences = async () => {
    if (!userId) {
      toast.error("Errore: ID utente non trovato.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/users/preferences/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            height: formData.height,
            weight: formData.weight,
            diet: formData.diet,
            goal: formData.goal,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          onLogout();
          toast.error("Sessione scaduta. Effettua di nuovo il login.");
        } else {
          throw new Error(data.message || "Errore aggiornamento profilo");
        }
        return;
      }

      toast.success("Profilo aggiornato con successo!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Elimina account ---
  const deleteUser = async () => {
    if (!userId) return;
    if (!window.confirm("Sei sicuro di voler eliminare il tuo account?"))
      return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/users/delete/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Errore eliminazione account");
      }

      toast.success("Account eliminato.");
      localStorage.removeItem("token");
      onLogout();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-5">Caricamento utente...</p>;

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container user-profile-container mt-5">
        <ToastContainer position="top-right" autoClose={3000} />

        {loading && (
          <div
            className="spinner-border text-primary d-block mx-auto mb-3"
            role="status"
          ></div>
        )}

        {!isEditing ? (
          <div className="card p-4 shadow-sm">
            <h1>Profilo Utente</h1>
            <hr />
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Altezza:</strong> {formData.height} cm
            </p>
            <p>
              <strong>Peso:</strong> {formData.weight} kg
            </p>
            <p>
              <strong>Dieta:</strong> {formData.diet || "Non specificata"}
            </p>
            <p>
              <strong>Obiettivo:</strong> {formData.goal || "Non specificato"}
            </p>

            <div className="mt-4">
              <button
                className="btn btn-primary me-2"
                onClick={() => setIsEditing(true)}
              >
                Modifica Profilo
              </button>
              <button className="btn btn-outline-danger" onClick={deleteUser}>
                Elimina Account
              </button>
            </div>
          </div>
        ) : (
          <form
            className="card p-4 shadow-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <h1>Modifica Profilo</h1>
            <hr />
            <div className="mb-3">
              <label className="form-label">Altezza (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Peso (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dieta</label>
              <input
                type="text"
                name="diet"
                value={formData.diet}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Obiettivo</label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="mt-4">
              <button
                className="btn btn-success me-2"
                onClick={updatePreferences}
                disabled={loading}
              >
                {loading ? "Salvataggio..." : "Salva"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Annulla
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;
