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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      fetch("http://localhost:5000/api/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        toast.success("Login con Google riuscito!");
        navigate("/");
      })
      .catch(() => toast.error("Errore nel recupero dati utente"));
    }
  }, [location, setUser, navigate]);


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
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
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
              className="py-2 bg-light border-0 shadow-sm auth-input"
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
            type="submit"
            variant="outline-dark"
            className="w-100 py-2 d-flex align-items-center justify-content-center shadow-sm border-1 btn-google"
            onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }}
          >
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7AvKmIcAF9QUdS96opCZooZxVua16crDwkg&s" 
              alt="Google" 
              className="google-icon"
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