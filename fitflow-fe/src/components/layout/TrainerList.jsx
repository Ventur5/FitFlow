import React, { useState, useEffect } from 'react';
import { Offcanvas, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { PersonBadge, XLg, StarFill } from 'react-bootstrap-icons';
import './TrainerList.css';

const TrainerList = ({ currentUser, onTrainerUpdated }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const toggleSidebar = () => setShow(!show);
  const handleClose = () => setShow(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/trainers')
      .then(res => res.json())
      .then(data => {
        setTrainers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (trainerId) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/choose-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id, trainerId })
      });
      const result = await response.json();
      if (onTrainerUpdated) onTrainerUpdated(result.user);
      handleClose(); 
    } catch (err) {
      console.error("Errore selezione:", err);
    }
  };

  return (
    <>
      {/* Bottone Toggle */}
      <div className="trainer-fab-container">
        <button 
          className={`trainer-fab-button ${show ? 'active' : ''}`} 
          onClick={toggleSidebar}
        >
          {show ? <XLg size={24} /> : <PersonBadge size={28} />}
        </button>
      </div>

      {/* Pannello Laterale */}
      <Offcanvas 
        show={show} 
        onHide={handleClose} 
        placement="end" 
        className="trainer-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">I nostri Coach</Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          ) : (
            trainers.map((trainer) => {
              const isMyTrainer = currentUser?.myTrainer?._id === trainer._id || currentUser?.myTrainer === trainer._id;

              return (
                <Card 
                  key={trainer._id} 
                  className={`trainer-card-modern ${isMyTrainer ? 'selected' : ''}`}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">{trainer.name} {trainer.surname}</h6>
                      {isMyTrainer && <StarFill />}
                    </div>
                    
                    <small className={isMyTrainer ? 'text-white-50' : 'text-primary d-block mb-2'}>
                      {trainer.specialization}
                    </small>
                    
                    <p className="small mb-3" style={{ opacity: 0.8 }}>
                      {trainer.bio}
                    </p>

                    <Button 
                      variant={isMyTrainer ? "light" : "primary"} 
                      size="sm" 
                      className="w-100 rounded-pill fw-bold"
                      disabled={isMyTrainer}
                      onClick={() => handleSelect(trainer._id)}
                    >
                      {isMyTrainer ? "Già Selezionato" : "Scegli Trainer"}
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