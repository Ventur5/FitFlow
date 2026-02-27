import React, { useState, useEffect } from "react"; 
import { Card, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      fetch(`${API_URL}/api/users/me`, {
        headers: { "Authorization": `Bearer ${token}` },
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        toast.success("Login con Google riuscito!");
        navigate("/");
      })
      .catch(() => toast.error("Errore nel recupero dati utente"));
    }
  }, [location, setUser, navigate, API_URL]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore login");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Bentornato!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <Card className="mx-auto mt-5 shadow-lg border-0 auth-card">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Accedi</h2>
          <p className="text-muted small">
            Inserisci le tue credenziali per continuare
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
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
              className="py-2 bg-light border-0 shadow-sm auth-input"
            />
          </Form.Group>

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
              className="py-2 bg-light border-0 shadow-sm auth-input"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 fw-bold shadow-sm btn-auth"
          >
            Entra
          </Button>

          <div className="auth-divider-container">
            <hr />
            <span className="auth-divider-text text-muted small">
              oppure
            </span>
          </div>

          <Button
            type="button"
            variant="outline-dark"
            className="w-100 py-2 d-flex align-items-center justify-content-center shadow-sm border-1 btn-google"
            onClick={handleGoogleLogin}
          >
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7AvKmIcAF9QUdS96opCZooZxVua16crDwkg&s" 
              alt="Google" 
              className="google-icon"
              style={{ width: '20px', marginRight: '10px' }}
            />
            Continua con Google
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