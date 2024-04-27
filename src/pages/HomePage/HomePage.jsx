import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import css from './HomePage.module.css';

import hero from '../../images/image (2).png';

const HomePage = () => {
  const [randomColor1, setRandomColor1] = useState('');
  const [randomColor2, setRandomColor2] = useState('');

  useEffect(() => {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const colors = ['#3470ff', '#fc832c', '#54be96'];

    const randomIndex1 = getRandomInt(0, colors.length - 1);
    let randomIndex2 = getRandomInt(0, colors.length - 1);

    while (randomIndex2 === randomIndex1) {
      randomIndex2 = getRandomInt(0, colors.length - 1);
    }

    const randomColor1 = colors[randomIndex1];
    const randomColor2 = colors[randomIndex2];
    setRandomColor1(randomColor1);
    setRandomColor2(randomColor2);
  }, []);

  return (
    <div className={css.homeContainer}>
      <div className={css.left}>
        <p className={css.about}>
          The road to the
          <span>
            {''} depths {''}
          </span>
          of the human soul
        </p>
        <p className={css.aboutDetails}>
          We help you to reveal your potential, overcome challenges and find a
          guide in your own life with the help of our experienced psychologists.
        </p>
        <NavLink className={css.toLink} to="/psychologists">
          Get started
          <svg
            className={css.toSvg}
            width="15"
            height="17"
            viewBox="0 0 15 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8229 1.6731C12.7461 1.12619 12.2404 0.745143 11.6935 0.822006L2.78109 2.07456C2.23418 2.15143 1.85313 2.6571 1.92999 3.20401C2.00685 3.75092 2.51252 4.13196 3.05943 4.0551L10.9816 2.94172L12.095 10.8639C12.1718 11.4108 12.6775 11.7918 13.2244 11.715C13.7713 11.6381 14.1524 11.1324 14.0755 10.5855L12.8229 1.6731ZM1.79864 16.7895L12.6313 2.41409L11.034 1.21046L0.201365 15.5859L1.79864 16.7895Z"
              fill="#FBFBFB"
            />
          </svg>
        </NavLink>
      </div>
      <div className={css.right}>
        <img className={css.hero} src={hero} alt="hero" />
        <div className={css.heroPart}>
          <div className={css.rightOk}>
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 5.5L0 8L7.5 15.5L20 3L17.5 0.5L7.5 10.5L2.5 5.5Z"
                fill="var(--button-background-color)"
              />
            </svg>
          </div>
          <div className={css.heroImg}>
            <h6 className={css.heroImgTitle}>Experienced psychologists</h6>
            <p className={css.heroImgP}>15,000</p>
          </div>
        </div>
        <div style={{ background: randomColor1 }} className={css.heroImgDet}>
          ?
        </div>
        <div style={{ background: randomColor2 }} className={css.heroImgDet2}>
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.8771 12.6007L11.4493 14.1973L0.272788 11.2026L0.700607 9.60593C0.700607 9.60593 1.55625 6.41264 7.1445 7.91001C12.7328 9.40738 11.8771 12.6007 11.8771 12.6007ZM11.1151 4.26792C11.2632 3.7153 11.2441 3.13117 11.0602 2.58941C10.8763 2.04766 10.5359 1.5726 10.082 1.22431C9.62807 0.876027 9.08109 0.670159 8.51019 0.632741C7.9393 0.595322 7.37013 0.728034 6.87466 1.01409C6.37919 1.30015 5.97967 1.72672 5.72663 2.23984C5.47358 2.75295 5.37838 3.32959 5.45306 3.89681C5.52774 4.46404 5.76894 4.99638 6.14616 5.42653C6.52339 5.85667 7.01969 6.16529 7.57232 6.31337C8.31337 6.51193 9.10294 6.40798 9.76735 6.02439C10.4318 5.64079 10.9166 5.00897 11.1151 4.26792ZM12.6849 9.39455C13.0739 9.90585 13.3461 10.4962 13.4824 11.124C13.6187 11.7518 13.6157 12.4019 13.4738 13.0285L13.0459 14.6251L16.2392 15.4808L16.667 13.8841C16.667 13.8841 17.4435 10.9862 12.6849 9.39455ZM13.8596 2.00857C13.3109 1.85828 12.7295 1.87856 12.1927 2.06674C12.496 2.87424 12.5391 3.75644 12.3159 4.58966C12.0926 5.42288 11.6142 6.16534 10.9477 6.71297C11.3185 7.14437 11.8119 7.45265 12.3623 7.59683C13.1033 7.79539 13.8929 7.69144 14.5573 7.30784C15.2217 6.92425 15.7065 6.29243 15.9051 5.55138C16.1036 4.81033 15.9997 4.02076 15.6161 3.35635C15.2325 2.69195 14.6007 2.20713 13.8596 2.00857Z"
              fill="#FBFBFB"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
