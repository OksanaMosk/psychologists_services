import React from 'react';
import { PsychologistsElement } from '../PsychologistsElement/PsychologistsElement ';
import css from './PsychologistsList.module.css';

export const PsychologistsList = ({ doctors }) => {
  return (
    <div className={css.homeContainer}>
      <ul className={css.homeList}>
        {doctors.map(doctors => (
          <PsychologistsElement key={doctors.name} {...doctors} />
        ))}
      </ul>
    </div>
  );
};
