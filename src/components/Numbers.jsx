import React from "react";
import "../css/Numbers.css";
import numBarsConstants from "../constants/numBarsConstants";

function Numbers({ numbers }) {
  const { CANVAS_HEIGHT, colorGrey } = numBarsConstants;
  return (
    <div className="numbers-container">
      {numbers.map((number, idx) => (
        <span
          className="number-bar"
          id={`number${idx}`}
          key={idx}
          style={{
            height: `${number}px`,
            borderTop: `${CANVAS_HEIGHT - number}px solid ${colorGrey}`,
          }}
        ></span>
      ))}
    </div>
  );
}

export default Numbers;
