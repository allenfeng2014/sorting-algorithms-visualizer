const sortingAlgos = {
  bubbleSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];
    let swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < numbers.length - 1; i++) {
        let numAction = { indices: [i, i + 1], swap: false };
        let num1 = numbers[i];
        let num2 = numbers[i + 1];
        if (num1 > num2) {
          numbers[i] = num2;
          numbers[i + 1] = num1;
          swapped = true;
          numAction.swap = true;
        }
        numActions.push(numAction);
      }
    }

    return numActions;
  },

  selectionSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];

    for (let curIdx = 0; curIdx < numbers.length - 1; curIdx++) {
      let curNumber = numbers[curIdx];
      let minIdx = curIdx;
      let minNumber = curNumber;
      for (let idx = curIdx + 1; idx < numbers.length; idx++) {
        numActions.push({ indices: [curIdx, idx], swap: false });
        if (numbers[idx] < minNumber) {
          if (minIdx !== curIdx) {
            numActions.push({ numBarsToggle: true, indices: [minIdx] });
          }
          numActions.push({ numBarsToggle: true, indices: [idx] });
          minIdx = idx;
          minNumber = numbers[idx];
        }
      }
      if (minIdx !== curIdx) {
        numbers[curIdx] = numbers[minIdx];
        numbers[minIdx] = curNumber;
        numActions.push({ indices: [curIdx, minIdx], swap: true });
      }
    }

    return numActions;
  },

  insertionSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];

    for (let curIdx = 1; curIdx < numbers.length; curIdx++) {
      for (let targetIdx = 0; targetIdx < curIdx; targetIdx++) {
        let numAction = { indices: [curIdx, targetIdx], swap: false };
        let curNumber = numbers[curIdx];
        if (curNumber < numbers[targetIdx]) {
          for (let idx = curIdx; idx > targetIdx; idx--) {
            numbers[idx] = numbers[idx - 1];
            numActions.push({ indices: [idx, idx - 1], swap: true });
          }
          numbers[targetIdx] = curNumber;
          break;
        } else {
          numActions.push(numAction);
        }
      }
      curIdx++;
    }

    return numActions;
  },
};

export default sortingAlgos;
