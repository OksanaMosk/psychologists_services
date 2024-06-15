import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import css from './HomePage.module.css';

import hero_1x_webp from '../../images/hero_1x_webp.webp';
import hero_2x_webp from '../../images/hero_2x_webp.webp';
import hero_1x from '../../images/hero_1x.jpg';
import hero_2x from '../../images/hero_2x.jpg';
import hero from '../../images/hero.png';

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

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  console.log('Ширина екрану:', screenWidth);
  console.log('Висота екрану:', screenHeight);

  return (
    <div className={css.homeContainer}>
      <div className={css.left}>
        <p className={css.about}>
          The road to the
          <span className={css.aboutSpan}>
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
        <picture className={css.picture}>
          <source
            srcSet={`${hero_1x_webp} 1x, ${hero_2x_webp} 2x`}
            type="image/webp"
          />

          <source
            srcSet={`${hero_1x} 1x, ${hero_2x} 2x`}
            media="(min-width:1158px)"
          />

          <img className={css.hero} src={hero} alt="hero" />
        </picture>
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
          <svg
            className={css.heroImgDetSvg}
            width="10"
            height="15"
            viewBox="0 0 10 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 4.3125C2.5 3.14043 3.39687 2.1875 4.5 2.1875H5.5C6.60313 2.1875 7.5 3.14043 7.5 4.3125V4.43203C7.5 5.15586 7.15313 5.82988 6.58125 6.21836L5.2625 7.11817C4.8753 7.38268 4.5568 7.74625 4.33622 8.17554C4.11564 8.60483 4.00003 9.0861 4 9.5752V9.625C4 10.2127 4.44688 10.6875 5 10.6875C5.55312 10.6875 6 10.2127 6 9.625V9.57852C6 9.30625 6.13125 9.05391 6.34375 8.90781L7.6625 8.00801C8.80625 7.22442 9.5 5.87969 9.5 4.43203V4.3125C9.5 1.96504 7.70937 0.0625 5.5 0.0625H4.5C2.29063 0.0625 0.5 1.96504 0.5 4.3125C0.5 4.9002 0.946875 5.375 1.5 5.375C2.05313 5.375 2.5 4.9002 2.5 4.3125ZM5 14.9375C5.33152 14.9375 5.64946 14.7976 5.88388 14.5485C6.1183 14.2994 6.25 13.9616 6.25 13.6094C6.25 13.2571 6.1183 12.9193 5.88388 12.6703C5.64946 12.4212 5.33152 12.2813 5 12.2813C4.66848 12.2813 4.35054 12.4212 4.11612 12.6703C3.8817 12.9193 3.75 13.2571 3.75 13.6094C3.75 13.9616 3.8817 14.2994 4.11612 14.5485C4.35054 14.7976 4.66848 14.9375 5 14.9375Z"
              fill="#FBFBFB"
            />
          </svg>
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
