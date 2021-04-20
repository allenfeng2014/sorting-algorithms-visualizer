/*
sorting algorithms included:
  bubbleSort, oddEvenSort, selectionSort, insertionSort,
  mergeSort, quickSort, cycleSort, radixSort

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
  //    check if two adjacent numbers are sorted (num1 <= num2).
  //    if unsorted, swap them.
  //    keep iterating until no swap is needed for the entire array.
  bubbleSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
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
        // call async animator and wait for its completion
        animatorOn = await animator(numAction);
        // stop if animator is refreshed by user
        if (!animatorOn) return;
      }
    }

    return;
  },

  oddEvenSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
    let nums = [...numbers];
    let prevRunSorted = false;
    let curRunSorted = false;

    let startIdx = 1;
    let toggleIndices = [];
    while (!prevRunSorted || !curRunSorted) {
      prevRunSorted = curRunSorted;
      curRunSorted = true;
      toggleIndices = [];
      for (let idx = startIdx; idx < nums.length - 1; idx += 2) {
        toggleIndices.push(idx);
      }

      // call animator, interrupt if requested
      animatorOn = await animator({ toggle: true, toggleIndices });
      if (!animatorOn) return;

      for (let idx = startIdx; idx < nums.length - 1; idx += 2) {
        let numAction = { swap: false, swapIndices: [idx, idx + 1] };
        if (nums[idx] > nums[idx + 1]) {
          curRunSorted = false;
          nums[idx] = nums[idx] ^ nums[idx + 1];
          nums[idx + 1] = nums[idx] ^ nums[idx + 1];
          nums[idx] = nums[idx] ^ nums[idx + 1];
          numAction.swap = true;
        }
        // call animator, interrupt if requested
        animatorOn = await animator(numAction);
        if (!animatorOn) return;
      }
      // toggle odd/even mode
      startIdx = 1 - startIdx;
    }

    return;
  },

  selectionSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
    let nums = [...numbers];

    for (let curIdx = 0; curIdx < nums.length - 1; curIdx++) {
      let curNumber = nums[curIdx];
      let minIdx = curIdx;
      let minNumber = curNumber;
      for (let idx = curIdx + 1; idx < nums.length; idx++) {
        // call animator, interrupt if requested
        animatorOn = await animator({
          swap: false,
          swapIndices: [curIdx, idx],
        });
        if (!animatorOn) return;

        if (nums[idx] < minNumber) {
          if (minIdx !== curIdx) {
            // call animator, interrupt if requested
            animatorOn = await animator({
              swap: false,
              swapIndices: [curIdx],
              toggle: true,
              toggleIndices: [minIdx],
            });
            if (!animatorOn) return;
          }
          // call animator, interrupt if requested
          animatorOn = await animator({
            swap: false,
            swapIndices: [curIdx],
            toggle: true,
            toggleIndices: [idx],
          });
          if (!animatorOn) return;

          minIdx = idx;
          minNumber = nums[idx];
        }
      }
      if (minIdx !== curIdx) {
        nums[curIdx] = nums[minIdx];
        nums[minIdx] = curNumber;
        // call animator, interrupt if requested
        animatorOn = await animator({
          swap: true,
          swapIndices: [curIdx, minIdx],
        });
        if (!animatorOn) return;
      }
    }

    return;
  },

  // insertionSort: sort numbers by inserting everyone at its correct index
  //    traverse array from the beginning to the end
  //    for each number, traverse from the beginning to find
  //    the first number which the current number is less than
  //    then insert the current number at that index
  //    iterate from idx 0 to numsTotal-1
  insertionSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
    let nums = [...numbers];

    for (let curIdx = 1; curIdx < nums.length; curIdx++) {
      for (let targetIdx = 0; targetIdx < curIdx; targetIdx++) {
        let curNumber = nums[curIdx];
        if (curNumber < nums[targetIdx]) {
          // call animator, interrupt if requested
          animatorOn = await animator({
            toggle: true,
            toggleIndices: [targetIdx],
          });
          if (!animatorOn) return;

          for (let idx = curIdx; idx > targetIdx; idx--) {
            nums[idx] = nums[idx - 1];
            // call animator, interrupt if requested
            animatorOn = await animator({
              swap: true,
              swapIndices: [idx, idx - 1],
            });
            if (!animatorOn) return;
          }
          nums[targetIdx] = curNumber;
          break;
        } else {
          // call animator, interrupt if requested
          animatorOn = await animator({
            swap: false,
            swapIndices: [curIdx, targetIdx],
          });
          if (!animatorOn) return;
        }
      }
    }

    return;
  },

  // cycleSort: sort numbers by putting them at their correct indices
  //    for each number, its correct index = count of numbers less than it
  //    keep iterating until every number is at its correct index
  cycleSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
    let nums = [...numbers];
    let numsTotal = nums.length;

    let curIdx = 0;
    while (curIdx < numsTotal - 1) {
      let curNum = nums[curIdx];
      let numsLessTotal = -1;

      while (curIdx !== numsLessTotal) {
        numsLessTotal = curIdx;
        for (let idx = curIdx + 1; idx < numsTotal; idx++) {
          // call animator, interrupt if requested
          animatorOn = await animator({
            swap: false,
            swapIndices: [curIdx, idx],
          });
          if (!animatorOn) return;

          if (nums[idx] < curNum) {
            numsLessTotal++;
          }
        }
        if (curIdx !== numsLessTotal) {
          while (curNum === nums[numsLessTotal] && numsLessTotal !== curIdx) {
            numsLessTotal++;
            // call animator, interrupt if requested
            animatorOn = await animator({
              swap: false,
              swapIndices: [curIdx, numsLessTotal],
            });
            if (!animatorOn) return;
          }
          if (curIdx !== numsLessTotal) {
            curNum = nums[numsLessTotal];
            nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
            nums[curIdx] = nums[curIdx] ^ nums[numsLessTotal];
            nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
            // call animator, interrupt if requested
            animatorOn = await animator({
              toggle: true,
              toggleIndices: [curIdx, numsLessTotal],
            });
            animatorOn = await animator({
              swap: true,
              swapIndices: [curIdx, numsLessTotal],
            });
            if (!animatorOn) return;
          }
        }
      }
      nums[curIdx] = curNum;
      curIdx++;
    }

    return;
  },

  // radixSort: sort numbers from LSB to MSB (decimal base)
  radixSort: async function ({ nums: numbers, animator }) {
    let animatorOn = true;
    let nums = [...numbers];
    let numsTotal = nums.length;

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
      for (let idx = 0; idx < numsTotal; idx++) {
        // call animator, interrupt if requested
        animatorOn = await animator({
          swap: false,
          swapIndices: [idx],
        });
        if (!animatorOn) return;

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
      for (let idx = numsTotal - 1; idx >= 0; idx--) {
        let curNum = nums[idx];
        let digitIdx = digits.indexOf(
          ((curNum % divisor) - (curNum % prevDivisor)) / prevDivisor
        );
        let targetIdx = counts[digitIdx] - 1;
        // call animator, interrupt if requested
        animatorOn = await animator({
          toggle: true,
          toggleIndices: [targetIdx],
          set: true,
          setIndices: [targetIdx],
          setHeights: [curNum],
        });
        if (!animatorOn) return;

        newNums[targetIdx] = curNum;
        counts[digitIdx]--;
      }
      // keep going for the next more significant bit
      nums = newNums;
      prevDivisor = divisor;
      divisor *= 10;
    }

    return;
  },

  // mergeSort
  mergeSort: async function ({ nums, range, animator, animatorOn }) {
    let numsTotal = nums.length;
    if (range === undefined) {
      range = [0, numsTotal - 1];
    }
    if (animatorOn === undefined) {
      animatorOn = true;
    }

    // base cases
    if (numsTotal === 1) {
      // call animator, interrupt if requested
      animatorOn = await animator({
        swap: false,
        swapIndices: [range[0]],
        set: true,
        setIndices: [range[0]],
        setHeights: [nums[0]],
      });

      return { numsSorted: nums, range, animatorOn };
    }
    if (numsTotal === 2) {
      let swap = false;
      if (nums[0] > nums[1]) {
        nums.reverse();
        swap = true;
      }
      // call animator, interrupt if requested
      animatorOn = await animator({
        swap,
        swapIndices: range,
      });

      return { numsSorted: nums, range, animatorOn };
    }

    // recursively call mergeSort on left and right subarray
    let middleIdx = Math.floor(numsTotal / 2);
    let resultLeft = await this.mergeSort({
      nums: nums.slice(0, middleIdx),
      range: [range[0], range[0] + middleIdx - 1],
      animator,
    });
    if (!resultLeft.animatorOn) return { animatorOn: resultLeft.animatorOn };

    let resultRight = await this.mergeSort({
      nums: nums.slice(middleIdx),
      range: [range[0] + middleIdx, range[1]],
      animator,
    });
    if (!resultRight.animatorOn) return { animatorOn: resultRight.animatorOn };

    // merge left and right sorted subarray to a single array
    let numsSortedLeft = resultLeft.numsSorted;
    let numsSortedRight = resultRight.numsSorted;
    let numsSorted = [];
    while (numsSortedLeft.length > 0 && numsSortedRight.length > 0) {
      if (numsSortedLeft[0] < numsSortedRight[0]) {
        numsSorted.push(numsSortedLeft.shift());
      } else {
        numsSorted.push(numsSortedRight.shift());
      }
    }
    numsSorted = [...numsSorted, ...numsSortedLeft, ...numsSortedRight];

    // sorting animation
    for (let idx = 0; idx < numsSorted.length; idx++) {
      // call animator, interrupt if requested
      animatorOn = await animator({
        swap: false,
        swapIndices: [range[0] + idx],
        set: true,
        setIndices: [range[0] + idx],
        setHeights: [numsSorted[idx]],
      });
      if (!animatorOn) break;
    }

    return { numsSorted, range, animatorOn };
  },

  // quickSort
  quickSort: async function ({ nums: numbers, range, animator, animatorOn }) {
    let nums = [...numbers];
    let numsTotal = nums.length;
    if (range === undefined) {
      range = [0, numsTotal - 1];
    }
    if (animatorOn === undefined) {
      animatorOn = true;
    }

    // base case
    if (numsTotal < 2) {
      return { numsSorted: nums, range, animatorOn };
    }
    if (numsTotal === 2) {
      let numsSorted = [];
      let numAction = {};
      if (nums[0] <= nums[1]) {
        numsSorted = nums;
        numAction = { swap: false, swapIndices: [range[0], range[1]] };
      } else {
        numsSorted = nums.reverse();
        numAction = { swap: true, swapIndices: [range[0], range[1]] };
      }
      // call animator, interrupt if requested
      animatorOn = await animator(numAction);

      return { numsSorted, range, animatorOn };
    }

    // recursive calls
    let pivotIdx = numsTotal - 1;
    // call animator, interrupt if requested
    animatorOn = await animator({
      toggle: true,
      toggleIndices: [range[0] + pivotIdx],
    });
    if (!animatorOn) return { animatorOn };

    let numLeftIdx = 0;
    let numRightIdx = pivotIdx - 1;
    // call animator, interrupt if requested
    animatorOn = await animator({
      swap: false,
      swapIndices: [range[0] + numLeftIdx, range[0] + numRightIdx],
    });
    if (!animatorOn) return { animatorOn };

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
      // call animator, interrupt if requested
      animatorOn = await animator(numAction);
      if (!animatorOn) return { animatorOn };
    }
    // check the number at idx = numLeftIdx = numRightIdx
    let pivotNum = nums[pivotIdx];
    if (nums[numLeftIdx] <= pivotNum) {
      pivotIdx = numLeftIdx + 1;
    } else {
      pivotIdx = numLeftIdx;
    }
    // move pivot number to its correct position so that lefts < pivot < rights
    for (let idx = numsTotal - 1; idx > pivotIdx; idx--) {
      nums[idx] = nums[idx - 1];
      // call animator, interrupt if requested
      animatorOn = await animator({
        swap: false,
        swapIndices: [range[0] + idx - 1, range[0] + idx],
        set: true,
        setIndices: [range[0] + idx],
        setHeights: [nums[idx - 1]],
      });
      if (!animatorOn) return { animatorOn };
    }
    nums[pivotIdx] = pivotNum;
    // call animator, interrupt if requested
    animatorOn = await animator({
      toggle: true,
      toggleIndices: [range[0] + pivotIdx],
      set: true,
      setIndices: [range[0] + pivotIdx],
      setHeights: [pivotNum],
    });
    if (!animatorOn) return { animatorOn };

    // recusive calls on left and right subarrays
    let resultLeft = await this.quickSort({
      nums: nums.slice(0, pivotIdx),
      range: [range[0], range[0] + pivotIdx - 1],
      animator,
      animatorOn,
    });
    if (!resultLeft.animatorOn) return { animatorOn };
    let numsSortedLeft = resultLeft.numsSorted;

    let resultRight = await this.quickSort({
      nums: nums.slice(pivotIdx + 1, numsTotal),
      range: [range[0] + pivotIdx + 1, range[1]],
      animator,
      animatorOn,
    });
    if (!resultRight.animatorOn) return { animatorOn };
    let numsSortedRight = resultRight.numsSorted;

    nums = [...numsSortedLeft, pivotNum, ...numsSortedRight];

    return {
      numsSorted: nums,
      range,
      animatorOn,
    };
  },
};

export default sortingAlgos;
