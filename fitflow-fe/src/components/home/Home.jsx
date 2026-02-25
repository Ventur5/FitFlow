import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import TrainerList from "../layout/TrainerList";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ user, onLogout, setUser }) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [exerciseData, setExerciseData] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buongiorno";
    if (hour < 18) return "Buon pomeriggio";
    return "Buonasera";
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/D";
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const heightMeters = user?.height / 100;
  const bmi =
    user?.weight && heightMeters
      ? (user.weight / (heightMeters * heightMeters)).toFixed(1)
      : "0.0";

  const getCategory = (bmiValue) => {
    if (bmiValue < 18.5)
      return { label: "Sottopeso", color: "text-warning", key: "underweight" };
    if (bmiValue < 25)
      return { label: "Normopeso", color: "text-success", key: "normal" };
    if (bmiValue < 30)
      return { label: "Sovrappeso", color: "text-warning", key: "overweight" };
    return { label: "Obeso", color: "text-danger", key: "obese" };
  };

  const categoryData = getCategory(parseFloat(bmi));

  useEffect(() => {
    setTimeout(() => setIsWelcomeVisible(true), 500);

    fetch("/exercises.json")
      .then((res) => res.json())
      .then((data) => setExerciseData(data))
      .catch((err) => console.error("Errore nel caricamento dei dati:", err));
  }, []);

  const currentSuggestions = exerciseData
    ? exerciseData[categoryData.key]
    : null;

  return (
    <div className="home-wrapper">
      <Navbar user={user} onLogout={onLogout} />

      <div className={`welcome-section text-center py-5 ${isWelcomeVisible ? "fade-in" : ""}`}>
        <TrainerList
          currentUser={user}
          onTrainerUpdated={(updatedUser) => setUser(updatedUser)}
        />

        <h1 className="display-4 fw-bold text-primary">
          {getGreeting()}, {user?.name || "Atleta"}!
        </h1>
        <p className="lead text-muted px-3">
          Oggi è il giorno giusto per avvicinarti al tuo obiettivo:{" "}
          <strong>{user?.goal}</strong>.
        </p>
      </div>

      <div className="container mt-2">
        <Row className="justify-content-center">
          {/* Card Profilo */}
          <Col md={5} className="mb-4">
            <Card className="h-100 border-0 shadow-sm home-card">
              <Card.Body className="p-4 text-center">
                <div className="user-avatar-circle mx-auto">
                  {user?.name?.[0]}
                  {user?.surname?.[0]}
                </div>
                <Card.Title className="fw-bold mb-3 mt-3">
                  {user?.name} {user?.surname}
                </Card.Title>
                <hr />
                <div className="text-start">
                  <p className="mb-2"><strong>Età:</strong> {calculateAge(user?.birthdate)} anni</p>
                  <p className="mb-2"><strong>Altezza:</strong> {user?.height} cm</p>
                  <p className="mb-2"><strong>Peso:</strong> {user?.weight} kg</p>
                  <p className="mb-0">
                    <strong>Dieta:</strong>{" "}
                    <span className="badge bg-light text-dark">{user?.diet}</span>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Card BMI */}
          <Col md={5} className="mb-4">
            <Card className="h-100 border-0 shadow-sm home-card">
              <Card.Body className="p-4 text-center d-flex flex-column justify-content-center">
                <Card.Title className="fw-bold mb-4">Analisi Corporea (BMI)</Card.Title>
                <h2 className="display-3 fw-bold text-primary mb-1">{bmi}</h2>
                <h4 className={`fw-bold ${categoryData.color}`}>{categoryData.label}</h4>
                <p className="small text-muted mt-3">
                  L'indice di massa corporea ti aiuta a monitorare il tuo stato di salute.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={12}>
            <Card className="border-0 shadow-lg overflow-hidden suggestion-card">
              <Card.Header className="suggestion-header text-white py-4 text-center border-0">
                <h3 className="fw-bold mb-1 text-white">Piano d'Azione Giornaliero</h3>
                <p className="opacity-75 mb-0 small">
                  Personalizzato per il tuo profilo: <strong>{categoryData.label}</strong>
                </p>
              </Card.Header>

              <Card.Body className="p-4 p-md-5">
                {currentSuggestions ? (
                  <Row>
                    <Col md={6} className="pe-md-4 mb-5 mb-md-0">
                      <div className="section-title text-primary fw-bold mb-4">
                        <span className="fs-3">🏋️</span> Esercizi consigliati
                      </div>
                      <div className="list-group">
                        {currentSuggestions.exercises.map((ex, idx) => (
                          <div key={idx} className="custom-list-item list-group-item shadow-sm border">
                            <div className="icon-box bg-primary bg-opacity-10">{idx + 1}</div>
                            <span className="fw-medium text-dark">{ex}</span>
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col md={6} className="ps-md-4">
                      <div className="section-title text-success fw-bold mb-4">
                        <span className="fs-3">🍎</span> Focus Nutrizione
                      </div>
                      <div className="list-group">
                        {currentSuggestions.nutrition.map((nut, idx) => (
                          <div key={idx} className="custom-list-item list-group-item shadow-sm border">
                            <div className="icon-box bg-success bg-opacity-10 text-success">✨</div>
                            <span className="fw-medium text-dark">{nut}</span>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-5">
                    <div className="spinner-grow text-primary" role="status"></div>
                    <p className="mt-3 text-muted fw-bold">Analizzando i tuoi dati...</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* SEZIONE CAROSELLO */}
        <Row className="mt-5 justify-content-center">
          <Col lg={10}>
            <h3 className="text-center fw-bold mb-4 section-title-main">Trova la tua Grinta 🔥</h3>
            <div className="carousel-wrapper shadow-lg">
              <div id="motivationalCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {[
                    { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", title: "Non fermarti quando sei stanco", sub: '"Fermati quando hai finito."' },
                    { img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438", title: "La disciplina batte il talento", sub: '"Ogni allenamento è un passo verso la tua versione migliore."' },
                    { img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b", title: "Il tuo unico limite sei tu", sub: '"Inizia dove sei. Usa quello che hai. Fai quello che puoi."' }
                  ].map((item, index) => (
                    <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index} data-bs-interval="5000">
                      <div className="position-relative">
                        <img src={`${item.img}?q=80&w=1470&auto=format&fit=crop`} className="d-block w-100 carousel-img" alt={`Motivation ${index + 1}`} />
                        <div className="carousel-caption d-md-block">
                          <h2 className="display-5 fw-bold text-uppercase">{item.title}</h2>
                          <p className="fs-4 italic-quote">{item.sub}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#motivationalCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#motivationalCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </div>
            </div>
          </Col>
        </Row>

        <div className="text-center my-5 pb-5">
          <Link to="/training" className="btn btn-primary cta-home-btn">
            Inizia Allenamento Ora
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;