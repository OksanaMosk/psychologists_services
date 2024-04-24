import React, { useState, useEffect, useRef } from 'react';

import ReactDOM from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Backdrop from '../Backdrop/Backdrop';

import css from './ModalMakeAnAppointment.module.css';

const ModalMakeAnAppointment = ({ isOpen, onClose, name }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
  };

  const modalRef = useRef(null);
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
          <div>
            <h4>Your psychologist</h4>
            <p>{name}</p>
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
            onSubmit={(values, { setSubmitting }) => {
              console.log('Form data:', values);
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
                <label htmlFor="name"></label>
                <Field
                  placeholder="Name"
                  className={css.formInput}
                  type="text"
                  id="name"
                  name="name"
                />
              </div>

              <div>
                <label htmlFor="phone"></label>
                <Field
                  placeholder="+380"
                  className={css.formIn}
                  type="phone"
                  id="phone"
                  name="phone"
                />
              </div>
              <div>
                <h5>Meeting time</h5>
                <select
                  value={selectedFilter}
                  className={css.formIn}
                  onChange={handleFilterChange}
                >
                  <option value="">00 : 00</option>
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
              </div>
              <div>
                <label htmlFor="email"></label>
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
                  className={css.formInput}
                  as="textarea"
                  id="comment"
                  name="comment"
                />
              </div>
              <button type="button" className={css.submitButton}></button>
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
