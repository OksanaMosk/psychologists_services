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
      outerCircleColor="rgba(18, 20, 23, 0.5)"
      innerCircleColor="#3470ff"
      middleCircleColor="rgba(18, 20, 23, 0.5)"
    />
  );
};
export default Loader;
