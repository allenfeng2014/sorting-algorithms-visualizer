function cycleSort(numbers) {
  let nums = [...numbers];
  let length = nums.length;
  let curIdx = 0;
  while (curIdx < length - 1) {
    let curNum = nums[curIdx];
    let numsLessTotal = -1;

    while (curIdx !== numsLessTotal) {
      //console.log("curIdx = ", curIdx);
      //console.log("curNum ", curNum);
      numsLessTotal = curIdx;
      for (let idx = curIdx + 1; idx < length; idx++) {
        if (nums[idx] < curNum) {
          numsLessTotal++;
        }
      }
      //console.log("correct pos ", numsLessTotal);
      if (curIdx !== numsLessTotal) {
        while (curNum === nums[numsLessTotal] && numsLessTotal !== curIdx) {
          numsLessTotal++;
        }
        if (curIdx !== numsLessTotal) {
          curNum = nums[numsLessTotal];
          nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
          nums[curIdx] = nums[curIdx] ^ nums[numsLessTotal];
          nums[numsLessTotal] = nums[curIdx] ^ nums[numsLessTotal];
        }
      }
      //console.log(nums);
    }
    nums[curIdx] = curNum;
    curIdx++;
  }

  return nums;
}

function radixSort(numbers) {
  let nums = [...numbers];
  let divisor = 10;
  let prevDivisor = 1;
  let digits = [];
  for (let digit = -9; digit <= 9; digit++) {
    digits.push(digit);
  }

  let counter = 1;
  let noMoreDigits = false;
  while (!noMoreDigits) {
    console.log("iteration ", counter);
    noMoreDigits = true;

    let counts = new Array(digits.length).fill(0);
    for (let num of nums) {
      let digitIdx = digits.indexOf(
        ((num % divisor) - (num % prevDivisor)) / prevDivisor
      );
      counts[digitIdx]++;
      if (noMoreDigits && (num % (divisor * 10)) - (num % divisor) !== 0) {
        noMoreDigits = false;
      } else {
        console.log("num", num, "divisor", divisor, "no more digits");
      }
    }
    console.log("digits", digits, "counts", counts);
    for (let idx = 1; idx < counts.length; idx++) {
      counts[idx] += counts[idx - 1];
    }
    console.log("crrtPos", counts);

    let newNums = [...nums];
    for (let num of nums) {
      let digitIdx = digits.indexOf(
        ((num % divisor) - (num % prevDivisor)) / prevDivisor
      );
      newNums[counts[digitIdx] - 1] = num;
      counts[digitIdx]--;
    }
    console.log(newNums);
    nums = newNums;
    prevDivisor = divisor;
    divisor *= 10;
    counter++;
    console.log("noMoreDigits", noMoreDigits);
  }

  return nums;
}

function isArrayEqual(array1, array2) {
  if (array1.length !== array2.length) return false;
  array1.forEach((num1, idx) => {
    if (num1 !== array2[idx]) return false;
  });
  return true;
}

function test(algo, totalTrials) {
  let trialSuccessCount = 0;
  for (let trial = 0; trial < totalTrials; trial++) {
    let a = [];
    for (let i = 0; i < 50; i++) {
      a.push(Math.floor(Math.random() * 500 - 100));
      if (Math.random() < 0.2) {
        a[i] = a[i - 1];
      }
    }
    let trialSuccess = isArrayEqual(algo(a), a.sort());
    if (trialSuccess) trialSuccessCount++;
    console.log("trial ", trial + 1, "result: ", trialSuccess);
  }
  console.log("trials success rate: ", trialSuccessCount, "/", totalTrials);
}

//console.log(radixSort([0, 20, 21, 11, -10]));

test(cycleSort, 100);
