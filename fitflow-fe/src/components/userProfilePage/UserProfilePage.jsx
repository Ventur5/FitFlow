import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./userProfilePage.css";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const UserProfilePage = ({ user, onLogout, setUser }) => {
  const isNewUser = user?.height === 0 || user?.weight === 0;
  const [isEditing, setIsEditing] = useState(isNewUser);
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
        diet: user.diet || "Normale",
        goal: user.goal || "Mantenimento",
      });
    }
  }, [user]);

  const token = localStorage.getItem("token");
  const userId = user?._id || user?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare definitivamente il tuo account? Questa azione non può essere annullata.")) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Errore durante l'eliminazione");

      toast.success("Account eliminato con successo. Verrai reindirizzato...");
      
      setTimeout(() => {
        onLogout();
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    if (!userId) return toast.error("Errore: ID utente non trovato.");

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/preferences/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            height: Number(formData.height),
            weight: Number(formData.weight),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore aggiornamento");

      setUser(data.user); 
      toast.success("Profilo aggiornato con successo!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-5">Caricamento...</div>;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar user={user} onLogout={onLogout} />
      <ToastContainer position="top-right" autoClose={3000} />

      <Container className="flex-grow-1 py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {isNewUser && (
              <Alert variant="primary" className="shadow-sm mb-4 border-0">
                <Alert.Heading className="h5">👋 Benvenuto in FitFlow!</Alert.Heading>
                <p className="mb-0 small">
                  Per personalizzare i tuoi piani di allenamento, abbiamo bisogno di conoscere i tuoi dati fisici.
                </p>
              </Alert>
            )}

            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-primary p-4 text-center text-white position-relative">
                <div className="profile-avatar-container mb-2">
                   <img 
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=128`} 
                    alt="avatar" 
                    className="rounded-circle border border-4 border-white shadow"
                   />
                </div>
                <h3 className="mb-0 fw-bold">{user.name} {user.surname}</h3>
                <p className="opacity-75 small">{user.email}</p>
              </div>

              <Card.Body className="p-4">
                {!isEditing ? (
                  <div className="profile-info-view">
                    <Row className="g-3">
                      <Col xs={6}>
                        <div className="p-3 bg-light rounded shadow-sm text-center">
                          <small className="text-muted d-block">Altezza</small>
                          <span className="h5 fw-bold text-primary">{user.height} cm</span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="p-3 bg-light rounded shadow-sm text-center">
                          <small className="text-muted d-block">Peso</small>
                          <span className="h5 fw-bold text-primary">{user.weight} kg</span>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="p-3 border-start border-primary border-4 bg-light rounded">
                          <small className="text-muted d-block">Dieta Attuale</small>
                          <span className="fw-bold">{user.diet || "Non specificata"}</span>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <div className="p-3 border-start border-success border-4 bg-light rounded">
                          <small className="text-muted d-block">Obiettivo Fitness</small>
                          <Badge bg="success" className="px-3 py-2">{user.goal || "Mantenimento"}</Badge>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                      <Button variant="primary" onClick={() => setIsEditing(true)} disabled={loading}>
                        Modifica Informazioni
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger btn-sm mt-2" 
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        {loading ? "Eliminazione in corso..." : "Elimina Account"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Form onSubmit={(e) => { e.preventDefault(); updatePreferences(); }}>
                    <h5 className="mb-4 fw-bold">Dati Biometrici</h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label className="small fw-bold">Altezza (cm)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="height" 
                          value={formData.height} 
                          onChange={handleInputChange} 
                          required 
                          placeholder="es. 175"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label className="small fw-bold">Peso (kg)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="weight" 
                          value={formData.weight} 
                          onChange={handleInputChange} 
                          required 
                          placeholder="es. 70"
                        />
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold">Tipo di Dieta</Form.Label>
                      <Form.Select name="diet" value={formData.diet} onChange={handleInputChange}>
                        <option value="Normale">Normale</option>
                        <option value="Vegetariana">Vegetariana</option>
                        <option value="Vegana">Vegana</option>
                        <option value="Chetogenica">Chetogenica</option>
                        
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold">Obiettivo Principale</Form.Label>
                      <Form.Select name="goal" value={formData.goal} onChange={handleInputChange}>
                        <option value="Perdita peso">Perdita peso</option>
                        <option value="Mantenimento">Mantenimento</option>
                        <option value="Aumento massa">Aumento massa</option>
                        <option value="Definizione">Definizione</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button variant="success" type="submit" disabled={loading}>
                        {loading ? "Salvataggio..." : "Salva Profilo"}
                      </Button>
                      {!isNewUser && (
                        <Button variant="outline-secondary" onClick={() => setIsEditing(false)}>
                          Annulla
                        </Button>
                      )}
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default UserProfilePage;