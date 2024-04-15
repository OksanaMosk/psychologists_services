import React from 'react';
import css from './BackdropHome.module.css';

const BackdropHome = ({ onClick }) => (
  <div className={css.backdrop} onClick={onClick}></div>
);

export default BackdropHome;
