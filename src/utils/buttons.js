import sortingAlgos from "../sortingAlgos";

const buttons = {
  sortingAlgoNames: Object.keys(sortingAlgos),
  settings: ["speed", "numsTotal", "sortingAlgo"],
  disableSettingButtons: function (disable) {
    this.settings.forEach((setting) => {
      let buttonName = `set${setting[0].toUpperCase()}${setting.substr(1)}`;
      document.querySelector(`#button-${buttonName}`).disabled = disable;
      document.querySelector(`#input-${setting}`).disabled = disable;
    });
  },
  reloadSettings: function () {
    this.settings.forEach((setting) => {
      if (setting !== "sortingAlgo")
        document.querySelector(`#input-${setting}`).value = "";
    });
  },
};

export default buttons;
