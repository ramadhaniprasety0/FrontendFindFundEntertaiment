import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Dropdown, Card } from "react-bootstrap";

const DetailFilmComponent = ({ film, actors }) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);

  const toggleWatched = () => {
    setIsWatched(!isWatched);
  };

  // Fungsi untuk mengubah status suka
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Fungsi untuk mengubah rating bintang
  const handleRating = (star) => {
    setRating(star);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <>
      <div className="row detail-film-page d-flex flex-column flex-md-row align-items-start gap-4">
        {/* Poster di kiri */}
        <div className="col-auto">
          <div className="poster-section text-center mb-4 mb-md-0">
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/${film.image}`}
              alt={film.title}
              className="img-fluid rounded shadow-sm"
            />
            <Dropdown className="btn-double-group d-flex w-100">
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="btn-film-container btn-film">
                Nikmati Film
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu w-100">
                <Dropdown.Item href={film.netflix_link} className="ps-5"><i className="bi bi-tv me-2"></i> Netflix</Dropdown.Item>
                <Dropdown.Item href={film.appletv_link} className="ps-5"><i className="bi bi-play-btn me-2"></i>Apple TV</Dropdown.Item>
                <Dropdown.Item href={film.hbogo_link} className="ps-5"> <i className="bi bi-film me-2"></i>HBO GO</Dropdown.Item>
                <Dropdown.Item href={'/films/tiket/' + film.id + '/bioskop'} target={'_blank'} className="ps-5"><i className="bi bi-ticket-perforated me-2 me-2"></i>Beli Tiket</Dropdown.Item>
              </Dropdown.Menu>
              <a
                href={film.hbogo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-trailer"
              >
                <i className="bi bi-play-circle-fill me-1"></i> Trailer
              </a>
            </Dropdown>
          </div>
        </div>

        {/* Info film di tengah */}
        <div className="col">
          <div className="info-section flex-grow-1">
            <h3 className="fw-bold">{film.title}</h3>

            <p className="text-muted">
              {film.release_year}
              <br />
              Directed by {film.director}
            </p>
            <div className="mb-3">
              {[film.genre1, film.genre2, film.genre3].filter(Boolean).map((genre, index) => (
                <span key={index} className="badge-genre me-2 mb-1">
                  {genre}
                </span>
              ))}
            </div>
            <p>{film.deskripsi}</p>
          </div>
        </div>

        {/* Interaksi pengguna di kanan */}
        <div className="col-auto ms-md-auto">
          <div className="interaction-section text-center">
            {/* Baris Ikon Atas */}
            <div className="icon-row">
              <span>
                <div className="small">Ditonton</div>
                <i className="bi bi-check-circle-fill fs-4"></i>
              </span>
              <span>
                <div className="small">Suka</div>
                <i className="bi bi-heart fs-4"></i>
              </span>
            </div>

            {/* Rating */}
            <div>
              <div className="label mt-2">Bintang</div>
              <div className="rating" style={{ marginTop: "-10px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRating(star)}
                    style={{ cursor: "pointer", color: "#342e58" }}
                  >
                    {star <= rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            {/* Ulasan */}
            <div>
              <div className="label mt-2">Lihat ulasan</div>
              <div className="interaction-icon">
                <Link to={`/film/review/${film.id}`} className="text-decoration-none text-dark">
                  <i className="bi bi-pencil-square"></i>
                </Link>
              </div>
            </div>

            {/* Bagikan */}
            <div>
              <div className="label mt-2">Bagikan</div>
              <div className="interaction-icon">
                <i className="bi bi-share"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pemeran */}

        <h6
        style={{
          marginTop: "100px",
          borderBottom: "1px solid black",
          width: "600px",
        }}
        className="fs-5 fw-semibold"
      >
        Pemeran
      </h6>
      <div className="crew-container" style={{ marginLeft: "0px" }}>
        {/* Loop through cast array */}
        {actors.map((actor, index) => (
          <Card
            key={index}
            style={{ width: "158px", height: "280px" }}
            className="card-kru"
          >
            <Card.Img
              variant="top"
              src={`${import.meta.env.VITE_API_URL_IMAGE}/${actor.image}`}
              alt="{actor.name}"
              className="img-krufilms"
            />
            <Card.Body className="card-body-detailtiketfilms">
              <h5 className="fw-bold mb-1">{truncateText(actor.name, 15)}</h5>
              <p style={{ color: "white" }}>{actor.pemeran}</p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DetailFilmComponent;
