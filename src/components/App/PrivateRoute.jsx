import { useSelector } from 'react-redux';
import { selectAuthenticated } from 'redux/auth/auth.selector';

const PrivateRoute = ({ children }) => {
  const authenticated = useSelector(selectAuthenticated);
  if (authenticated) {
    return children;
  }
};

export default PrivateRoute;
