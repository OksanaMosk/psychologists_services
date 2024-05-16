import Backdrop from '../Backdrop/Backdrop';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../../redux/auth/auth.selector';

import { registerThunk, loginThunk } from 'redux/auth/auth.reducer';
import Notiflix from 'notiflix';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import css from './ModalWindow.module.css';

const ModalWindow = ({ isOpen, onClose, type }) => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const userId = userData ? userData.uid : null;

  console.log('🚀 ~ ModalWindow ~ userId:', userId);

  const handleSubmit = async (values, userId, form) => {
    try {
      if (type === 'register') {
        try {
          const { ...loginValues } = values;
          console.log('🚀 ~ handleSubmit ~ loginValues:', loginValues);

          console.log('🚀 ~ handleSubmit ~ userId:', userId);
          const registerResult = await dispatch(registerThunk(values));

          console.log('Parsed userId:', JSON.stringify({ userId }));
          localStorage.setItem(
            'auth',
            JSON.stringify({ ...userData, ...loginValues }),
            () => {
              console.log('Updated userId:', userData.uid);
            }
          );
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
            Notiflix.Notify.success(`Welcome ${values.name}!`, {
              css: {
                color: 'black', // Зміна кольору тексту на червоний
              },
            });
          }
        } catch (error) {
          Notiflix.Notify.failure('Something went wrong ');
        }
      } else if (type === 'login') {
        try {
          const { name, ...loginValues } = values;

          const loginResult = await dispatch(loginThunk(loginValues));

          if (
            loginResult.error &&
            (loginResult.error.code = 'auth/invalid-credential')
          ) {
            console.log(
              'TCL: handleSubmit -> loginResult.error.code',
              loginResult.error.code
            );
            Notiflix.Notify.failure(
              'Incorrect email or password. Please try again.'
            );
          } else {
            onClose();
            if (form && form.resetForm) {
              form.resetForm();
            }
            localStorage.setItem(
              'auth',
              JSON.stringify({ ...userData, ...loginValues }),
              () => {
                console.log('Updated userId:', userData.uid);
              }
            );

            Notiflix.Notify.success(`Welcome back ${values.email}!`);
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
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            validationSchema={Yup.object({
              name: type === 'register' ? Yup.string().required() : null,
              email: Yup.string().email('Invalid email format').required(),
              password: Yup.string().required('more then 6 symbols'),
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
