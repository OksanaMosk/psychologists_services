import React, { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Backdrop from '../Backdrop/Backdrop';

import css from './ModalMakeAnAppointment.module.css';

const ModalMakeAnAppointment = ({ isOpen, onClose, avatar_url, name }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
  };

  const modalRef = useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const closeModal = () => {
    setTimeout(() => {
      onClose();
    }, 300);
  };

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

  return ReactDOM.createPortal(
    <>
      {isOpen && <Backdrop onClick={onClose} />}
      <div className={css.modalContainer}>
        <div
          className={`${css.modal} ${isOpen ? css.open : ''}`}
          ref={modalRef}
        >
          <button className={css.closeButton} onClick={closeModal}>
            &times;
          </button>
          <h3 className={css.formTitle}>
            Make an appointment with a psychologist
          </h3>
          <p className={css.formWelcome}>
            You are on the verge of changing your life for the better. Fill out
            the short form below to book your personal appointment with a
            professional psychologist. We guarantee confidentiality and respect
            for your privacy.
          </p>
          <div className={css.name}>
            <img className={css.nameImg} src={avatar_url} alt={`${name}`} />
            <div className={css.about}>
              <h4 className={css.nameTitle}>Your psychologist</h4>
              <p className={css.nameAbout}>{name}</p>
            </div>
          </div>
          <Formik
            initialValues={{
              name: '',
              email: '',
              date: '',
              time: '',
              phone: '',
              comment: '',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Required'),
              email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
              date: Yup.date().required('Required'),
              time: Yup.string().required('Required'),
              phone: Yup.string().required('Required'),
              comment: Yup.string().required('Required'),
            })}
            onSubmit={({ setSubmitting }) => {
              setSubmitting(false);
            }}
          >
            <Form>
              <div className={css.form}>
                <ErrorMessage
                  className={css.errorMessage}
                  name="comment"
                  component="div"
                />

                <Field
                  placeholder="Name"
                  className={css.formInput}
                  type="text"
                  id="name"
                  name="name"
                />
              </div>
              <div className={css.formInform}>
                <Field
                  className={css.formFild}
                  placeholder="+380"
                  type="phone"
                  id="phone"
                  name="phone"
                />

                <div className={css.formSelect}>
                  <select
                    className={css.select}
                    value={selectedFilter || '00:00'}
                    onChange={handleFilterChange}
                  >
                    {[
                      'Meeting time',
                      '09:00',
                      '09:30',
                      '10:00',
                      '10:30',
                      '11:00',
                      '11:30',
                      '12:00',
                      '12:30',
                      '13:00',
                      '13:30',
                      '14:00',
                      '14:30',
                      '15:00',
                      '15:30',
                      '16:00',
                      '16:30',
                      '17:00',
                    ].map((time, index) => (
                      <option className={css.options} key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <svg
                    className={css.optionSvg}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="var(--button-background-color)"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_29_439)">
                      <path
                        d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6024 18.3332 10C18.3332 5.39763 14.6022 1.66667 9.99984 1.66667C5.39746 1.66667 1.6665 5.39763 1.6665 10C1.6665 14.6024 5.39746 18.3333 9.99984 18.3333Z"
                        stroke="#191A15"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 5V10L13.3333 11.6667"
                        stroke="#191A15"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_29_439">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>

              <div>
                <Field
                  placeholder="Email"
                  className={css.formInput}
                  type="email"
                  id="email"
                  name="email"
                />
              </div>
              <div>
                <label htmlFor="comment"></label>
                <Field
                  placeholder="Comment"
                  className={css.textarea}
                  as="textarea"
                  id="comment"
                  name="comment"
                />
              </div>
              <button type="button" className={css.submitButton}>
                Send
              </button>
            </Form>
          </Formik>
        </div>
        <div onClick={closeModal}></div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default ModalMakeAnAppointment;
