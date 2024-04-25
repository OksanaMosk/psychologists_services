import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

import error1 from 'images/icons8-no-yelling-100.png';

import css from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const location = useLocation();
  const backLinkRef = useRef('/');
  return (
    <div className={css.contactsContainer}>
      <NavLink
        state={{ from: location }}
        className={css.goBack}
        to={backLinkRef.current}
      >
        Go Home
      </NavLink>
      <h2 className={css.errorMainTitle}>Opssss...Error...</h2>
      <div className={css.errorAbout}>
        <img src={error1} alt="{svgDelete}" width={200} height={200}></img>
      </div>
    </div>
  );
};
export default NotFoundPage;
