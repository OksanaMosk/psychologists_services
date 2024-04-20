import Backdrop from '../Backdrop/Backdrop';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { registerThunk } from 'redux/auth/auth.reducer';
import { loginThunk } from 'redux/auth/auth.reducer';
import Notiflix from 'notiflix';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import * as Yup from 'yup';
import css from './ModalWindow.module.css';

const ModalWindow = ({ isOpen, onClose, type }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, form) => {
    try {
      console.log('Form values:', values);
      if (type === 'register') {
        console.log('Register values:', values);

        const auth = getAuth();

        // Отримання списку методів входу для вказаного електронного адресу
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          values.email
        );

        // Перевірка, чи є користувач з вказаним електронним адресом
        if (signInMethods.length > 0) {
          // Якщо signInMethods містить методи входу, це означає, що користувач з таким електронним листом вже існує
          Notiflix.Notify.failure('User with this email already exists.');
          console.log('User with this email already exists:', values.email);
          return; // Перервати обробку
        }

        const { name, ...loginValues } = values;
        console.log('Dispatching registerThunk:', loginValues);
        await dispatch(registerThunk(values));
        Notiflix.Notify.success(`Welcome ${values.name}!`);
        console.log('Registration successful:', values.email);
      } else if (type === 'login') {
        console.log('Login values:', values);
        // Видалення поля "ім'я" з даних, переданих для входу
        const { name, ...loginValues } = values;
        console.log('Dispatching loginThunk:', loginValues);
        await dispatch(loginThunk(loginValues));
        Notiflix.Notify.success(`Welcome back, ${values.name}!`);
        console.log('Login successful:', values.name);
      }
      onClose(); // Закриття форми в будь-якому випадку, коли операція завершена
      if (form && form.resetForm) {
        form.resetForm();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Notiflix.Notify.failure('This email is already in use.');
      } else {
        Notiflix.Notify.failure(
          'Something went wrong... User registration failed.'
        );
      }
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
              name:
                type === 'register'
                  ? Yup.string().required('Name is required')
                  : null,
              email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={(values, formikProps) => {
              handleSubmit(values, formikProps);
            }}
          >
            {formikProps => (
              <Form>
                <h3>{type === 'register' ? 'Registration' : 'Log In'}</h3>
                {type === 'register' && (
                  <p>
                    Thank you for your interest in our platform! In order to
                    register, we need some information. Please provide us with
                    the following information.
                  </p>
                )}
                <div className={css.form}>
                  {type === 'register' && (
                    <>
                      <label htmlFor="name">Name</label>
                      <Field type="text" id="name" name="name" />
                      <ErrorMessage name="name" component="div" />
                    </>
                  )}
                  <label htmlFor="email">Email</label>
                  <Field type="email" id="email" name="email" />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div className={css.form}>
                  <label htmlFor="password">Password</label>
                  <Field type="password" id="password" name="password" />
                  <ErrorMessage name="password" component="div" />
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
