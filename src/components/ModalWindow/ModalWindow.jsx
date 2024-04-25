import Backdrop from '../Backdrop/Backdrop';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { registerThunk } from 'redux/auth/auth.reducer';
import { loginThunk } from 'redux/auth/auth.reducer';
import Notiflix from 'notiflix';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import css from './ModalWindow.module.css';

const ModalWindow = ({ isOpen, onClose, type }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, form) => {
    try {
      if (type === 'register') {
        try {
          const { name, ...loginValues } = values;
          console.log('loginValues:', loginValues);
          const registerResult = await dispatch(registerThunk(values));

          if (
            registerResult.error &&
            (registerResult.error.code = 'auth/email-already-in-use')
          ) {
            Notiflix.Notify.failure('This email is already in use.');
          } else {
            onClose();
            if (form && form.resetForm) {
              form.resetForm();
            }
            Notiflix.Notify.success(`Welcome ${values.name}!`);
          }
        } catch (error) {
          Notiflix.Notify.failure('Something went wrong ');
        }
      } else if (type === 'login') {
        try {
          const { name, ...loginValues } = values;
          console.log('loginValues:', loginValues);

          const loginResult = await dispatch(loginThunk(loginValues));

          if (
            loginResult.error &&
            (loginResult.error.code = 'auth/invalid-credential')
          ) {
            Notiflix.Notify.failure(
              'Incorrect email or password. Please try again.'
            );
          } else {
            onClose();
            if (form && form.resetForm) {
              form.resetForm();
            }

            Notiflix.Notify.success(`Welcome back ${values.name}!`);
          }
        } catch (error) {
          Notiflix.Notify.failure('Something went wrong... ');
        }
      }
    } catch (error) {
      Notiflix.Notify.failure(
        'Something went wrong... User registration/login failed.'
      );
    }
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
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              name: type === 'register' ? Yup.string().required() : null,
              email: Yup.string().email('Invalid email format').required(),
              password: Yup.string().required('more then 8 symbols'),
            })}
            onSubmit={(values, formikProps) => {
              handleSubmit(values, formikProps);
            }}
          >
            {formikProps => (
              <Form>
                <h3 className={css.formTitle}>
                  {type === 'register' ? 'Registration' : 'Log In'}
                </h3>
                {type === 'register' && (
                  <p className={css.formWelcome}>
                    Thank you for your interest in our platform! In order to
                    register, we need some information. Please provide us with
                    the following information.
                  </p>
                )}
                {type === 'login' && (
                  <p className={css.formWelcome}>
                    Welcome back! Please enter your credentials to access your
                    account and continue your search for a psychologist.
                  </p>
                )}

                <div className={css.form}>
                  {type === 'register' && (
                    <>
                      <label htmlFor="name"></label>
                      <Field
                        className={css.formInput}
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                      />
                      <ErrorMessage
                        className={css.errorMessage}
                        name="name"
                        component="div"
                      />
                    </>
                  )}
                  <label htmlFor="email"></label>
                  <Field
                    className={css.formInput}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    className={css.errorMessage}
                    component="div"
                  />
                </div>
                <div className={css.form}>
                  <label htmlFor="password"></label>
                  <Field
                    className={css.formInput}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    className={css.errorMessage}
                    name="password"
                    component="div"
                  />
                </div>
                <button type="submit" className={css.submitButton}>
                  {type === 'register' ? 'Sign up' : 'Log In'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div onClick={closeModal}></div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default ModalWindow;
