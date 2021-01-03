function mergeSort(numbers, range = [0, numbers.length - 1], numActions = []) {
  let numsTotal = numbers.length;
  let actions = [];
  if (numsTotal === 1) {
    actions.push({ set: true, setIndices: range, setHeights: numbers });
    return { numsSorted: numbers, range, numActions: actions };
  }
  if (numsTotal === 2) {
    if (numbers[0] > numbers[1]) {
      numbers = numbers.reverse();
    }
    for (let idx = 0; idx < numsTotal; idx++) {
      actions.push({
        set: true,
        setIndices: range[idx],
        setHeights: numbers[idx],
      });
    }
    return { numsSorted: numbers, range, numActions: actions };
  }

  let medianIdx = Math.floor(numsTotal / 2);
  let {
    numsSorted: numsSortedLeft,
    range: rangeLeft,
    numActions: actionsLeft,
  } = mergeSort(numbers.slice(0, medianIdx), [range[0], medianIdx - 1]);
  let {
    numsSorted: numsSortedRight,
    range: rangeRight,
    numActions: actionsRight,
  } = mergeSort(numbers.slice(medianIdx), [medianIdx, range[1]]);

  numActions = numActions.concat([...actionsLeft, ...actionsRight]);

  let numLeftIdx = 0;
  let numRightIdx = 0;
  let numsSorted = [];
  while (
    numLeftIdx < numsSortedLeft.length &&
    numRightIdx < numsSortedRight.length
  ) {
    let numLeft = numsSortedLeft[numLeftIdx];
    let numRight = numsSortedRight[numRightIdx];
    if (numLeft < numRight) {
      numsSorted.push(numLeft);
      numActions.push({
        set: true,
        setIndices: [rangeLeft[0] + numLeftIdx],
        setHeights: [numLeft],
      });
      numLeftIdx++;
    } else {
      numsSorted.push(numRight);
      numActions.push({
        set: true,
        setIndices: [rangeRight[0] + numRightIdx],
        setHeights: [numRight],
      });
      numRightIdx++;
    }
  }
  if (numLeftIdx < medianIdx) {
    for (let idx = numLeftIdx; idx <= rangeLeft[1]; idx++) {
      numsSorted.push(numsSortedLeft[idx]);
      numActions.push({
        set: true,
        setIndices: [rangeLeft[0] + idx],
        setHeights: [numsSortedLeft[idx]],
      });
    }
  } else {
    for (let idx = numRightIdx; idx <= rangeRight[1]; idx++) {
      numsSorted.push(numsSortedRight[idx]);
      numActions.push({
        set: true,
        setIndices: [rangeRight[0] + idx],
        setHeights: [numsSortedRight[idx]],
      });
    }
  }

  return { numsSorted, range, numActions };
}

let a = [2, 40, 10, 3, 6, 2, 4];

function foo() {
  let arr = [1, 2, 3];
  return { arr };
}
let arrx = [1, 2, 3].slice(2);
console.log(arrx.length);
