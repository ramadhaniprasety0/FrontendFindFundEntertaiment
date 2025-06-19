import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');  
  const userRole = localStorage.getItem('userRole'); 

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Memeriksa apakah pengguna memiliki peran admin
  if (userRole !== 'admin') {
    Swal.fire({
      title: 'Akses Ditolak',
      text: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    return <Navigate to="/" />;
  }

  return <Outlet />;  // Menampilkan konten halaman yang dilindungi jika token ada dan pengguna adalah admin
};

export default PrivateRoute;
