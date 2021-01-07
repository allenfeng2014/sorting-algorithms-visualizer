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

function isArrayEqual(array1, array2) {
  if (array1.length !== array2.length) return false;
  array1.forEach((num1, idx) => {
    if (num1 !== array2[idx]) return false;
  });
  return true;
}

function test(totalTrials) {
  let trialSuccessCount = 0;
  for (let trial = 0; trial < totalTrials; trial++) {
    let a = [];
    for (let i = 0; i < 20; i++) {
      a.push(Math.floor(Math.random() * 500 - 100));
    }
    let trialSuccess = isArrayEqual(cycleSort(a), a.sort());
    if (trialSuccess) trialSuccessCount++;
    console.log("trial ", trial + 1, "result: ", trialSuccess);
  }
  console.log("trials success rate: ", trialSuccessCount, "/", totalTrials);
}

//cycleSort([0, 2, 1, 1, -1]);

test(100);
