import { NavLink } from 'react-router-dom';

import css from './Header.module.css';

export const Header = () => {
  return (
    <div className={css.header}>
      <div className={css.links}>
        <NavLink className={css.toLink} to="/catalog">
          Catalog
        </NavLink>
        <NavLink className={css.toLink} to="/favorites">
          Faforites cars
        </NavLink>
      </div>
      <div className={css.mainTit}>
        <h1 className={css.mainTitle}>Rentalcars</h1>
      </div>
    </div>
  );
};
