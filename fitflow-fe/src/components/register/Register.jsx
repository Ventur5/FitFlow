import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(form.birthdate);
    const today = new Date();
    if (selectedDate > today) {
      return toast.error("La data di nascita non può essere nel futuro!");
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          height: Number(form.height),
          weight: Number(form.weight),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore registrazione");
      }

      localStorage.setItem("token", data.token);

      setUser(data.user);

      toast.success(`Benvenuto, ${data.user.name}!`);

      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card
      className="mx-auto mt-4 shadow-lg border-0"
      style={{ maxWidth: "550px", borderRadius: "20px" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Crea Account</h2>
          <p className="text-muted small">
            Inserisci i tuoi dati per iniziare il tuo percorso
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary">
                  Nome
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo nome..."
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="py-2 bg-light border-0 shadow-sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold text-secondary">
                  Cognome
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Il tuo cognome..."
                  name="surname"
                  value={form.surname}
                  onChange={handleChange}
                  required
                  className="py-2 bg-light border-0 shadow-sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary">
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="esempio@email.com"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="py-2 bg-light border-0 shadow-sm"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="py-2 bg-light border-0 shadow-sm"
            />
          </Form.Group>

          <div className="border-top pt-4 mb-4 mt-2">
            <h6
              className="text-uppercase text-muted fw-bold mb-3"
              style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
            >
              Dati Personali e Obiettivi
            </h6>

            <Row className="mb-3">
              <Col>
                <Form.Label className="small fw-bold text-secondary">
                  Altezza (cm)
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Altezza..."
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm"
                />
              </Col>
              <Col>
                <Form.Label className="small fw-bold text-secondary">
                  Peso (kg)
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Peso..."
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm"
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-secondary">
                Data di Nascita
              </Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                required
                className="py-2 bg-light border-0 shadow-sm"
              />
            </Form.Group>

            <Row className="mb-4">
              <Col>
                <Form.Label className="small fw-bold text-secondary">
                  Dieta
                </Form.Label>
                <Form.Select
                  name="diet"
                  value={form.diet}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm"
                >
                  <option value="">Seleziona</option>
                  <option value="Normale">Normale</option>
                  <option value="Vegetariana">Vegetariana</option>
                  <option value="Vegana">Vegana</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="small fw-bold text-secondary">
                  Obiettivo
                </Form.Label>
                <Form.Select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  required
                  className="bg-light border-0 shadow-sm"
                >
                  <option value="">Seleziona</option>
                  <option value="Perdita peso">Perdita peso</option>
                  <option value="Mantenimento">Mantenimento</option>
                  <option value="Aumento massa">Aumento massa</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-3 fw-bold shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            Completa Registrazione
          </Button>
          <div className="text-center mt-4">
            <p className="text-muted small">
              Hai già un account?{" "}
              <Link
                to="/login"
                className="text-primary fw-bold text-decoration-none"
              >
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
