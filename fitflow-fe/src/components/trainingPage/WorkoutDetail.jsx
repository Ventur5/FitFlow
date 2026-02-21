import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { toast, ToastContainer } from "react-toastify";
import {
  Card,
  Button,
  Badge,
  Row,
  Col,
  Modal,
  Container,
  Spinner,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./workoutDetail.css";

const WorkoutDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const [currentMessage, setCurrentMessage] = useState("Pronto per iniziare?");
  const coachIntervalRef = useRef(null);

  const advices = {
    Forza: [
      "Controlla la fase eccentrica! 🏋️‍♂️",
      "Core contratto!",
      "Qualità sopra quantità ✨",
      "Senti il muscolo lavorare.",
      "Respira profondamente.",
      "Ancora una ripetizione! 💪",
    ],
    Cardio: [
      "Ritmo regolare! 🏃‍♂️",
      "Resta idratato.",
      "Spalle rilassate.",
      "Brucia quelle calorie! 🔥",
      "Non rallentare ora.",
      "Respira col naso.",
    ],
    Flessibilità: [
      "Stai andando forte! 💪",
      "Ogni goccia conta.",
      "Non mollare! 🚀",
      "Sei un guerriero.",
      "Supera i tuoi limiti!",
      "Il sudore è progresso.",
    ],
    HIIT: [
      "Dai tutto in questi 20 secondi! 💥",
      "Recupera attivo.",
      "Sei un fulmine! ⚡",
      "Non mollare adesso!",
      "Spingi fino alla fine! 🏁",
      "Il dolore è temporaneo, la gloria è per sempre.",
    ],
  };

  const getRandomAdvice = () => {
    const category =
      workout?.type && advices[workout.type] ? workout.type : "Generico";
    const list = advices[category];
    return list[Math.floor(Math.random() * list.length)];
  };

  useEffect(() => {
    fetchDetails();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(coachIntervalRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (isActive) {
      coachIntervalRef.current = setInterval(() => {
        setCurrentMessage(getRandomAdvice());
      }, 5000);
    } else {
      clearInterval(coachIntervalRef.current);
      if (time === 0) {
        setCurrentMessage("Pronto per iniziare?");
      } else {
        setCurrentMessage("Ottimo lavoro! Riprendi quando vuoi.");
      }
    }

    return () => clearInterval(coachIntervalRef.current);
  }, [isActive]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setWorkout(data);
      }
    } catch (err) {
      toast.error("Errore di caricamento.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const saveWorkout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
      });
      if (res.ok) {
        toast.success("Database aggiornato! 💪");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Errore di salvataggio.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.info("Workout eliminato.");
        navigate("/training");
      }
    } catch (err) {
      toast.error("Errore eliminazione.");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  if (!workout)
    return <div className="text-center py-5">Dati non trovati.</div>;

  return (
    <div className="bg-light min-vh-100">
      <Navbar user={user} onLogout={onLogout} />
      <ToastContainer position="top-right" autoClose={2000} />

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center">
            <Button
              variant="white"
              className="shadow-sm rounded-circle me-3 border"
              onClick={() => navigate(-1)}
            >
              ←
            </Button>
            <div>
              <h1 className="mb-0 fw-bold">{workout.name}</h1>
              <Badge bg="primary" className="rounded-pill px-3 mt-1">
                {workout.type}
              </Badge>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-danger"
              className="rounded-pill"
              onClick={() => setShowDeleteModal(true)}
            >
              Elimina
            </Button>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-lg rounded-4 mb-4 text-center p-4 bg-dark text-white">
              <h6 className="text-uppercase small text-secondary mb-2">
                Cronometro
              </h6>
              <div className="display-2 fw-bold mb-4 text-primary">
                {formatTime(time)}
              </div>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant={isActive ? "warning" : "success"}
                  className="rounded-pill w-50 py-2 fw-bold"
                  onClick={toggleTimer}
                >
                  {isActive ? "PAUSA" : "INIZIA"}
                </Button>
                <Button
                  variant="outline-light"
                  className="rounded-pill w-50 py-2"
                  onClick={resetTimer}
                >
                  RESET
                </Button>
              </div>
            </Card>
            <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
              <div className="d-flex justify-content-around">
                <div>
                  <small className="text-muted d-block">Target</small>
                  <b>{workout.duration} min</b>
                </div>
                <div className="border-start ps-4">
                  <small className="text-muted d-block">Difficoltà</small>
                  <b className="text-primary">
                    {workout.difficulty || "Media"}
                  </b>
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center text-center p-5 position-relative bg-white overflow-hidden">
              <div className="position-absolute translate-middle rounded-circle coach-live"></div>
              <Card.Body className="position-relative" style={{ zIndex: 1 }}>
                <div className="mb-3">
                  {isActive ? (
                    <Spinner
                      animation="grow"
                      variant="success"
                      size="sm"
                      className="me-2"
                    />
                  ) : (
                    <span className="me-2 text-primary">●</span>
                  )}
                  <span className="text-uppercase fw-bold text-muted small">
                    Coach Live
                  </span>
                </div>
                <h2
                  className={`fw-bold display-5 mb-4 ${isActive ? "text-dark" : "text-muted opacity-50"}`}
                >
                  "{currentMessage}"
                </h2>
                {isActive && (
                  <Badge
                    bg="success"
                    className="rounded-pill px-4 py-2 pulse-animation shadow-sm"
                  >
                    SESSIONE ATTIVA
                  </Badge>
                )}
              </Card.Body>
              {isActive && (
                <div
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{ height: "6px", backgroundColor: "#f8f9fa" }}
                >
                  <div className="progress-bar-loading bg-success h-100"></div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Body className="p-5 text-center">
            <h4 className="fw-bold mb-3">Eliminare la sessione?</h4>
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="light"
                className="rounded-pill px-4"
                onClick={() => setShowDeleteModal(false)}
              >
                Annulla
              </Button>
              <Button
                variant="danger"
                className="rounded-pill px-4 shadow-sm"
                onClick={handleDelete}
              >
                Conferma
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default WorkoutDetail;
