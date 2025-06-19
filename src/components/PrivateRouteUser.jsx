import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRouteUser = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    Swal.fire({
      title: 'Anda harus login terlebih dahulu',
      text: 'Silakan login untuk melanjutkan.',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;  
};

export default PrivateRouteUser;
