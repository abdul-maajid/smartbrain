import React from "react";
import Tilt from "react-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt br2 shadow-2"
        options={{ max: 25 }}
        style={{ height: 200, width: 200 }}
      >
        <div className="Tilt-inner pa2">
          <img src={brain} alt="Logo" style={{ paddingTop: "3px" }} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
