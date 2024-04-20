import { useSelector } from 'react-redux';
import LoginForm from './LoginForm'; // Припустимо, що у вас є компонент LoginForm для входу

import { selectAuthenticated } from 'redux/auth/auth.selectors';

const PrivateRoute = ({ children }) => {
  const authenticated = useSelector(selectAuthenticated);

  return authenticated ? (
    children
  ) : (
    <ModalForm isOpen={!authenticated} onClose={closeModal} type="login" />
  );
};

export default PrivateRoute;
