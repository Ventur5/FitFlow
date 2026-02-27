import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register({ setUser }) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    birthdate: "",
    height: "",
    weight: "",
    diet: "",
    goal: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = "${import.meta.env.VITE_API_URL}/api/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(form.birthdate);
    const today = new Date();
    if (selectedDate > today) {
      return toast.error("La data di nascita non può essere nel futuro!");
    }

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          height: Number(form.height),
          weight: Number(form.weight),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore registrazione");

      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success(`Benvenuto, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card className="mx-auto mt-4 shadow-lg border-0 auth-card-wide">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Crea Account</h2>
          <p className="text-muted small">Inserisci i tuoi dati per iniziare</p>
        </div>

        <Button
          variant="outline-dark"
          className="w-100 py-2 d-flex align-items-center justify-content-center shadow-sm border-1 btn-google mb-3"
          onClick={handleGoogleLogin}
        >
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7AvKmIcAF9QUdS96opCZooZxVua16crDwkg&s" 
            alt="Google" 
            className="google-icon"
          />
          Registrati con Google
        </Button>

        <div className="auth-divider-container mb-4">
          <hr />
          <span className="auth-divider-text text-muted small">oppure con email</span>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary">Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Nome"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="py-2 bg-light border-0 shadow-sm auth-input"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary">Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  placeholder="Cognome"
                  value={form.surname}
                  onChange={handleChange}
                  required
                  className="py-2 bg-light border-0 shadow-sm auth-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="esempio@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="py-2 bg-light border-0 shadow-sm auth-input"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="py-2 bg-light border-0 shadow-sm auth-input"
            />
          </Form.Group>

          <div className="border-top pt-4 mb-4 mt-2">
            <h6 className="text-uppercase text-muted fw-bold mb-3 section-title">
              Dati Personali e Obiettivi
            </h6>

            <Row className="mb-3">
              <Col>
                <Form.Label className="small fw-bold text-secondary">Altezza (cm)</Form.Label>
                <Form.Control
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm auth-input"
                />
              </Col>
              <Col>
                <Form.Label className="small fw-bold text-secondary">Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm auth-input"
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">Data di Nascita</Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                required
                className="py-2 bg-light border-0 shadow-sm auth-input"
              />
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Label className="small fw-bold text-secondary">Dieta</Form.Label>
                <Form.Select
                  name="diet"
                  value={form.diet}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm auth-input"
                >
                  <option value="">Seleziona</option>
                  <option value="Normale">Normale</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegana">Vegana</option>
                  <option value="Chetogenica">Chetogenica</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="small fw-bold text-secondary">Obiettivo</Form.Label>
                <Form.Select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm auth-input"
                >
                  <option value="">Seleziona</option>
                  <option value="Perdita peso">Perdita peso</option>
                  <option value="Mantenimento">Mantenimento</option>
                  <option value="Aumento massa">Aumento massa</option>
                  <option value="Definizione">Definizione</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-bold shadow-sm btn-register"
          >
            Completa Registrazione
          </Button>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Hai già un account?{" "}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Accedi
              </Link>
            </p>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Register;