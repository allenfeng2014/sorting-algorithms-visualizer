import React, { useState, useEffect } from "react";
import "./css/Numbers.css";
import sortingAlgos from "./sortingAlgos";

function Numbers() {
  // state values
  const [numbers, setNumbers] = useState([]);
  const [numsTotal, setNumsTotal] = useState(100);
  const [sortingAlgo, setSortingAlgo] = useState("");
  const [speed, setSpeed] = useState(25);
  let animeProgressID = null;

  // color codes
  const colorOrange = "rgb(247, 116, 45)";
  const colorBlue = "rgb(49, 109, 165)";
  const colorGrey = "rgb(224, 224, 224)";
  const colorViolet = "rgb(220, 58, 252)";

  // design related constants
  const NUMBER_MAX = 690;
  const NUMBER_MIN = 10;
  const CANVAS_HEIGHT = NUMBER_MAX + NUMBER_MIN;

  const numBars = {
    // method for changing number bar color
    setBarColor: function (idx, color) {
      document.getElementById(`number${idx}`).style.backgroundColor = color;
    },
    // method for toggling number bar between blue and target color
    toggleBarColor: function (idx, targetColor) {
      if (
        document.getElementById(`number${idx}`).style.backgroundColor !==
        colorBlue
      ) {
        this.setBarColor(idx, colorBlue);
      } else {
        this.setBarColor(idx, targetColor);
      }
    },
    // method for changing number bar height
    setBarHeight: function (idx, height) {
      let barStyle = document.getElementById(`number${idx}`).style;
      barStyle.height = `${height}px`;
      barStyle.borderTopWidth = `${CANVAS_HEIGHT - height}px`;
    },
    // function for resetting numbers
    resetNumbers: function (returnNumbers = false) {
      if (animeProgressID !== null) {
        clearInterval(animeProgressID);
        animeProgressID = null;
        for (let i = 0; i < numsTotal; i++) {
          let barStyle = document.getElementById(`number${i}`).style;
          if (barStyle.backgroundColor === colorBlue) {
            continue;
          }
          barStyle.backgroundColor = colorBlue;
        }
      }
      document.getElementById("button-start").disabled = true;

      let newNumbers = [];
      for (let i = 0; i < numsTotal; i++) {
        let newNumber = Math.floor(Math.random() * 680 + 10);
        newNumbers.push(newNumber);
      }
      setNumbers(newNumbers);
      setSortingAlgo("");
      buttons.disableSettingButtons(false);

      if (returnNumbers) return newNumbers;
    },
    sortNumbers: function (nums) {
      let { numsSorted } = sortingAlgos.mergeSort(nums);
      setNumbers(numsSorted);
    },
  };

  // functions to start and stop sorting animation
  const animation = {
    start: function (nums, algo) {
      //buttons.disableAlgoButtons(true);
      buttons.disableSettingButtons(true);
      buttons.reloadSettings();
      this.sortingAnime(nums, algo);
    },
    stop: function () {
      clearInterval(animeProgressID);
      animeProgressID = null;
      setSortingAlgo("");
      buttons.disableSettingButtons(false);
    },
    // method for visualizing sorting algorithms
    sortingAnime: function (nums, algo) {
      let { numActions: actions } = sortingAlgos[algo](nums);
      let lastAction = actions[0];
      animeProgressID = setInterval(() => {
        let action = actions.shift();
        //console.log(action); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!debug
        if (lastAction.swap !== undefined) {
          for (let idx of lastAction.swapIndices) {
            numBars.setBarColor(idx, colorBlue);
          }
        } else if (lastAction.set !== undefined) {
          for (let idx of lastAction.setIndices) {
            numBars.setBarColor(idx, colorBlue);
          }
        }
        // if no further action, stop animation and reset buttons
        if (action === undefined) {
          this.stop();
          return;
        }
        // swap numbers if requested
        if (action.swap !== undefined) {
          let indices = action.swapIndices;
          for (let idx of indices) {
            numBars.setBarColor(idx, colorOrange);
          }
          if (action.swap) {
            //console.log("swapping ", indices[0], indices[1]);///////debug
            let height1 = numbers[indices[0]];
            let height2 = numbers[indices[1]];
            numBars.setBarHeight(indices[0], height2);
            numBars.setBarHeight(indices[1], height1);
            numbers[indices[0]] = height2;
            numbers[indices[1]] = height1;
          }
        }
        // set target numbers if requested
        if (action.set !== undefined) {
          let indices = action.setIndices;
          let heights = action.setHeights;
          for (let idx = 0; idx < indices.length; idx++) {
            numBars.setBarHeight(indices[idx], heights[idx]);
            //numBars.setBarColor(indices[idx], colorOrange);
            numbers[indices[idx]] = heights[idx];
          }
        }
        // highlight target numbers if requested
        if (action.toggle !== undefined) {
          let indices = action.toggleIndices;
          for (let idx of indices) {
            numBars.toggleBarColor(idx, colorViolet);
          }
        }
        lastAction = action;
      }, speed);
      document.getElementById("button-start").disabled = true;
    },
  };

  const buttons = {
    sortingAlgoNames: Object.keys(sortingAlgos),
    settings: ["speed", "numsTotal", "sortingAlgo"],
    disableSettingButtons: function (disable) {
      this.settings.forEach((setting) => {
        let buttonName = `set${setting[0].toUpperCase()}${setting.substr(1)}`;
        document.getElementById(`button-${buttonName}`).disabled = disable;
        document.getElementById(`input-${setting}`).disabled = disable;
      });
    },
    reloadSettings: function () {
      this.settings.forEach((setting) => {
        if (setting !== "sortingAlgo")
          document.getElementById(`input-${setting}`).value = "";
      });
    },
  };

  // reset numbers at start up
  useEffect(() => {
    numBars.resetNumbers();
  }, [numsTotal]);

  return (
    <React.Fragment>
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
      <div className="buttons-container">
        <button
          className="button-misc"
          id="button-sortedRefresh"
          onClick={() => {
            numBars.sortNumbers(numBars.resetNumbers(true));
          }}
        >
          Sorted Refresh
        </button>
        <button
          className="button-misc"
          id="button-refresh"
          onClick={numBars.resetNumbers}
        >
          Refresh
        </button>

        <textarea
          id="input-speed"
          placeholder={`${speed} ms`}
          className="textarea-setting"
        ></textarea>
        <button
          className="button-misc"
          id="button-setSpeed"
          onClick={() => {
            let value = document.getElementById("input-speed").value;
            if (value > 0) {
              setSpeed(value);
            } else {
              alert("Please enter a number greater than 0");
            }
            buttons.reloadSettings();
          }}
        >
          SetSpeed
        </button>
        <textarea
          id="input-numsTotal"
          placeholder={numsTotal}
          className="textarea-setting"
        ></textarea>
        <button
          className="button-misc"
          id="button-setNumsTotal"
          onClick={() => {
            let value = document.getElementById("input-numsTotal").value;
            if (value > 0 && value <= 280) {
              setNumsTotal(value);
            } else {
              alert("Please enter a number between 0 ~ 280");
            }
            buttons.reloadSettings();
          }}
        >
          SetNumsTotal
        </button>

        <select id="input-sortingAlgo">
          {buttons.sortingAlgoNames.map((algoName, idx) => (
            <option value={algoName} key={idx}>
              {algoName}
            </option>
          ))}
        </select>
        <button
          className="button-misc"
          id="button-setSortingAlgo"
          onClick={() => {
            setSortingAlgo(document.getElementById("input-sortingAlgo").value);
            document.getElementById("button-start").disabled = false;
          }}
        >
          SetAlgorithm
        </button>

        <button
          className="button-misc"
          id="button-start"
          onClick={() => {
            animation.start(numbers, sortingAlgo);
          }}
        >
          Start
        </button>
      </div>
      <div className="messages-container">
        <span className="message-block" id="message-refresh">
          Generate new numbers
        </span>

        <span className="message-block" id="message-settings">
          Animation settings:
          <b>{`${speed} ms/frame, ${numsTotal} nums`}</b>
        </span>
        <span className="message-block" id="message-algo">
          {sortingAlgo ? (
            <span>
              Algorithm:
              <b>{sortingAlgo}</b>
            </span>
          ) : (
            <b>Pick an algorithm</b>
          )}
        </span>

        <span className="message-block" id="message-start">
          Start
        </span>
      </div>
    </React.Fragment>
  );
}

export default Numbers;
