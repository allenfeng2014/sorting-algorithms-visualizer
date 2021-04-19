import React from "react";
import "../css/Buttons.css";

function Buttons({ speed, numsTotal, sortingAlgoNames, handlers }) {
  return (
    <div className="buttons-container">
      <button
        className="button-misc"
        id="button-sortedRefresh"
        onClick={() => {
          handlers.refresh(true);
        }}
      >
        Sorted Refresh
      </button>
      <button
        className="button-misc"
        id="button-refresh"
        onClick={() => {
          handlers.refresh(false);
        }}
      >
        Refresh
      </button>

      {/*change textarea to input maybe ???*/}
      <textarea
        className="textarea-setting"
        id="input-speed"
        placeholder={`${speed} ms`}
      ></textarea>
      <button
        className="button-misc"
        id="button-setSpeed"
        onClick={handlers.setSpeed}
      >
        SetSpeed
      </button>
      <textarea
        className="textarea-setting"
        id="input-numsTotal"
        placeholder={numsTotal}
      ></textarea>
      <button
        className="button-misc"
        id="button-setNumsTotal"
        onClick={handlers.setNumsTotal}
      >
        SetNumsTotal
      </button>
      <select id="input-sortingAlgo">
        {sortingAlgoNames.map((algoName, idx) => (
          <option value={algoName} key={idx}>
            {algoName}
          </option>
        ))}
      </select>
      <button
        className="button-misc"
        id="button-setSortingAlgo"
        onClick={handlers.setSortingAlgo}
      >
        SetAlgorithm
      </button>

      <button
        className="button-misc"
        id="button-start"
        onClick={handlers.start}
      >
        Start
      </button>
    </div>
  );
}

export default Buttons;
