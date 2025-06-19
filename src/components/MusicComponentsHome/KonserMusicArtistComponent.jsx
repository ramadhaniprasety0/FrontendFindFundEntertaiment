// src/components/KonserTerbaruComponent.js
import React, { useState, useEffect } from "react";
import { Col, Row, Spinner } from 'react-bootstrap';
import api from "../../api/axios";
import { Link } from "react-router-dom";

const KonserMusicArtistComponent = ({artistId}) => {
  const [konser, setKonser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKonserTerbaru = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/artist/${artistId}/konser`);

        if (!response.data) {
          throw new Error(`Gagal mengambil data, status: ${response.status}`);
        }

        const konserData = response.data.data || response.data;

        if (!Array.isArray(konserData)) {
          throw new Error("Format data dari API tidak sesuai. Diharapkan array.");
        }

        const sortedKonser = [...konserData].sort((a, b) => b.id - a.id);
        
        const latestFourKonser = sortedKonser.slice(0, 4);

        setKonser(latestFourKonser);

      } catch (e) {
        console.error("Gagal mengambil data konser:", e);
        setError(e.message || "Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchKonserTerbaru();
  }, []); 
  
  const limitDescriptionWords = (deskripsi_acara, wordLimit) => {
    if (!deskripsi_acara) return "Deskripsi tidak tersedia.";
    const words = deskripsi_acara.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return deskripsi_acara;
  };

  // Tampilan saat loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <Spinner animation="border" />
        <span className="ms-2">Memuat konser terbaru...</span>
      </div>
    );
  }

  // Tampilan saat error
  if (error) {
    return <div className="text-center my-5 text-danger">Error: {error}</div>;
  }
  
  // Tampilan jika tidak ada data
  if (!konser || konser.length === 0) {
    return (
        <div className="text-center my-5">Tidak ada konser yang sedang berlangsung..</div>
    );
  }

  // Render 4 card konser
  return (
    <>
      {konser.map((item) => {
        const truncatedDesc = limitDescriptionWords(item.deskripsi_acara, 5);

        return (
          <Row key={item.id} className="d-flex align-items-center mb-4 text-center " style={{ padding: '10px', borderTop: '1px solid black' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <img src={`${import.meta.env.VITE_API_URL_IMAGE}/${item.image}`} alt={item.nama_konser} className='img-fluid' style={{ borderRadius: '8px', objectFit: 'cover', height: '100px' }} />          
              <h4 className="text-white">
                {item.tanggal 
                  ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Tanggal Acara"}
              </h4>
              <h4 className="text-white">{item.nama_konser}</h4>
              <h4 className="text-white">{item.lokasi}</h4>
              <Link to={`/music/konser/detail/${item.id}`} className="btn btn-primary">
                Lihat Detail
              </Link>
            </div>
          </Row>
        );
      })}
    </>
  );
};

export default KonserMusicArtistComponent;