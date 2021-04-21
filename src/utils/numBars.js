import numBarsConstants from "../constants/numBarsConstants";

const { colorBlue, NUMBER_MAX, NUMBER_MIN, CANVAS_HEIGHT } = numBarsConstants;

const numBars = {
  setBarColor: function (idx, color) {
    document.querySelector(`#number${idx}`).style.backgroundColor = color;
  },
  toggleBarColor: function (idx, targetColor) {
    if (
      document.querySelector(`#number${idx}`).style.backgroundColor !==
      colorBlue
    ) {
      this.setBarColor(idx, colorBlue);
    } else {
      this.setBarColor(idx, targetColor);
    }
  },
  setBarHeight: function (idx, height) {
    let barStyle = document.querySelector(`#number${idx}`).style;
    //console.log("target bar idx", idx);
    //console.log("target bar original height", barStyle.height);
    //console.log("target bar target height", height);
    barStyle.height = `${height}px`;
    barStyle.borderTopWidth = `${CANVAS_HEIGHT - height}px`;
  },
  resetNumbers: function (numsTotal) {
    let numBarElements = document.querySelectorAll(".number-bar");
    numBarElements.forEach((numBar) => {
      if (numBar.style.backgroundColor !== colorBlue) {
        numBar.style.backgroundColor = colorBlue;
      }
    });
    document.querySelector("#button-start").disabled = true;

    console.log(CANVAS_HEIGHT, NUMBER_MAX, NUMBER_MIN);
    let newNumbers = [];
    for (let i = 0; i < numsTotal; i++) {
      let newNumber = Math.floor(
        Math.random() * (NUMBER_MAX - NUMBER_MIN) + NUMBER_MIN
      );
      newNumbers.push(newNumber);
    }
    //setNumbers(newNumbers)
    //setSortingAlgo("")
    // buttons.disableSettingButtons(false)

    return newNumbers;
  },
};

export default numBars;
