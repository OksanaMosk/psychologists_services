import Backdrop from '../Backdrop/Backdrop';
import React, { useRef, useEffect, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  console.log('🚀 ~ ModalWindow ~ userId:', userId);

  const handleSubmit = async (values, userId, form) => {
    try {
      if (type === 'register') {
        try {
          const { name, ...loginValues } = values;
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

            Notiflix.Notify.success(`Welcome ${values.name}!`);
          }
        } catch (error) {
          Notiflix.Notify.failure('Something went wrong ');
        }
      } else if (type === 'login') {
        try {
          const { name, ...loginValues } = values;
          const loginResult = await dispatch(loginThunk(loginValues));

          localStorage.setItem(
            'auth',
            JSON.stringify({ ...userData, ...loginValues }),
            () => {
              console.log('Updated userId:', userData.uid);
            }
          );

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

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

                <div className={css.allForm}>
                  {type === 'register' && (
                    <div className={css.form}>
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
                    </div>
                  )}

                  <div className={css.form}>
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
                    <Field
                      className={css.formInput}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Password"
                    />

                    {showPassword ? (
                      <svg
                        className={css.showPassword}
                        onClick={() => setShowPassword(false)}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_33_590)">
                          <path
                            d="M14.95 14.95C13.5255 16.0358 11.791 16.6374 10 16.6667C4.16671 16.6667 0.833374 10 0.833374 10C1.86995 8.06825 3.30765 6.38051 5.05004 5.05M8.25004 3.53333C8.82365 3.39907 9.41093 3.33195 10 3.33333C15.8334 3.33333 19.1667 10 19.1667 10C18.6609 10.9463 18.0576 11.8373 17.3667 12.6583M11.7667 11.7667C11.5378 12.0123 11.2618 12.2093 10.9552 12.3459C10.6485 12.4826 10.3175 12.556 9.98178 12.562C9.64611 12.5679 9.31268 12.5061 9.00138 12.3804C8.69009 12.2547 8.40731 12.0675 8.16991 11.8301C7.93252 11.5927 7.74537 11.31 7.61963 10.9987C7.4939 10.6874 7.43215 10.3539 7.43807 10.0183C7.44399 9.68258 7.51747 9.35154 7.65411 9.04487C7.79075 8.73821 7.98775 8.46221 8.23338 8.23333"
                            stroke="#191A15"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M0.833374 0.833336L19.1667 19.1667"
                            stroke="#191A15"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>

                        <defs>
                          <clipPath id="clip0_33_590">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    ) : (
                      <svg
                        className={css.showPassword}
                        onClick={() => setShowPassword(true)}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_33_593)">
                          <path
                            d="M0.833374 10C0.833374 10 4.16671 3.33334 10 3.33334C15.8334 3.33334 19.1667 10 19.1667 10C19.1667 10 15.8334 16.6667 10 16.6667C4.16671 16.6667 0.833374 10 0.833374 10Z"
                            stroke="#191A15"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                            stroke="#191A15"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>

                        <defs>
                          <clipPath id="clip0_33_593">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    )}

                    <ErrorMessage
                      className={`${css.errorMessage}`}
                      name="password"
                      component="div"
                    />
                  </div>
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
