import React from 'react';
import { CarElement } from '../CarElement/CarElement';
import css from './CarList.module.css';

export const CarList = ({ cars }) => {
  return (
    <div className={css.homeContainer}>
      <ul className={css.homeList}>
        {cars.map(car => (
          <CarElement key={car.id} {...car} />
        ))}
      </ul>
    </div>
  );
};
