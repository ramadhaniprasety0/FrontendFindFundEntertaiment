import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; // pastikan path ke file API-mu benar

const MusicsArtistProfile = ({ artistId }) => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId) return;

    const fetchMusics = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/artists/${artistId}/music`);

        if (data && Array.isArray(data.data)) {
          setMusics(data.data);
        } else {
          throw new Error("Data musik tidak sesuai format yang diharapkan.");
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan saat memuat musik.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, [artistId]);

  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

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

  if (musics.length === 0) {
    return <div className="text-center my-5">Tidak ada musik dari artis ini.</div>;
  }

  return (
    <div className="horizontal-scroll-wrapper">
      <div className="horizontal-scroll-content">
        {musics.map((music) => (
          <div key={music.id} className="music-popular-item-scroll">
            <Link to={`/Music/${music.id}`} className="text-decoration-none">
              <div className="music-popular-card h-100">
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}/${music.image}`}
                  alt={music.title || 'Gambar Musik'}
                  className="music-popular-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/280x266/EBF4FA/1F2937?text=Error';
                  }}
                />
                <div className="music-popular-info">
                  <p className="music-popular-title">{truncateText(music.title, 20)}</p>
                  <p className="music-popular-artist">
                    {truncateText(music.artist_name, 25) || 'Artis Tidak Ada'}
                  </p>
                  <div className="music-popular-controls">
                    <div className="icon-group-left">
                      <i className="fa-regular fa-heart"></i>
                    </div>
                    <div className="icon-group-right">
                      <div className="play-button">
                        <i className="fa-solid fa-play"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicsArtistProfile;
