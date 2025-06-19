// src/components/MusicComponentsHome/PopularComponentMusic.js
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap"; // Col dan Row tidak lagi digunakan di sini
import api from "../../api/axios";
import { Link } from "react-router-dom";

// Komponen menerima props filter dari induk
const PopularComponentMusic = ({ 
  activeFilter = 'Lihat Semua', 
  selectedGenre = '', 
  ratingSortDirection = 'desc',
  onGenresLoaded
}) => {
  const [originalFilms, setOriginalFilms] = useState([]);
  const [displayedFilms, setDisplayedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk mengambil data (berjalan sekali)
  useEffect(() => {
    const getFilmData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/films/?include=all");

        if (data && Array.isArray(data.data)) {
          setOriginalFilms(data.data);

          // Panggil callback untuk mengirim genre ke parent
          if (onGenresLoaded) {
            const allGenres = [];
            data.data.forEach(music => {
              if (music.genre1) allGenres.push(music.genre1);
              if (music.genre2) allGenres.push(music.genre2);
              if (music.genre3) allGenres.push(music.genre3);
            });
            const uniqueGenres = [...new Set(allGenres)];
            onGenresLoaded(uniqueGenres);
          }
        } else {
          throw new Error("Format data dari API tidak sesuai.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getFilmData();
  }, [onGenresLoaded]);

  // useEffect untuk memfilter dan sorting data (berjalan saat filter berubah)
  useEffect(() => {
    if (originalFilms.length === 0 && !loading) return; 

    let processedFilms = [...originalFilms];

    if (activeFilter === 'Genre' && selectedGenre) {
      processedFilms = processedFilms.filter(film => 
        film.genre1 === selectedGenre ||
        film.genre2 === selectedGenre ||
        film.genre3 === selectedGenre
      );
    }

    switch (activeFilter) {
      case 'Lihat Semua':
        processedFilms.sort((a, b) => a.id - b.id);
        break;
      case 'Terbaru':
        processedFilms.sort((a, b) => b.id - a.id);
        break;
      case 'Rating':
        processedFilms.sort((a, b) => 
          ratingSortDirection === 'desc' ? (b.rating || 0) - (a.rating || 0) : (a.rating || 0) - (b.rating || 0)
        );
        break;
      default:
        break;
    }
    
    setDisplayedFilms(processedFilms);
  }, [activeFilter, selectedGenre, ratingSortDirection, originalFilms, loading]);


  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') return '';
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Tampilan loading, error, dan data kosong tetap sama
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Memuat musik...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }

  if (!displayedFilms || displayedFilms.length === 0) {
    return <div className="text-center my-5">Tidak ada film untuk ditampilkan sesuai filter ini.</div>;
  }

  return (
    // --- PERBAIKAN: KEMBALIKAN KE STRUKTUR HORIZONTAL SCROLL ---
    <div className="film-section">
      <div className="film-card-container">
        {displayedFilms.map((film) => (
          <div key={film.id} className="film-card">
            <div className="film-image-wrapper">
              <img
                src={`${import.meta.env.VITE_API_URL_IMAGE}/${film.image}`}
                alt={film.title || "Gambar Film"}
                className="film-image"
                style={{height: '400px'}}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/280x266/EBF4FA/1F2937?text=Error";
                }}
              />
            </div>
            <div className="film-info d-flex flex-column gap-2">
              <div>
                <span className="film-genre">{film.genre1}</span>
              </div>
              <div>
                <h3 className="film-title">{film.title}</h3>
              </div>
              <div>
                <p className="film-description">{truncateText(film.deskripsi, 100)}</p>
              </div>
              <div>
                <Link to={`/films/detail/${film.id}`} className="film-button">Lihat  <span>›</span></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    // --- AKHIR PERUBAHAN JSX ---
  );
};

export default PopularComponentMusic;