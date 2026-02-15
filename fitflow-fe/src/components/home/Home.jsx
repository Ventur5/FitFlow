import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ user, setUser }) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);

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

  const heightMeters = user.height / 100;
  const bmi = (user.weight / (heightMeters * heightMeters)).toFixed(1);

  const getCategory = (bmiValue) => {
    if (bmiValue < 18.5) return { label: "Sottopeso", color: "text-warning" };
    if (bmiValue < 25) return { label: "Normopeso", color: "text-success" };
    if (bmiValue < 30) return { label: "Sovrappeso", color: "text-warning" };
    return { label: "Obeso", color: "text-danger" };
  };

  const categoryData = getCategory(bmi);

  useEffect(() => {
    setTimeout(() => setIsWelcomeVisible(true), 500);
  }, []);

  const exercises = [
    {
      name: "Camminata",
      img: "https://www.my-personaltrainer.it/2021/05/06/camminare-al-caldo_900x760.jpeg",
      description: "Migliora la resistenza e la salute cardiovascolare.",
    },
    {
      name: "Squat",
      img: "https://personallevelfitness.com/wp-content/uploads/2017/01/squat.jpg",
      description: "Rafforza gambe, glutei e core.",
    },
    {
      name: "Plank",
      img: "https://www.pesoforma.com/wp-content/uploads/posizione-plank-pesoforma.png",
      description: "Tonifica l'intero core in modo isometrico.",
    },
    {
      name: "Stretching",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC_Fg8txXyMs1IwiUS4ks-jCAQaekbPzwUzA&s",
      description: "Favorisce il recupero e la flessibilità.",
    },
  ];

  return (
    <div className="home-wrapper">
      <Navbar user={user} onLogout={() => setUser(null)} />

      <div
        className={`welcome-section text-center py-5 ${isWelcomeVisible ? "fade-in" : ""}`}
      >
        <h1 className="display-4 fw-bold text-primary">
          {getGreeting()}, {user.name || "Atleta"}!
        </h1>
        <p className="lead text-muted px-3">
          Oggi è il giorno giusto per avvicinarti al tuo obiettivo:{" "}
          <strong>{user.goal}</strong>.
        </p>
      </div>

      <div className="container mt-2">
        <Row className="justify-content-center">
          <Col md={5} className="mb-4">
            <Card
              className="h-100 border-0 shadow-sm hover-shadow"
              style={{ borderRadius: "15px" }}
            >
              <Card.Body className="p-4 text-center">
                <div
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
                >
                  {user.name?.[0]}
                  {user.surname?.[0]}
                </div>
                <Card.Title className="fw-bold mb-3">
                  {user.name} {user.surname}
                </Card.Title>
                <hr />
                <div className="text-start">
                  <p className="mb-2">
                    <strong>Età:</strong> {calculateAge(user.birthdate)} anni
                  </p>
                  <p className="mb-2">
                    <strong>Altezza:</strong> {user.height} cm
                  </p>
                  <p className="mb-2">
                    <strong>Peso:</strong> {user.weight} kg
                  </p>
                  <p className="mb-0">
                    <strong>Dieta:</strong>{" "}
                    <span className="badge bg-light text-dark">
                      {user.diet}
                    </span>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={5} className="mb-4">
            <Card
              className="h-100 border-0 shadow-sm hover-shadow"
              style={{ borderRadius: "15px" }}
            >
              <Card.Body className="p-4 text-center d-flex flex-column justify-content-center">
                <Card.Title className="fw-bold mb-4">
                  Analisi Corporea (BMI)
                </Card.Title>
                <h2 className="display-3 fw-bold text-primary mb-1">{bmi}</h2>
                <h4 className={`fw-bold ${categoryData.color}`}>
                  {categoryData.label}
                </h4>
                <p className="small text-muted mt-3">
                  L'indice di massa corporea ti aiuta a monitorare il tuo stato
                  di salute generale.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col lg={12}>
            <Card
              className="border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: "20px" }}
            >
              <Card.Header className="bg-white border-0 pt-4 text-center">
                <h3 className="fw-bold">I tuoi suggerimenti del giorno</h3>
              </Card.Header>
              <Card.Body className="p-0">
                <div
                  id="exerciseCarousel"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                      >
                        <div className="position-relative">
                          <img
                            src={ex.img}
                            className="d-block w-100"
                            alt={ex.name}
                            style={{ height: "400px", objectFit: "cover" }}
                          />
                          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3 mb-4 mx-5">
                            <h4 className="fw-bold text-white">{ex.name}</h4>
                            <p>{ex.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#exerciseCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#exerciseCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center my-5 pb-5">
          <Link
            to="/training"
            className="btn btn-primary btn-lg px-5 py-3 shadow fw-bold"
            style={{ borderRadius: "50px" }}
          >
            Inizia Allenamento Ora
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
