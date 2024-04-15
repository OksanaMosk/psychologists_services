import React, { useRef, useEffect } from 'react';
import Close from '../../images/delete.png';
import css from './ModalWindow.module.css';
import Backdrop from '../Backdrop/Backdrop';
import { createPortal } from 'react-dom';

export default function ModalWindow({
  open,
  onClose,
  data,

  id,
  year,
  make,
  model,
  type,
  img,
  accessories,
  rentalPrice,
  rentalCompany,
  address,
  engineSize,
  description,
  rentalConditions,
  fuelConsumption,
  mileage,
  functionalities,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const partsOfAddress = address.split(', ');

  return createPortal(
    <>
      {open && <Backdrop onClick={onClose} />}
      <div
        className={css.modalContent}
        ref={modalRef}
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <div className={css.modaC}>
            <button className={css.closeIcon} onClick={onClose}>
              <img src={Close} alt="Close button" width={24} height={24} />
            </button>
            <img
              src={img}
              alt={make}
              className={css.carImage}
              style={{ width: '468', height: '248', objectFit: 'cover' }}
            />
            <div className={css.modalTextWrap}>
              <h3 className={css.title}>
                {make} {model && <span className={css.title}>{model},</span>}{' '}
                {year}
              </h3>
              <ul className={css.aboutPart}>
                <li className={css.price}>{partsOfAddress[1]}</li>|
                <li>{partsOfAddress[2]}</li>|
                <li className={css.price}>Id: {id}</li>|
                <li className={css.price}>Year: {year}</li>|
                <li className={css.price}>Type: {type}</li>
              </ul>
              <ul className={css.aboutPart}>
                <li className={css.price}>
                  Fuel Consumption: {fuelConsumption}
                </li>
                |<li className={css.price}>Engine Size: {engineSize}</li>
              </ul>
              <p className={css.description}>{description}</p>
              <p className={css.infoTitle}>Accessories and functionalities:</p>
              <ul className={css.aboutPart}>
                {accessories.map((item, index) => (
                  <li className={css.price} key={index}>
                    {item}|
                  </li>
                ))}
              </ul>
              <ul className={css.aboutPart}>
                {functionalities.map((item, index) => (
                  <li className={css.price} key={index}>
                    <span> {'| '}</span> {item}
                  </li>
                ))}
              </ul>
              <p className={css.infoRent}>Rental Conditions:</p>
              <div className={css.conditionList}>
                <ul className={css.conditionTist}>
                  {rentalConditions.split('\n').map((part, partIndex) => (
                    <li className={css.cond} key={partIndex}>
                      {part}
                    </li>
                  ))}
                </ul>
                <ul className={css.conditionPart}>
                  <li className={css.cond}>
                    Mileage: {mileage.toLocaleString('en-US')}
                  </li>
                  <li className={css.cond}>Price: {rentalPrice}</li>
                </ul>
              </div>
            </div>
            <button
              className={css.button}
              text="Rental car"
              width="168px"
              onClick={() => {
                window.location.href = 'tel:+380730000000';
              }}
            >
              Rental car
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
