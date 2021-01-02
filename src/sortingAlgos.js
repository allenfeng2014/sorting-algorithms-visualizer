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
  insertionSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];
    let curIdx = 1;
    while (curIdx < numbers.length) {
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
//toggleFunc(idx, "#ECD13A");
