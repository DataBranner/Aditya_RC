//Generates a well-defined (unique) sudoku puzzle with as many elements removed as possible

//takes a 2d array (puzzle) and returns an array of coordinates [i, j] with empty (0) elements
function emptyCellCoordinatesGen(puzz) {
  var emptyCells = [];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (puzz[i][j] === 0)
        emptyCells.push([i, j]);
    }
  }
  return emptyCells;
}

//generates an empty puzzle of 0s
function emptyPuzzleGenerator(){
  var emptyPuzz = [];
  for(var i = 0; i <= 8; i++){
    emptyPuzz[i] = [];
    for(var j = 0; j <= 8; j++){
      emptyPuzz[i][j] = 0;
    }
  }
  return emptyPuzz;
}

var stdSolveArray = [1,2,3,4,5,6,7,8,9];
//takes an array input and returns a new array that is a randomly shuffled version of the input
function shuffleArray(arr){
  arr = arr.slice();
  var randomArray = [];
  var arrLength = arr.length;
  while(randomArray.length < arrLength){
    var randomIndex = Math.floor(Math.random()*arr.length);
    randomArray.push(arr.splice(randomIndex, 1)[0]);
  }
  return randomArray;
}

//takes a sudoku puzzle as an input and returns true if 
function isUnique(puzz){
  var origSolution = solve(false, stdSolveArray, puzz);
  for(var i = 0; i <= 10; i++){
    var newSolution = solve(false, shuffleArray(stdSolveArray), puzz);
    if(origSolution.toString() != newSolution.toString())
      return false;
  }
  return true;
}

function uniquePuzzleGen(startPuzzle){
  if(!startPuzzle){ 
    startPuzzle = emptyPuzzleGenerator();
  }
  var randomPuzzle = solve(true, [], startPuzzle);
  var randomCoordinates = shuffleArray(emptyCellCoordinatesGen(emptyPuzzleGenerator()));
  while(randomCoordinates.length > 0){
    var temp = randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]];
    randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]] = 0;
    if(!isUnique(randomPuzzle)){
      randomPuzzle[randomCoordinates[0][0]][randomCoordinates[0][1]] = temp;
    }
    randomCoordinates.shift();
  }
  return randomPuzzle;
}

function clonePuzzle(puzz){
  var clonedPuzz = [];
  for(var i = 0; i < puzz.length; i++){
    //console.log(puzz[i]);
    clonedPuzz.push(puzz[i].slice(0));
  }
  return clonedPuzz;
}

function solve(randomize, solveArray, puzz1) {
  var puzz = clonePuzzle(puzz1);
  function inRow(num, rowIndex) {
    return puzz[rowIndex].indexOf(num) > -1;
  }

  function inCol(num, colIndex) {
    var col = [];
    puzz.forEach(function(row) {
      col.push(row[colIndex]);
    });
    return col.indexOf(num) > -1;
  }

  function inBox(num, rowIndex, colIndex) {
    //array of all elements in corresponding box
    var boxTopLeftCoordinates = [
      [0, 0],
      [0, 3],
      [0, 6],
      [3, 0],
      [3, 3],
      [3, 6],
      [6, 0],
      [6, 3],
      [6, 6]
    ];
    var correspondingBox = boxTopLeftCoordinates.filter(function(box) {
      return (rowIndex >= box[0] && rowIndex < box[0] + 3) && (colIndex >= box[1] && colIndex < box[1] + 3);
    });
    var boxArray = [];
    for (var i = correspondingBox[0][0]; i <= correspondingBox[0][0] + 2; i++) {
      for (var j = correspondingBox[0][1]; j <= correspondingBox[0][1] + 2; j++) {
        boxArray.push(puzz[i][j]);
      }
    }
    return boxArray.indexOf(num) > -1;
  }

  function isValid(num, rowIndex, colIndex) {
    return !inRow(num, rowIndex, colIndex) && !inCol(num, colIndex) && !inBox(num, rowIndex, colIndex);
  }
  var i = 0,
    steps = 0,
    emptyCell = emptyCellCoordinatesGen(puzz),
    n;
  while (i < emptyCell.length) {
    steps++;
    if (steps > 1000000)
      return false;
    if(randomize)
      solveArray = shuffleArray(stdSolveArray);
    if (puzz[emptyCell[i][0]][emptyCell[i][1]] === 0)
      n = 0;
    else
      n = solveArray.indexOf(puzz[emptyCell[i][0]][emptyCell[i][1]]) + 1;
    while (!isValid(solveArray[n], emptyCell[i][0], emptyCell[i][1]) && n <= solveArray.length - 1) {
      n++;
    }
    if (n == solveArray.length) {
      puzz[emptyCell[i][0]][emptyCell[i][1]] = 0;
      i--;
      if (i == -1)
        return false;
      continue;
    }
    puzz[emptyCell[i][0]][emptyCell[i][1]] = solveArray[n];
    i++;
  }
  //console.log('steps', steps);
  return puzz;
}

function sudoku(puzz) {
  var solveArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return solve(false, solveArray, puzz);
}

function numOfEmptyCells(puzz){
  return puzz.reduce(function(total, curr){
    return total + curr.reduce(function(sum, current){
      if(current === 0)
        return sum + 1;
      else 
        return sum;
    }, 0);
  }, 0);
}

var puzzleSolved = [ [ 8, 1, 2, 7, 5, 3, 6, 4, 9 ],
  [ 9, 4, 3, 6, 8, 2, 1, 7, 5 ],
  [ 6, 7, 5, 4, 9, 1, 2, 8, 3 ],
  [ 1, 5, 4, 2, 3, 7, 8, 9, 6 ],
  [ 3, 6, 9, 8, 4, 5, 7, 2, 1 ],
  [ 2, 8, 7, 1, 6, 9, 5, 3, 4 ],
  [ 5, 2, 1, 9, 7, 4, 3, 6, 8 ],
  [ 4, 3, 8, 5, 2, 6, 9, 1, 7 ],
  [ 7, 9, 6, 3, 1, 8, 4, 5, 2 ] ];
//console.log(isUnique(puzz11));
console.log(uniquePuzzleGen());
//console.log(numOfEmptyCells(puzzleSolved));