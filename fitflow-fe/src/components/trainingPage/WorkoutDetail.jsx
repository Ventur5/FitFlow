import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import {
  Card,
  Button,
  Badge,
  Row,
  Col,
  Form,
  Table,
  Modal,
  Container,
  Spinner,
} from "react-bootstrap";

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

  const [showAddEx, setShowAddEx] = useState(false);
  const [newEx, setNewEx] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
  });

  useEffect(() => {
    fetchDetails();
    return () => clearInterval(timerRef.current);
  }, [id]);

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
      } else {
        const errorData = await res.json();
        toast.error(
          `Errore: ${errorData.message || "Impossibile trovare l'allenamento"}`,
        );
      }
    } catch (err) {
      toast.error(
        "Errore di connessione al server. Verifica che il backend sia attivo.",
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- CRONOMETRO ---
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
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, "0") + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- SALVATAGGIO MODIFICHE SUL DB ---
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
        toast.success("Allenamento aggiornato nel database!");
        setIsEditing(false);
      } else {
        toast.error("Errore durante il salvataggio.");
      }
    } catch (err) {
      toast.error("Errore di rete durante il salvataggio.");
    }
  };

  // --- ELIMINAZIONE DAL DB ---
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.info("Workout eliminato definitivamente.");
        navigate("/training");
      }
    } catch (err) {
      toast.error("Errore durante l'eliminazione.");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!workout)
    return (
      <div className="text-center mt-5 py-5 bg-light min-vh-100">
        <h3 className="text-muted">Dati non disponibili.</h3>
        <Button variant="primary" onClick={() => navigate("/training")}>
          Torna alla lista
        </Button>
      </div>
    );

  return (
    <div className="bg-light min-vh-100">
      <Navbar user={user} onLogout={onLogout} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Button
              variant="white"
              className="shadow-sm rounded-circle me-3 border"
              onClick={() => navigate(-1)}
            >
              ←
            </Button>
            <div>
              <h1 className="mb-0 fw-bold text-dark">{workout.name}</h1>
              <Badge bg="primary" className="rounded-pill px-3 py-2 mt-1">
                {workout.type}
              </Badge>
            </div>
          </div>
          <div className="d-flex gap-2">
            {isEditing ? (
              <Button
                variant="success"
                className="rounded-pill px-4"
                onClick={saveWorkout}
              >
                Salva sul Database
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                onClick={() => setIsEditing(true)}
              >
                Modifica Sessione
              </Button>
            )}
            <Button
              variant="outline-danger"
              className="rounded-pill"
              onClick={() => setShowDeleteModal(true)}
            >
              Elimina
            </Button>
          </div>
        </div>
        <Row>
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 mb-4 text-center p-4 bg-dark text-white">
              <h6 className="text-uppercase small text-muted mb-2 tracking-widest">
                Tempo Sessione
              </h6>
              <div
                className="display-2 fw-bold mb-4"
                style={{
                  fontFamily: "monospace",
                  color: "#00ff88",
                  textShadow: "0 0 10px rgba(0,255,136,0.3)",
                }}
              >
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

            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2">
                  Informazioni
                </h5>
                <p className="mb-2">
                  <strong>Target:</strong> {workout.duration} min
                </p>
                <p className="mb-2">
                  <strong>Difficoltà:</strong>{" "}
                  <span className="text-primary">
                    {workout.difficulty || "Non specificata"}
                  </span>
                </p>
                <p className="text-muted small mt-3 italic">
                  {workout.description || "Nessuna descrizione presente."}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">Esercizi salvati</h5>
                {isEditing && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => setShowAddEx(true)}
                  >
                    + Nuovo Esercizio
                  </Button>
                )}
              </Card.Header>
              <Table hover responsive className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 text-secondary small">ESERCIZIO</th>
                    <th className="text-secondary small">SERIE</th>
                    <th className="text-secondary small">REPS</th>
                    <th className="text-secondary small">PESO</th>
                    {isEditing && (
                      <th className="text-secondary small">AZIONI</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((ex, index) => (
                      <tr key={index}>
                        <td className="ps-4 fw-bold">{ex.name}</td>
                        <td>{ex.sets}</td>
                        <td>{ex.reps}</td>
                        <td>
                          <Badge
                            bg="light"
                            text="dark"
                            className="border fw-normal"
                          >
                            {ex.weight}
                          </Badge>
                        </td>
                        {isEditing && (
                          <td>
                            <Button
                              variant="link"
                              className="text-danger p-0 text-decoration-none"
                              onClick={() => {
                                const updated = workout.exercises.filter(
                                  (_, i) => i !== index,
                                );
                                setWorkout({ ...workout, exercises: updated });
                              }}
                            >
                              Rimuovi
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Nessun esercizio presente in questo allenamento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
        <Modal show={showAddEx} onHide={() => setShowAddEx(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-bold">Aggiungi Esercizio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">
                  Nome Esercizio
                </Form.Label>
                <Form.Control
                  type="text"
                  className="bg-light border-0"
                  value={newEx.name}
                  onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Serie</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-light border-0"
                      value={newEx.sets}
                      onChange={(e) =>
                        setNewEx({ ...newEx, sets: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Reps</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-light border-0"
                      value={newEx.reps}
                      onChange={(e) =>
                        setNewEx({ ...newEx, reps: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Peso</Form.Label>
                    <Form.Control
                      type="text"
                      className="bg-light border-0"
                      value={newEx.weight}
                      onChange={(e) =>
                        setNewEx({ ...newEx, weight: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                className="w-100 rounded-pill py-2 mt-3 fw-bold"
                onClick={() => {
                  if (!newEx.name)
                    return toast.warning("Inserisci il nome dell'esercizio");
                  const exerciseWithId = { ...newEx, id: Date.now() };

                  setWorkout({
                    ...workout,
                    exercises: [...(workout?.exercises || []), exerciseWithId],
                  });

                  setNewEx({ name: "", sets: "", reps: "", weight: "" });
                  setShowAddEx(false);
                }}
              >
                Conferma Esercizio
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Body className="p-4 text-center">
            <h4 className="fw-bold">Confermi l'eliminazione?</h4>
            <p className="text-muted">
              Questa azione rimuoverà l'allenamento dal tuo profilo in modo
              permanente.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="light"
                className="rounded-pill px-4"
                onClick={() => setShowDeleteModal(false)}
              >
                Annulla
              </Button>
              <Button
                variant="danger"
                className="rounded-pill px-4"
                onClick={handleDelete}
              >
                Sì, elimina ora
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
      <Footer />
    </div>
  );
};

export default WorkoutDetail;
