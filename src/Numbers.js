import { useState, useEffect } from "react";
import "./css/Numbers.css";
import sortingAlgos from "./sortingAlgos";

function Numbers() {
  // state values
  const [numbers, setNumbers] = useState([]);
  const [numbersTotal, setNumbersTotal] = useState(200);
  const [sortingAlgo, setSortingAlgo] = useState(" ");
  const [animeSpeed, setAnimeSpeed] = useState(30);
  const [animeProgressID, setAnimeProgressID] = useState(null);
  const [state, setState] = useState({
    numBarsHighlight: [],
  });

  // color codes
  const colorOrange = "rgb(247, 116, 45)";
  const colorBlue = "rgb(49, 109, 165)";
  const colorGrey = "rgb(224, 224, 224)";
  const colorViolet = "rgb(220, 58, 252)";

  // function for resetting numbers
  const resetNumbers = () => {
    if (animeProgressID !== null) {
      clearInterval(animeProgressID);
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
      let newNumber = Math.floor(Math.random() * 795 + 5);
      newNumbers.push(newNumber);
    }
    setNumbers(newNumbers);
    setState({ numBarsHighlight: [] });
  };

  // function for changing number bar color
  const setBarColor = (idx, color) => {
    document.getElementById(`number${idx}`).style.backgroundColor = color;
  };

  // function for changing number bar height
  const setBarHeight = (idx, height) => {
    let barStyle = document.getElementById(`number${idx}`).style;
    barStyle.height = `${height}px`;
    barStyle.borderTopWidth = `${900 - height}px`;
  };

  // function for visualizing bubble sort
  const sortingAnime = (nums, algo) => {
    let actions = sortingAlgos[algo](nums);
    let lastAction = actions[0];
    let intervalID = setInterval(() => {
      let action = actions.shift();
      console.log(action);
      if (action === undefined) {
        clearInterval(animeProgressID);
        setState({ numBarsHighlight: [] });
      }
      if (lastAction !== null) {
        for (let idx of lastAction.indices) {
          setBarColor(idx, colorBlue);
        }
      }
      if (action.swap !== undefined) {
        let indices = action.indices;
        for (let idx of indices) {
          setBarColor(idx, colorOrange);
        }
        if (action.swap) {
          let height1 = numbers[indices[0]];
          let height2 = numbers[indices[1]];
          setBarHeight(indices[0], height2);
          setBarHeight(indices[1], height1);
          numbers[indices[0]] = height2;
          numbers[indices[1]] = height1;
        }
        lastAction = action;
      } else if (action.numBarsToggle !== undefined) {
        let indices = action.indices;
        for (let idx of indices) {
          toggleBarColor(idx, colorViolet);
        }
        lastAction = null;
      }
    }, animeSpeed);
    setAnimeProgressID(intervalID);
    document.getElementById("button-start").disabled = true;
  };

  // function for toggling number bar between blue and target color
  const toggleBarColor = (idx, targetColor) => {
    if (state.numBarsHighlight.includes(idx)) {
      setBarColor(idx, colorBlue);
      setState((prevState) => {
        let numBars = [...prevState.numBarsHighlight];
        numBars.splice(numBars.indexOf(idx), 1, "");
        return { numBarsHighlight: numBars };
      });
    } else {
      setBarColor(idx, targetColor);
      setState((prevState) => ({
        numBarsHighlight: [...prevState.numBarsHighlight, idx],
      }));
    }
  };

  // reset numbers at start up
  useEffect(() => {
    resetNumbers();
  }, []);

  useEffect(() => {
    console.log(state.numBarsHighlight);
  }, [state]);

  return (
    <div id="visualizer-container">
      <div id="numbers-container">
        {numbers.map((number, idx) => (
          <span
            className="number-bar"
            id={`number${idx}`}
            key={idx}
            style={{
              height: `${number}px`,
              borderTop: `${900 - number}px solid ${colorGrey}`,
            }}
          ></span>
        ))}
      </div>
      <div id="buttons-container">
        <button
          className="button"
          id="button-refresh"
          style={{
            width: "50px",
            height: "30px",
          }}
          onClick={resetNumbers}
        >
          Refresh
        </button>
        <button
          className="button"
          id="button-bubbleSort"
          style={{
            width: "100px",
            height: "30px",
          }}
          onClick={() => {
            setSortingAlgo("bubbleSort");
            document.getElementById("button-start").disabled = false;
          }}
        >
          Bubble Sort
        </button>
        <button
          className="button"
          id="button-insertionSort"
          style={{
            width: "100px",
            height: "30px",
          }}
          onClick={() => {
            setSortingAlgo("insertionSort");
            document.getElementById("button-start").disabled = false;
          }}
        >
          Insertion Sort
        </button>
        <button
          className="button"
          id="button-selectionSort"
          style={{
            width: "100px",
            height: "30px",
          }}
          onClick={() => {
            setSortingAlgo("selectionSort");
            document.getElementById("button-start").disabled = false;
          }}
        >
          Selection Sort
        </button>
        <button
          className="button"
          id="button-start"
          style={{
            width: "50px",
            height: "30px",
          }}
          onClick={() => {
            sortingAnime(numbers, sortingAlgo);
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Numbers;
