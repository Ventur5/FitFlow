import React, { useState, useEffect } from "react";
import { Offcanvas, Card, Button, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { PersonBadge, XLg, StarFill } from "react-bootstrap-icons";
import "./trainerList.css";

const TrainerList = ({ currentUser, onTrainerUpdated }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedTrainerName, setSelectedTrainerName] = useState("");

  const toggleSidebar = () => setShow(!show);
  const handleClose = () => setShow(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/trainers")
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento:", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = async (trainer) => {
    if (!currentUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/choose-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id || currentUser?._id,
          trainerId: trainer._id,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSelectedTrainerName(`${trainer.name} ${trainer.surname}`);
        setShowToast(true);
        if (onTrainerUpdated) onTrainerUpdated(result.user || result);
        handleClose();
      }
    } catch (err) {
      console.error("Errore selezione:", err);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-end" 
        className="p-4 trainer-toast-container"
      >
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={5000} 
          autohide 
          className="custom-toast"
        >
          <Toast.Header>
            <strong className="me-auto">🎉 Coach Assegnato</strong>
            <small>Adesso</small>
          </Toast.Header>
          <Toast.Body>
            Hai affidato il tuo percorso a <strong>{selectedTrainerName}</strong>. 
            Buon allenamento! 🚀
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="trainer-fab-container">
        <button className={`trainer-fab-button ${show ? "active" : ""}`} onClick={toggleSidebar}>
          {show ? <XLg size={24} /> : <PersonBadge size={28} />}
        </button>
      </div>

      <Offcanvas show={show} onHide={handleClose} placement="end" className="trainer-offcanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">I nostri Coach</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            trainers.map((trainer) => {
              const isMyTrainer = 
                currentUser?.myTrainer?._id === trainer._id || 
                currentUser?.myTrainer === trainer._id;

              return (
                <Card key={trainer._id} className={`trainer-card-modern ${isMyTrainer ? "selected" : ""}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">{trainer.name} {trainer.surname}</h6>
                      {isMyTrainer && <StarFill className="text-warning" />}
                    </div>
                    <small className={isMyTrainer ? "text-white-50" : "text-primary d-block mb-2"}>
                      {trainer.specialization}
                    </small>
                    <p className="trainer-bio-text">{trainer.bio}</p>
                    <Button
                      variant={isMyTrainer ? "light" : "primary"}
                      size="sm"
                      className="w-100 rounded-pill fw-bold"
                      disabled={isMyTrainer}
                      onClick={() => handleSelect(trainer)}
                    >
                      {isMyTrainer ? "Il tuo Coach" : "Scegli Trainer"}
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TrainerList;