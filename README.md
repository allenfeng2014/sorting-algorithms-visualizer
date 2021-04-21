# Sorting Algorithms Visualizer

https://allenfeng2014.github.io/sorting-algorithms-visualizer/

## Fall 2019

## Introduction

Animation of sorting algorithms: bubble sort, odd-even sort, selection sort, insertion sort, cycle sort, radix sort, merge sort, quick sort. Website was created using ReactJS. Speed of animation (ms/frame) and amount of numbers can be manually changed. Unsorted/sorted new numbers can be generated for new animation.

## Implementation

The projects implements async functions for real-time DOM updates. An async animator function returns a promise that resolves in a certain amount of time (based on animation speed set by user). Sorting functions are async, each time a sorting operation (swap numbers, change target number, etc...) needs to be performed, the sorting function calls the animator and wait until it completes.
