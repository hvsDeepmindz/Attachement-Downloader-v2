import React from "react";
import { SpinnerCircularFixed } from "spinners-react";

const Loader = () => {
  return (
    <>
      <SpinnerCircularFixed
        size={40}
        thickness={180}
        speed={180}
        color="rgba(57, 141, 172, 1)"
        secondaryColor="rgba(0, 0, 0, 0.41)"
      />
    </>
  );
};

export default Loader;
