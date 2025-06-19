import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row } from "react-bootstrap";
import MusicsArtistProfile from "../../components/MusicComponentsHome/MusicsArtistProfile";
import KonserMusicArtistComponent from "../../components/MusicComponentsHome/KonserMusicArtistComponent";
import { Link } from "react-router-dom";
import api from "../../api/axios"

const DetailMusicsPage = () => {
  const { id } = useParams();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusicDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Menggunakan api yang sudah diimpor
        const response = await api.get(`/music/${id}?include=all`);

        if (response.data && response.data.data) {
          setMusic(response.data.data);
        } else {
          throw new Error(
            "Format data API tidak sesuai atau data tidak ditemukan."
          );
        }
      } catch (err) {
        console.error("Error fetching music detail:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMusicDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Memuat detail musik...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  if (!music) {
    return (
      <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
        <h2>Musik tidak ditemukan</h2>
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 detail-lagu-page homepage-profile-artist">
      <Container>
        <Row className="row mt-5 mb-4">
          <div className="col-md-3">
          <img
                src={
                  `${import.meta.env.VITE_API_URL_IMAGE}/${music.image}` ||
                  "https://placehold.co/300x300/EBF4FA/1F2937?text=No+Cover"
                }
                alt={music.title || "Cover Lagu"}
                className="detail-cover-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/300x300/EBF4FA/1F2937?text=Error";
                }}
              />
          </div>
          <div className="col-md-9">
            <h6>Artist</h6>
            <h2>{music.artists.split(',')[0].trim()}</h2>
            <p>{music.bio}</p>
          </div>
        </Row>
        <Row className="box-populer-musics p-3 m-1 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1>
                <b>Musik Populer</b>
              </h1>
            </div>
            <MusicsArtistProfile artistId={music.artistId.split(',')[0].trim()} limit={10} />
        </Row>

        <Row className="box-populer-musics p-3 m-1 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1>
                <b>Konser Musik</b>
              </h1>
            </div>
            <KonserMusicArtistComponent artistId={music.artistId.split(',')[0].trim()} limit={4} />
        </Row>
      </Container>
    </div>
  );
};

export default DetailMusicsPage;
