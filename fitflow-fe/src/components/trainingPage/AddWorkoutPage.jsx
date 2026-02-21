import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  InputGroup, 
  Spinner 
} from "react-bootstrap";
import Navbar from "../layout/Navbar";
import "react-toastify/dist/ReactToastify.css";
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
    <div className="bg-light min-vh-100">
      <Navbar user={user} onLogout={onLogout} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="bg-primary py-4 text-center text-white">
                <h2 className="fw-bold mb-0">Nuovo Allenamento</h2>
                <p className="small opacity-75 mb-0">Definisci la tua prossima sessione</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold small text-uppercase text-secondary">
                      Nome della Sessione
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="es. Corsa, Yoga, Circuito HIIT..."
                      className="form-control-lg border-0 bg-light rounded-3"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col sm={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold small text-uppercase text-secondary">
                          Categoria
                        </Form.Label>
                        <Form.Select
                          name="type"
                          className="form-control-lg border-0 bg-light rounded-3"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="Cardio">🏃 Cardio</option>
                          <option value="Forza">🏋️ Forza</option>
                          <option value="Flessibilità">🧘 Flessibilità</option>
                          <option value="HIIT">⚡ HIIT</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col sm={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold small text-uppercase text-secondary">
                          Tempo Stimato
                        </Form.Label>
                        <InputGroup size="lg">
                          <Form.Control
                            type="number"
                            name="duration"
                            placeholder="es. 30"
                            className="border-0 bg-light rounded-start-3"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                          />
                          <InputGroup.Text className="border-0 bg-light text-muted small">
                            min
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-5">
                    <Form.Label className="fw-bold small text-uppercase text-secondary d-block mb-3">
                      Intensità Prevista
                    </Form.Label>
                    <div className="d-flex gap-3 justify-content-between bg-light p-2 rounded-3">
                      {["Bassa", "Media", "Alta"].map((level) => (
                        <div key={level} className="flex-grow-1">
                          <input
                            type="radio"
                            className="btn-check"
                            name="difficulty"
                            id={`diff-${level}`}
                            value={level}
                            checked={formData.difficulty === level}
                            onChange={handleChange}
                          />
                          <label 
                            className={`btn btn-outline-${level === 'Alta' ? 'danger' : level === 'Media' ? 'warning' : 'success'} border-0 w-100 rounded-3 py-2`} 
                            htmlFor={`diff-${level}`}
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Form.Group>

                  <div className="d-grid gap-3 mt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={loading}
                      className="rounded-pill fw-bold py-3 shadow-sm transition-all"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Salvataggio in corso...
                        </>
                      ) : (
                        "Crea Allenamento"
                      )}
                    </Button>
                    <Button
                      variant="link"
                      className="text-muted text-decoration-none small"
                      onClick={() => navigate("/training")}
                    >
                      Annulla e torna indietro
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddWorkoutPage;