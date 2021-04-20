import React, { useState, useEffect } from "react";
import "./css/App.css";
// components
import Numbers from "./components/Numbers";
import Buttons from "./components/Buttons";
import Messages from "./components/Messages";
// utils
import buttons from "./utils/buttons";
import numBars from "./utils/numBars";
import Animator from "./utils/animator";

function App() {
  // state values
  const [numbers, setNumbers] = useState([]);
  const [numsTotal, setNumsTotal] = useState(100);
  const [sortingAlgo, setSortingAlgo] = useState("");
  const [speed, setSpeed] = useState(25);

  // animator object
  const animator = new Animator();

  // reset everything at start up and whenever numsTotal changes
  useEffect(() => {
    let newNumbers = numBars.resetNumbers(numsTotal);
    setNumbers(newNumbers);
    setSortingAlgo("");
    buttons.disableSettingButtons(false);
  }, [numsTotal]);

  // event handlers
  const handlers = {
    refresh: (sorted = false) => {
      let newNumbers = numBars.resetNumbers(numsTotal);
      if (sorted) {
        newNumbers.sort((a, b) => a - b);
      }
      setNumbers(newNumbers);
      animator.stop();
      animator.setNumbers(newNumbers);
      setSortingAlgo("");
      buttons.disableSettingButtons(false);
    },
    setSpeed: () => {
      let value = document.querySelector("#input-speed").value;
      if (value > 0) {
        setSpeed(value);
      } else {
        alert("Please enter a number greater than 0");
      }
      animator.setSpeed(value);
      buttons.reloadSettings();
    },
    setNumsTotal: () => {
      let value = document.querySelector("#input-numsTotal").value;
      if (value > 0 && value <= 280) {
        setNumsTotal(value);
      } else {
        alert("Please enter a number between 0 ~ 280");
      }
      buttons.reloadSettings();
    },
    setSortingAlgo: () => {
      setSortingAlgo(document.querySelector("#input-sortingAlgo").value);
      document.querySelector("#button-start").disabled = false;
    },
    start: () => {
      animator.setSpeed(speed);
      animator.setNumbers(numbers);
      animator.start(sortingAlgo);
    },
  };

  return (
    <div className="App">
      <div className="title-container">
        <p className="title-h1">Sorting Algorithms Visualizer</p>
        <p className="title-h2">github/allenfeng2014</p>
      </div>
      <Numbers {...{ numbers }} />
      <Buttons
        {...{
          speed,
          numsTotal,
          sortingAlgoNames: buttons.sortingAlgoNames,
          handlers,
        }}
      />
      <Messages {...{ speed, sortingAlgo, numsTotal }} />
    </div>
  );
}

export default App;
