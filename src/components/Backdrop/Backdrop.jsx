import React from 'react';
import css from './Backdrop.module.css';

const Backdrop = ({ onClick }) => (
  <div className={css.backdrop} onClick={onClick}></div>
);

export default Backdrop;
