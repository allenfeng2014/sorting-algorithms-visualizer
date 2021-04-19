import numBars from "./numBars";
import buttons from "./buttons";
import sortingAlgos from "../sortingAlgos";
import numBarsConstants from "../constants/numBarsConstants";

class Animator {
  constructor() {
    this.animeProgressID = null;
    this.constants = numBarsConstants;
    this.numbers = [];
    this.speed = 25;
  }

  setAnimeProgressID = (newProgressID) => {
    this.animeProgressID = newProgressID;
  };

  setNumbers = (newNumbers) => {
    this.numbers = newNumbers;
  };

  setSpeed = (newSpeed) => {
    this.speed = newSpeed;
  };

  start = (algo) => {
    buttons.disableSettingButtons(true);
    buttons.reloadSettings();
    this.sortingAnime(algo);
  };

  stop = () => {
    if (this.animeProgressID) {
      clearInterval(this.animeProgressID);
      this.setAnimeProgressID(null);
    }
    // setSortingAlgo("")
    buttons.disableSettingButtons(false);
  };

  sortingAnime = (algo) => {
    let { numActions: actions } = sortingAlgos[algo](this.numbers);
    let lastAction = actions[0];
    let newProgressID = setInterval(() => {
      let action = actions.shift();
      if (lastAction.swap !== undefined) {
        for (let idx of lastAction.swapIndices) {
          numBars.setBarColor(idx, this.constants.colorBlue);
        }
      } else if (lastAction.set !== undefined) {
        for (let idx of lastAction.setIndices) {
          numBars.setBarColor(idx, this.constants.colorBlue);
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
          numBars.setBarColor(idx, this.constants.colorOrange);
        }
        if (action.swap) {
          let height1 = this.numbers[indices[0]];
          let height2 = this.numbers[indices[1]];
          numBars.setBarHeight(indices[0], height2);
          numBars.setBarHeight(indices[1], height1);
          this.numbers[indices[0]] = height2;
          this.numbers[indices[1]] = height1;
        }
      }
      // set target numbers if requested
      if (action.set !== undefined) {
        let indices = action.setIndices;
        let heights = action.setHeights;
        for (let idx = 0; idx < indices.length; idx++) {
          numBars.setBarHeight(indices[idx], heights[idx]);
          //numBars.setBarColor(indices[idx], colorOrange);
          this.numbers[indices[idx]] = heights[idx];
        }
      }
      // highlight target numbers if requested
      if (action.toggle !== undefined) {
        let indices = action.toggleIndices;
        for (let idx of indices) {
          numBars.toggleBarColor(idx, this.constants.colorViolet);
        }
      }
      lastAction = action;
    }, this.speed);
    this.setAnimeProgressID(newProgressID);
    document.querySelector("#button-start").disabled = true;
  };
}

export default Animator;
