import React, { useState, useEffect } from "react";
import "./css/Numbers.css";
import sortingAlgos from "./sortingAlgos";

function Numbers() {
  // state values
  const [numbers, setNumbers] = useState([]);
  const [numbersTotal, setNumbersTotal] = useState(200);
  const [sortingAlgo, setSortingAlgo] = useState(" ");
  const [animeSpeed, setAnimeSpeed] = useState(30);
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
        for (let i = 0; i < numbersTotal; i++) {
          let barStyle = document.getElementById(`number${i}`).style;
          if (barStyle.backgroundColor === colorBlue) {
            continue;
          }
          barStyle.backgroundColor = colorBlue;
        }
      }
      document.getElementById("button-start").disabled = true;

      let newNumbers = [];
      for (let i = 0; i < numbersTotal; i++) {
        let newNumber = Math.floor(Math.random() * 680 + 10);
        newNumbers.push(newNumber);
      }
      setNumbers(newNumbers);
      buttons.disableAlgoButtons(false);
      setSortingAlgo("");

      if (returnNumbers) return newNumbers;
    },
    sortNumbers: function (nums) {
      let { numsSorted } = sortingAlgos.mergeSort(nums);
      setNumbers(numsSorted);
    },
  };

  // function for visualizing bubble sort
  const sortingAnime = (nums, algo) => {
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
      if (action === undefined) {
        clearInterval(animeProgressID);
        animeProgressID = null;
        buttons.disableAlgoButtons(false);
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
          numBars.setBarColor(indices[idx], colorOrange);
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
    }, animeSpeed);
    document.getElementById("button-start").disabled = true;
  };

  const buttons = {
    sortingAlgoNames: [
      "bubbleSort",
      "insertionSort",
      "selectionSort",
      "mergeSort",
      "quickSort",
    ],
    disableAlgoButtons: function (disable) {
      this.sortingAlgoNames.forEach((algoName) => {
        document.getElementById(`button-${algoName}`).disabled = disable;
      });
    },
  };

  // reset numbers at start up
  useEffect(() => {
    numBars.resetNumbers();
  }, [numbersTotal]);

  return (
    <React.Fragment>
      <div className="title-container"></div>
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
        {buttons.sortingAlgoNames.map((algoName, idx) => (
          <button
            className="button-algo"
            id={`button-${algoName}`}
            key={idx}
            onClick={() => {
              setSortingAlgo(algoName);
              document.getElementById("button-start").disabled = false;
            }}
          >
            {algoName}
          </button>
        ))}
        <button
          className="button-misc"
          id="button-start"
          onClick={() => {
            buttons.disableAlgoButtons(true);
            sortingAnime(numbers, sortingAlgo);
          }}
        >
          Start
        </button>
        <textarea id="input-animeSpeed" placeholder={animeSpeed}></textarea>
        <button
          className="button-misc"
          id="button-setSpeed"
          onClick={() => {
            setAnimeSpeed(document.getElementById("input-animeSpeed").value);
          }}
        >
          SetSpeed
        </button>
        <textarea id="input-numbersTotal" placeholder={numbersTotal}></textarea>
        <button
          className="button-misc"
          id="button-setSpeed"
          onClick={() => {
            setNumbersTotal(
              document.getElementById("input-numbersTotal").value
            );
          }}
        >
          SetNumsTotal
        </button>
      </div>
      <div className="messages-container">
        <p id="message-algo">Pick an algorithm: {sortingAlgo}</p>
      </div>
    </React.Fragment>
  );
}

export default Numbers;
