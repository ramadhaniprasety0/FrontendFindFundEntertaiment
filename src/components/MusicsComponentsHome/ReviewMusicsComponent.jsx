import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner, Modal, Button, Form } from "react-bootstrap";
import api from "../../api/axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const ReviewMusicsComponent = () => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [review, setReview] = useState([]);
  const [music, setMusic] = useState({});
  const [loading, setLoading] = useState(true);

  const [ratinguser, setRatinguser] = useState(0);
  const [titleReview, setTitleReview] = useState("");
  const [plotReview, setPlotReview] = useState("");
  const [actorReview, setActorReview] = useState("");
  const [cinematographyReview, setCinematographyReview] = useState("");
  const [otherReview, setOtherReview] = useState("");
  const [spoiler, setSpoiler] = useState(false);

  const [bintangDropdownOpen, setBintangDropdownOpen] = useState(false);
  const [urutkanDropdownOpen, setUrutkanDropdownOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [likeCount, setLikeCount] = useState(100);
  const [dislikeCount, setDislikeCount] = useState(13);
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);

  const bintangDropdownRef = useRef(null);
  const urutkanDropdownRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [noReview, setNoReview] = useState(false);

  const getReview = async () => {
    try {
      setLoading(true);
      const { data: musicData } = await api.get(`/music/${id}`);
      const response = await api.get(`/ulasan/music/${id}`);

      // Perbaikan: Pastikan data review selalu array
      const reviewData = Array.isArray(response.data) ? response.data : [];

      setReview(reviewData);
      setMusic(musicData.data || {});

      if (reviewData.length === 0) {
        setNoReview(true);
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        "Terjadi kesalahan saat mengambil data review.",
        "error"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  if (loading) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  // Perbaikan: Cek apakah review adalah array
  if (!Array.isArray(review)) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center homepage-films">
        <h2>Tidak Ada Review</h2>
      </div>
    );
  }

  const handleRatingClick = (starValue) => {
    setRatinguser(starValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ulasanData = {
      user_id: userId,
      music_id: id, // Menggunakan music_id alih-alih film_id
      title_review: titleReview,
      alur_review: plotReview,
      sinematografi_review: cinematographyReview,
      pemeran_review: actorReview,
      review_lain: otherReview,
      kategori: spoiler ? 1 : 2,
      rating: ratinguser,
      like_ulasan: 0,
      dislike_ulasan: 0,
    };

    console.log(ulasanData);

    try {
      const response = await api.post(`/ulasan`, ulasanData);
      getReview();
      handleCloseModal();
    } catch (error) {
      console.error("Gagal mengirim ulasan:", error);
    }
  };

  // Fungsi untuk toggle dropdown Bintang
  const toggleBintangDropdown = () => {
    setBintangDropdownOpen(!bintangDropdownOpen);
  };

  // Fungsi untuk toggle dropdown Urutkan
  const toggleUrutkanDropdown = () => {
    setUrutkanDropdownOpen(!urutkanDropdownOpen);
  };

  // Menutup dropdown jika klik terjadi di luar tombol atau menu dropdown
  const handleClickOutside = (event) => {
    if (
      bintangDropdownRef.current &&
      !bintangDropdownRef.current.contains(event.target)
    ) {
      setBintangDropdownOpen(false); // Menutup dropdown Bintang
    }
    if (
      urutkanDropdownRef.current &&
      !urutkanDropdownRef.current.contains(event.target)
    ) {
      setUrutkanDropdownOpen(false); // Menutup dropdown Urutkan
    }
  };

  const handleLikeClick = () => {
    if (!likeClicked) {
      setLikeClicked(true);
      setDislikeClicked(false);
      setLikeCount(likeCount + 1);
      setDislikeCount(dislikeCount - (dislikeClicked ? 1 : 0));
    } else {
      setLikeClicked(false);
      setLikeCount(likeCount - 1);
    }
  };

  // Handle dislike click event
  const handleDislikeClick = () => {
    if (!dislikeClicked) {
      setDislikeClicked(true);
      setLikeClicked(false);
      setDislikeCount(dislikeCount + 1);
      setLikeCount(likeCount - (likeClicked ? 1 : 0));
    } else {
      setDislikeClicked(false);
      setDislikeCount(dislikeCount - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="w-100 min-vh-100 reviewfilms mt-5">
      <div className="poster-section-review d-flex justify-content-center">
        <img
          className="rounded-4 film-poster"
          src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`}
          alt={music.title}
        />
        <div className="title-review">
          <p>{music.title}</p>
          <h2>Ulasan Pendengar</h2>
        </div>
      </div>
      <div className="d-flex mb-4">
        <h3 className="h3-review-film text-start">{review.length} Ulasan</h3>

        <div className="buttons d-flex">
          <div className="dropdown btn-review-film" ref={bintangDropdownRef}>
            <button
              className="btn-review"
              type="button"
              onClick={toggleBintangDropdown}
            >
              Bintang
            </button>
            {bintangDropdownOpen && (
              <ul className="dropdown-menu-review-film text-center">
                <li>Unggulan</li>
                <li>Tanggal Ulasan</li>
                <li>Disukai Terbanyak</li>
              </ul>
            )}
          </div>

          {/* Dropdown Urutkan */}
          <div className="dropdown btn-review-film" ref={urutkanDropdownRef}>
            <button
              className="btn-review"
              type="button"
              onClick={toggleUrutkanDropdown}
            >
              Urutkan
            </button>
            {urutkanDropdownOpen && (
              <ul className="dropdown-menu-review-film text-center">
                <li>Bintang 1</li>
                <li>Bintang 2</li>
                <li>Bintang 3</li>
              </ul>
            )}
          </div>

          {/* Icon Bocoran */}
          <div
            className="icon-bocoran"
            onClick={() => setIsChecked(!isChecked)}
          >
            <i
              className={`fa${isChecked ? "s" : "r"} fa-check-circle`}
              style={{
                fontSize: "15px",
                color: isChecked ? "black" : "#29282F",
                cursor: "pointer",
              }}
            ></i>
            <span
              style={{
                color: isChecked ? "black" : "#29282F",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              Bocoran
            </span>
          </div>

          {/* Tombol + Ulasan */}
          <div className="btn-ulasan">
            <button
              className="btn-plus-ulasan"
              type="button"
              onClick={handleShowModal}
            >
              + Ulasan
            </button>
          </div>
        </div>
      </div>
      {noReview ? (
        <div className="w-100 min-vh-100 d-flex justify-content-center align-items-start homepage-films">
          <h3>
            Belum ada Review nih.. Jadi reviewer pertama di musik {music.title}
          </h3>
        </div>
      ) : (
        <div>
          {review.map((item, i) => (
            <div key={i} className="reviewer-film mb-5 border p-3 rounded-4">
              {/* Rating bintang */}
              <div className="stars mb-3">
                {[...Array(5)].map((_, index) => {
                  const bintangRating = item.rating / 2; // Konversi 0–10 ke 0–5
                  const starIndex = index + 1;

                  let icon = "☆"; // kosong
                  let color = "gray";

                  if (bintangRating >= starIndex) {
                    icon = "★"; // penuh
                    color = "gold";
                  } else if (bintangRating >= starIndex - 0.5) {
                    icon = "⯪"; // setengah
                    color = "gold";
                  }

                  return (
                    <span key={index} style={{ fontSize: "24px", color }}>
                      {icon}
                    </span>
                  );
                })}
                <span style={{ marginLeft: "8px" }}>{item.rating} / 10</span>
              </div>

              {/* Isi ulasan */}
              <div className="reviewer-film-isi">
                <h1>"{item.title_review}"</h1>
                <div className="alur-film">
                  <p>{item.alur_review}</p>
                </div>

                {/* Info user & tanggal */}
                <div className="reviewer-film-users mt-3 mb-3 d-flex gap-3">
                  <p>
                    <strong>{item.username}</strong>
                  </p>
                  <p>{formatDate(item.created_at)}</p>
                </div>
              </div>
              <div className="like-dislike">
                {/* Like and Dislike */}
                <div className="like-dislike-buttons d-flex ">
                  <button
                    onClick={handleDislikeClick}
                    style={{
                      color: dislikeClicked ? "#2E388A" : "#2E388A",
                      fontSize: "15px",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <i
                      className={`fa${
                        dislikeClicked ? "s" : "r"
                      } fa-thumbs-down`}
                    />
                    {dislikeCount}
                  </button>
                  <button
                    onClick={handleLikeClick}
                    style={{
                      color: likeClicked ? "#2E388A" : "#2E388A",
                      fontSize: "15px",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <i
                      className={`fa${likeClicked ? "s" : "r"} fa-thumbs-up`}
                    />
                    {likeCount}
                  </button>
                  <p>| . Bermanfaat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className="review-modal"
      >
        <Modal.Body>
          <div className="modal-film-header">
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`}
              alt={music.title}
              className="film-poster-modal"
            />
            <div className="film-details-col">
              <h4>{music.title}</h4>
              <p className="film-metadata">
                {music.artists} &bull; {music.release_year || music.year} &bull;{" "}
                {music.album}
              </p>
              <div className="genre-container">
                {music.genre1 && (
                  <span className="genre-tag">{music.genre1}</span>
                )}
                {music.genre2 && (
                  <span className="genre-tag">{music.genre2}</span>
                )}
                {music.genre3 && (
                  <span className="genre-tag">{music.genre3}</span>
                )}
              </div>
            </div>
            <div className="rating-col">
              <p>Bintang</p>
              <p className="rating-score">
                {ratinguser > 0 ? ratinguser * 2 : "?"} / 10
              </p>
              <div className="stars-interactive">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <span
                      key={index}
                      className={starValue <= ratinguser ? "star-filled" : ""}
                      onClick={() => setRatinguser(starValue)}
                    >
                      ☆
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <Form className="mt-4">
            <Form.Control
              type="text"
              placeholder="Masukkan Judul Ulasan Anda"
              value={titleReview}
              onChange={(e) => setTitleReview(e.target.value)}
              className="title-input"
            />

            <div className="custom-form-group">
              <textarea
                id="plotReview"
                rows="3"
                placeholder="Masukkan ulasan Anda"
                value={plotReview}
                onChange={(e) => setPlotReview(e.target.value)}
              ></textarea>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-custom btn-cancel" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button className="btn-custom btn-submit" onClick={handleSubmit}>
            Kirim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewMusicsComponent;
