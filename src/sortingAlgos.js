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
  // bubbleSort: sort numbers by swapping unsorted adjacent numbers
  //    traverse from the beginning to the end
  //    check if two adjacent numbers are sorted (num1 <= num2)
  //    if unsorted, swap them
  //    keep iterating until no swap is needed for the entire array
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

  // insertionSort: sort numbers by inserting everyone at its correct index
  //    traverse array from the beginning to the end
  //    for each number, traverse from the beginning to find
  //    the first number which the current number is less than
  //    then insert the current number at that index
  //    iterate from idx 0 to length-1
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

  // cycleSort: sort numbers by putting them at their correct indices
  //    for each number, its correct index = count of numbers less than it
  //    keep iterating until every number is at its correct index
  cycleSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];
    let length = nums.length;

    let curIdx = 0;
    while (curIdx < length - 1) {
      let curNum = nums[curIdx];
      let numsLessTotal = -1;

      while (curIdx !== numsLessTotal) {
        console.log("curIdx ", curIdx, "curNum ", curNum);
        numsLessTotal = curIdx;
        for (let idx = curIdx + 1; idx < length; idx++) {
          numActions.push({ swap: false, swapIndices: [curIdx, idx] });
          if (nums[idx] < curNum) {
            numsLessTotal++;
          }
        }
        console.log("correct pos ", numsLessTotal);
        if (curIdx !== numsLessTotal) {
          while (curNum === nums[numsLessTotal] && numsLessTotal !== curIdx) {
            numsLessTotal++;
            numActions.push({
              swap: false,
              swapIndices: [curIdx, numsLessTotal],
            });
          }
          if (curIdx !== numsLessTotal) {
            curNum = nums[numsLessTotal];
            nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
            nums[curIdx] = nums[curIdx] ^ nums[numsLessTotal];
            nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
            numActions.push({
              toggle: true,
              toggleIndices: [curIdx, numsLessTotal],
            });
            numActions.push({
              swap: true,
              swapIndices: [curIdx, numsLessTotal],
            });
          }
        }
      }
      nums[curIdx] = curNum;
      curIdx++;
    }

    return { numsSorted: nums, numActions };
  },

  // radixSort: sort numbers from LSB to MSB (decimal base)
  radixSort: function (numbers) {
    let numActions = [];
    let nums = [...numbers];
    let length = nums.length;

    let divisor = 10;
    let prevDivisor = 1;
    let digits = [];
    for (let digit = -9; digit <= 9; digit++) {
      digits.push(digit);
    }

    let noMoreDigits = false;
    while (!noMoreDigits) {
      noMoreDigits = true;

      // count number of appearance for each digit (-9 ~ 9)
      let counts = new Array(digits.length).fill(0);
      for (let idx = 0; idx < length; idx++) {
        numActions.push({
          swap: false,
          swapIndices: [idx],
        });
        let digitIdx = digits.indexOf(
          ((nums[idx] % divisor) - (nums[idx] % prevDivisor)) / prevDivisor
        );
        counts[digitIdx]++;
        if (
          noMoreDigits &&
          (nums[idx] % (divisor * 10)) - (nums[idx] % divisor) !== 0
        ) {
          noMoreDigits = false;
        }
      }
      // find correct positions of each digit based on total counts of prev digits
      for (let idx = 1; idx < counts.length; idx++) {
        counts[idx] += counts[idx - 1];
      }
      // put numbers in their correct position in a new array
      let newNums = [...nums];
      for (let idx = length - 1; idx >= 0; idx--) {
        let curNum = nums[idx];
        let digitIdx = digits.indexOf(
          ((curNum % divisor) - (curNum % prevDivisor)) / prevDivisor
        );
        let targetIdx = counts[digitIdx] - 1;
        numActions.push({
          toggle: true,
          toggleIndices: [targetIdx],
          set: true,
          setIndices: [targetIdx],
          setHeights: [curNum],
        });
        newNums[targetIdx] = curNum;
        counts[digitIdx]--;
      }
      // keep going for the next more significant bit
      nums = newNums;
      prevDivisor = divisor;
      divisor *= 10;
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
