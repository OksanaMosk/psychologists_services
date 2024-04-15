import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

import error1 from 'images/icons8-no-yelling-100.png';

import css from './Page404.module.css';

const Page404Fetch = () => {
  const location = useLocation();
  const backLinkRef = useRef('/');
  return (
    <div>
      <NavLink
        state={{ from: location }}
        className={css.goBack}
        to={backLinkRef.current}
      >
        Go Home
      </NavLink>
      <h2 className={css.errorMainTitle}>Opssss...Error...</h2>
      <div className={css.errorAbout}>
        <div className={css.errorSection}>
          <h3 className={css.errorTitle}>The bad news</h3>
          <p className={css.error}>Your contacts are lost somewhere...</p>
          <img src={error1} alt="{svgDelete}" width={200} height={200}></img>
        </div>
        <div className={css.errorSection}>
          <h3 className={css.errorTitle}>The good news</h3>
          <p className={css.error}> They will definitely come back!</p>
        </div>
      </div>
    </div>
  );
};
export default Page404Fetch;
