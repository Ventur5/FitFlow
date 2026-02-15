import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore login");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Bentornato!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card
      className="mx-auto mt-5 shadow-lg border-0"
      style={{ maxWidth: "420px", borderRadius: "20px" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Accedi</h2>
          <p className="text-muted small">
            Inserisci le tue credenziali per continuare
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-secondary">
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="esempio@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-2 bg-light border-0 shadow-sm"
              style={{ borderRadius: "10px" }}
            />
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-secondary">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-2 bg-light border-0 shadow-sm"
              style={{ borderRadius: "10px" }}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 fw-bold shadow-sm"
            style={{ borderRadius: "12px", transition: "all 0.3s" }}
          >
            Entra
          </Button>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Non hai un account?{" "}
              <a href="/register" className="text-decoration-none fw-bold">
                Registrati
              </a>
            </p>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Login;
