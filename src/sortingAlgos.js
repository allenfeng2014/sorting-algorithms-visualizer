const sortingAlgos = {
  bubbleSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];
    let swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < numbers.length - 1; i++) {
        let numAction = { swapIndices: [i, i + 1], swap: false };
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

    return { numsSorted: numbers, numActions };
  },

  selectionSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];

    for (let curIdx = 0; curIdx < numbers.length - 1; curIdx++) {
      let curNumber = numbers[curIdx];
      let minIdx = curIdx;
      let minNumber = curNumber;
      for (let idx = curIdx + 1; idx < numbers.length; idx++) {
        numActions.push({ swapIndices: [curIdx, idx], swap: false });
        if (numbers[idx] < minNumber) {
          if (minIdx !== curIdx) {
            numActions.push({
              swapIndices: [curIdx],
              swap: false,
              numBarsToggle: true,
              toggleIndices: [minIdx],
            });
          }
          numActions.push({
            swapIndices: [curIdx],
            swap: false,
            numBarsToggle: true,
            toggleIndices: [idx],
          });
          minIdx = idx;
          minNumber = numbers[idx];
        }
      }
      if (minIdx !== curIdx) {
        numbers[curIdx] = numbers[minIdx];
        numbers[minIdx] = curNumber;
        numActions.push({ swapIndices: [curIdx, minIdx], swap: true });
      }
    }

    return { numsSorted: numbers, numActions };
  },

  insertionSort: function (nums) {
    let numActions = [];
    let numbers = [...nums];

    for (let curIdx = 1; curIdx < numbers.length; curIdx++) {
      for (let targetIdx = 0; targetIdx < curIdx; targetIdx++) {
        let curNumber = numbers[curIdx];
        if (curNumber < numbers[targetIdx]) {
          numActions.push({
            toggleIndices: [targetIdx],
            numBarsToggle: true,
          });
          for (let idx = curIdx; idx > targetIdx; idx--) {
            numbers[idx] = numbers[idx - 1];
            numActions.push({ swapIndices: [idx, idx - 1], swap: true });
          }
          numbers[targetIdx] = curNumber;
          break;
        } else {
          numActions.push({ swapIndices: [curIdx, targetIdx], swap: false });
        }
      }
    }

    return { numsSorted: numbers, numActions };
  },

  mergeSort: function (
    numbers,
    range = [0, numbers.length - 1],
    numActions = []
  ) {
    let numsTotal = numbers.length;
    let actions = [];

    // base cases
    if (numsTotal === 1) {
      actions.push({ set: true, setIndices: [range[0]], setHeights: numbers });
      return { numsSorted: numbers, range: [range[0]], numActions: [] };
    }
    if (numsTotal === 2) {
      if (numbers[0] > numbers[1]) {
        numbers = numbers.reverse();
      }
      for (let idx = 0; idx < numsTotal; idx++) {
        actions.push({
          set: true,
          setIndices: [range[0] + idx],
          setHeights: [numbers[idx]],
        });
      }
      return { numsSorted: numbers, range, numActions: actions };
    }

    // recursively call mergeSort on left and right subarray
    let medianIdx = Math.floor(numsTotal / 2);
    let {
      numsSorted: numsSortedLeft,
      numActions: actionsLeft,
    } = this.mergeSort(numbers.slice(0, medianIdx), [
      range[0],
      range[0] + medianIdx - 1,
    ]);
    let {
      numsSorted: numsSortedRight,
      numActions: actionsRight,
    } = this.mergeSort(numbers.slice(medianIdx), [
      range[0] + medianIdx,
      range[1],
    ]);
    // store sorting actions returned by mergeSort on subarrays
    numActions = numActions.concat([...actionsLeft, ...actionsRight]);

    // merge left and right sorted subarray to a single array
    let numLeftIdx = 0;
    let numRightIdx = 0;
    let numsSorted = [];
    // put numbers from two subarrays into one array
    while (
      numLeftIdx < numsSortedLeft.length &&
      numRightIdx < numsSortedRight.length
    ) {
      let numLeft = numsSortedLeft[numLeftIdx];
      let numRight = numsSortedRight[numRightIdx];
      if (numLeft < numRight) {
        numsSorted.push(numLeft);
        numLeftIdx++;
      } else {
        numsSorted.push(numRight);
        numRightIdx++;
      }
    }
    if (numLeftIdx < numsSortedLeft.length) {
      for (let idx = numLeftIdx; idx < numsSortedLeft.length; idx++) {
        numsSorted.push(numsSortedLeft[idx]);
      }
    } else {
      for (let idx = numRightIdx; idx < numsSortedRight.length; idx++) {
        numsSorted.push(numsSortedRight[idx]);
      }
    }
    // return sorting actions for animation
    for (let idx = 0; idx < numsSorted.length; idx++) {
      numActions.push({
        set: true,
        setIndices: [range[0] + idx],
        setHeights: [numsSorted[idx]],
      });
    }

    return { numsSorted, range, numActions };
  },
};

export default sortingAlgos;
