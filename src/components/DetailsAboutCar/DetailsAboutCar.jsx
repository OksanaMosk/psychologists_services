// import css from './DetailsAboutCar.module.css';

// import React, { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const Modal = ({ onClose }) => {
//   const [showModal, setShowModal] = useState(true);

//   const handleClose = () => {
//     setShowModal(false);
//     onClose();
//   };

//   const handleBackdropClick = e => {
//     if (e.target === e.currentTarget) {
//       handleClose();
//     }
//   };

//   const handleKeyDown = e => {
//     if (e.key === 'Escape') {
//       handleClose();
//     }
//   };

//   return (
//     <>
//       {showModal && (
//         <div
//           className="modal-backdrop"
//           onClick={handleBackdropClick}
//           onKeyDown={handleKeyDown}
//         >
//           <div className="modal-content">
//             <button className="close-button" onClick={handleClose}>
//               ×
//             </button>
//             <h2>Registration / Login Form</h2>
//             <Formik
//               initialValues={{ email: '', password: '' }}
//               validationSchema={Yup.object({
//                 email: Yup.string()
//                   .email('Invalid email address')
//                   .required('Required'),
//                 password: Yup.string()
//                   .min(6, 'Password must be at least 6 characters')
//                   .required('Required'),
//               })}
//               onSubmit={(values, { setSubmitting }) => {
//                 setTimeout(() => {
//                   alert(JSON.stringify(values, null, 2));
//                   setSubmitting(false);
//                   handleClose();
//                 }, 400);
//               }}
//             >
//               <Form>
//                 <div className="form-field">
//                   <label htmlFor="email">Email:</label>
//                   <Field type="email" name="email" />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="error"
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label htmlFor="password">Password:</label>
//                   <Field type="password" name="password" />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="error"
//                   />
//                 </div>
//                 <button type="submit">Submit</button>
//               </Form>
//             </Formik>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleModalOpen = () => {
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="App">
//       <button onClick={handleModalOpen}>Open Modal</button>
//       {isModalOpen && <Modal onClose={handleModalClose} />}
//     </div>
//   );
// };

// export default App;
