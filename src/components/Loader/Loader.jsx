import React from 'react';
import { ThreeCircles } from 'react-loader-spinner';

const Loader = () => {
  return (
    <ThreeCircles
      height="70"
      width="70"
      color="rgba(18, 20, 23, 0.5)"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="three-circles-rotating"
      outerCircleColor="var(--button-background-color)"
      innerCircleColor="rgba(84, 190, 150, 0.2)"
      middleCircleColor="#191a15"
    />
  );
};
export default Loader;
