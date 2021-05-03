import numBars from "./numBars";
import buttons from "./buttons";
import sortingAlgos from "./sortingAlgos";
import numBarsConstants from "../constants/numBarsConstants";

class Animator {
  constructor() {
    this.animatorOn = false;
    this.numbers = [];
    this.speed = 25;
    this.constants = numBarsConstants;
  }

  // setter methods
  setAnimatorOn = (animatorOn) => {
    this.animatorOn = animatorOn;
  };
  setNumbers = (newNumbers) => {
    this.numbers = newNumbers;
  };
  setSpeed = (newSpeed) => {
    this.speed = newSpeed;
  };

  // animator control functions
  start = async (algo) => {
    buttons.disableSettingButtons(true);
    buttons.reloadSettings();
    this.setAnimatorOn(true);
    let animator = this.animator();
    await sortingAlgos[algo]({ nums: this.numbers, animator });
    // finish animation by giving a null as final action
    animator(null);
  };
  stop = () => {
    this.setAnimatorOn(false);
    buttons.disableSettingButtons(false);
  };

  // animator function, use closure to remember lastAction state
  animator = () => {
    let lastAction = {};

    return async (action) => {
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
      if (action === null) {
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

      // return a promise that resolves after some time
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.animatorOn);
        }, this.speed);
      });
    };
  };
}

export default Animator;
