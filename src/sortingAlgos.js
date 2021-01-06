/*
sorting algorithms included:
  bubbleSort, selectionSort, insertionSort,
  mergeSort, quickSort, !!!!!radixSort

parameters:
  numbers: array of unsorted numbers
  range: range of current subarray (for recursive algos)
        format [startIdx, endIdx]
  numActions: swap/toggle/set actions on numbers for animation
            format {
              swap: bool,
              swapIndices: [],
              toggle: bool,
              toggleIndices: [],
              set: bool,
              setIndices: [],
              setHeights: []
            }
*/
const sortingAlgos = {
  bubbleSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];
    let swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < nums.length - 1; i++) {
        let numAction = { swap: false, swapIndices: [i, i + 1] };
        let num1 = nums[i];
        let num2 = nums[i + 1];
        if (num1 > num2) {
          nums[i] = num2;
          nums[i + 1] = num1;
          swapped = true;
          numAction.swap = true;
        }
        numActions.push(numAction);
      }
    }

    return { numsSorted: nums, numActions };
  },

  oddEvenSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];
    let prevRunSorted = false;
    let curRunSorted = false;

    let startIdx = 1;
    let toggleIndices = [];
    for (let idx = startIdx; idx < nums.length - 1; idx += 2) {
      toggleIndices.push(idx);
    }
    numActions.push({
      toggle: true,
      toggleIndices,
    });
    while (!prevRunSorted || !curRunSorted) {
      prevRunSorted = curRunSorted;
      curRunSorted = true;
      toggleIndices = [];
      for (let idx = startIdx; idx < nums.length - 1; idx += 2) {
        toggleIndices.push(idx);
      }
      numActions.push({
        toggle: true,
        toggleIndices,
      });
      for (let idx = startIdx; idx < nums.length - 1; idx += 2) {
        let numAction = { swap: false, swapIndices: [idx, idx + 1] };
        if (nums[idx] > nums[idx + 1]) {
          curRunSorted = false;
          nums[idx] = nums[idx] ^ nums[idx + 1];
          nums[idx + 1] = nums[idx] ^ nums[idx + 1];
          nums[idx] = nums[idx] ^ nums[idx + 1];
          numAction.swap = true;
        }
        numActions.push(numAction);
      }
      // toggle odd/even mode
      startIdx = 1 - startIdx;
    }

    return { numsSorted: nums, numActions };
  },

  selectionSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];

    for (let curIdx = 0; curIdx < nums.length - 1; curIdx++) {
      let curNumber = nums[curIdx];
      let minIdx = curIdx;
      let minNumber = curNumber;
      for (let idx = curIdx + 1; idx < nums.length; idx++) {
        numActions.push({ swap: false, swapIndices: [curIdx, idx] });
        if (nums[idx] < minNumber) {
          if (minIdx !== curIdx) {
            numActions.push({
              swap: false,
              swapIndices: [curIdx],
              toggle: true,
              toggleIndices: [minIdx],
            });
          }
          numActions.push({
            swap: false,
            swapIndices: [curIdx],
            toggle: true,
            toggleIndices: [idx],
          });
          minIdx = idx;
          minNumber = nums[idx];
        }
      }
      if (minIdx !== curIdx) {
        nums[curIdx] = nums[minIdx];
        nums[minIdx] = curNumber;
        numActions.push({ swap: true, swapIndices: [curIdx, minIdx] });
      }
    }

    return { numsSorted: nums, numActions };
  },

  insertionSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];

    for (let curIdx = 1; curIdx < nums.length; curIdx++) {
      for (let targetIdx = 0; targetIdx < curIdx; targetIdx++) {
        let curNumber = nums[curIdx];
        if (curNumber < nums[targetIdx]) {
          numActions.push({
            toggle: true,
            toggleIndices: [targetIdx],
          });
          for (let idx = curIdx; idx > targetIdx; idx--) {
            nums[idx] = nums[idx - 1];
            numActions.push({ swap: true, swapIndices: [idx, idx - 1] });
          }
          nums[targetIdx] = curNumber;
          break;
        } else {
          numActions.push({ swap: false, swapIndices: [curIdx, targetIdx] });
        }
      }
    }

    return { numsSorted: nums, numActions };
  },

  mergeSort: function (nums, range = [0, nums.length - 1], numActions = []) {
    let numsTotal = nums.length;
    let actions = [];

    // base cases
    if (numsTotal === 1) {
      actions.push({ set: true, setIndices: [range[0]], setHeights: [nums] });
      return { numsSorted: nums, range: [range[0]], numActions: [] };
    }
    if (numsTotal === 2) {
      if (nums[0] > nums[1]) {
        nums = nums.reverse();
      }
      for (let idx = 0; idx < numsTotal; idx++) {
        actions.push({
          set: true,
          setIndices: [range[0] + idx],
          setHeights: [nums[idx]],
        });
      }
      return { numsSorted: nums, range, numActions: actions };
    }

    // recursively call mergeSort on left and right subarray
    let middleIdx = Math.floor(numsTotal / 2);
    let {
      numsSorted: numsSortedLeft,
      numActions: actionsLeft,
    } = this.mergeSort(nums.slice(0, middleIdx), [
      range[0],
      range[0] + middleIdx - 1,
    ]);
    let {
      numsSorted: numsSortedRight,
      numActions: actionsRight,
    } = this.mergeSort(nums.slice(middleIdx), [range[0] + middleIdx, range[1]]);
    // store sorting actions returned by mergeSort on subarrays
    numActions = numActions.concat([...actionsLeft, ...actionsRight]);

    // merge left and right sorted subarray to a single array
    let numLeftIdx = 0;
    let numRightIdx = 0;
    let numsSorted = [];
    // put nums from two subarrays into one array
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

  quickSort: function (nums, range = [0, nums.length - 1], numActions = []) {
    nums = [...nums];
    let length = nums.length;
    // base cases
    if (length === 2) {
      let numsSorted = [];
      let numAction = {};
      if (nums[0] <= nums[1]) {
        numsSorted = nums;
        numAction = { swap: false, swapIndices: [range[0], range[1]] };
      } else {
        numsSorted = nums.reverse();
        numAction = { swap: true, swapIndices: [range[0], range[1]] };
      }
      numActions.push(numAction);
      return { numsSorted, range, numActions };
    }

    // recursive calls
    let pivotIdx = length - 1;
    numActions.push({ toggle: true, toggleIndices: [range[0] + pivotIdx] });
    let numLeftIdx = 0;
    let numRightIdx = pivotIdx - 1;
    numActions.push({
      swap: false,
      swapIndices: [range[0] + numLeftIdx, range[0] + numRightIdx],
    });

    while (numLeftIdx < numRightIdx) {
      let numAction = {
        swap: false,
        swapIndices: [range[0] + numLeftIdx, range[0] + numRightIdx],
      };
      // find a number on the left that > pivot number
      if (nums[numLeftIdx] <= nums[pivotIdx]) {
        numLeftIdx++;
        numAction.swapIndices[0]++;
      }
      // fing a number on the right that < pivot number
      else if (nums[numRightIdx] >= nums[pivotIdx]) {
        numRightIdx--;
        numAction.swapIndices[1]--;
      }
      // swap these two numbers so that newLeft < pivotNum < newRight
      else {
        nums[numLeftIdx] = nums[numLeftIdx] ^ nums[numRightIdx];
        nums[numRightIdx] = nums[numLeftIdx] ^ nums[numRightIdx];
        nums[numLeftIdx] = nums[numLeftIdx] ^ nums[numRightIdx];
        numAction.swap = true;
      }
      numActions.push(numAction);
    }
    // check the number at idx = numLeftIdx = numRightIdx
    let pivotNum = nums[pivotIdx];
    if (nums[numLeftIdx] <= pivotNum) {
      pivotIdx = numLeftIdx + 1;
    } else {
      pivotIdx = numLeftIdx;
    }
    // move pivot number to its correct position so that lefts < pivot < rights
    for (let idx = length - 1; idx > pivotIdx; idx--) {
      nums[idx] = nums[idx - 1];
      numActions.push({
        swap: false,
        swapIndices: [range[0] + idx - 1, range[0] + idx],
        set: true,
        setIndices: [range[0] + idx],
        setHeights: [nums[idx - 1]],
      });
    }
    nums[pivotIdx] = pivotNum;
    numActions.push({
      toggle: true,
      toggleIndices: [range[0] + pivotIdx],
      set: true,
      setIndices: [range[0] + pivotIdx],
      setHeights: [pivotNum],
    });

    let numsSortedLeft = nums.slice(0, pivotIdx);
    if (pivotIdx > 1) {
      let obj = this.quickSort(
        numsSortedLeft,
        [range[0], range[0] + pivotIdx - 1],
        numActions
      );
      numsSortedLeft = obj.numsSorted;
      numActions = obj.numActions;
    }
    let numsSortedRight = nums.slice(pivotIdx + 1, length);
    if (pivotIdx < length - 2) {
      let obj = this.quickSort(
        numsSortedRight,
        [range[0] + pivotIdx + 1, range[1]],
        numActions
      );
      numsSortedRight = obj.numsSorted;
      numActions = obj.numActions;
    }
    nums = [...numsSortedLeft, pivotNum, ...numsSortedRight];

    return {
      numsSorted: nums,
      range,
      numActions,
    };
  },
};

export default sortingAlgos;
