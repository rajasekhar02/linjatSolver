var mainPuzzle = [
    "  3  3 ",
    "3.2  . ",
    "  .43  ",
    ".5  .4 ",
    "   .5  ",
    "   5   ",
    "4.     ",
    " 3.    ",
    "3      ",
    "  3  4 "
].map(function (eachStr) {
    return Array.from(eachStr);
});
var dotsDictionary = mainPuzzle.reduce(function (acc, currRow, rowIndex) {
    currRow.forEach(function (currItem, colIndex) {
        if (currItem === ".") {
            acc["".concat(rowIndex, "_").concat(colIndex)] = false;
        }
    });
    return acc;
}, {});
var dotsPositions = mainPuzzle.reduce(function (acc, currRow, rowIndex) {
    currRow.forEach(function (currItem, colIndex) {
        if (currItem === ".") {
            acc.push([rowIndex, colIndex]);
        }
    });
    return acc;
}, []);
var numberPositions = mainPuzzle.reduce(function (acc, currRow, rowIndex) {
    currRow.forEach(function (currItem, colIndex) {
        if (parseInt(currItem)) {
            acc.push([rowIndex, colIndex]);
        }
    });
    return acc;
}, []);
var puzzleRows = mainPuzzle.length;
var puzzleCols = mainPuzzle[0].length;
var directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0] //"south"
];
// for (let i: number = 0; i < puzzleRows; i++) {
//   for (let j: number = 0; j < puzzleCols; j++) {
//     console.log(mainPuzzle[i][j]);
//   }
//   console.log("\n");
// }
function checkAllDotsAreCovered(puzzle) {
    return dotsPositions.every(function (_a) {
        var rowIndex = _a[0], colIndex = _a[1];
        return puzzle[rowIndex][colIndex] !== ".";
    });
}
function checkAllNumberAreCovered(puzzle) {
    return numberPositions.every(function (_a) {
        var rowIndex = _a[0], colIndex = _a[1];
        return isNaN(+puzzle[rowIndex][colIndex]);
    });
}
function fillFromRivetInDirectionNS(puzzle, newPuzzle, rodLength, rivet, currentDirection, positionX, positionY, fillStr) {
    var canFill = true;
    // handling east and west directions
    var startPosition = positionY - currentDirection[1] * rivet;
    var endPostion = startPosition + currentDirection[1] * rodLength;
    if (startPosition < 0 || startPosition >= puzzleCols)
        return "CANNOT_FILL";
    if (endPostion < 0 || endPostion >= puzzleCols)
        return "CANNOT_FILL";
    if (puzzle[positionX][startPosition] !== " " &&
        puzzle[positionX][startPosition] !== "." &&
        (isNaN(+puzzle[positionX][startPosition]) ||
            isFinite(+puzzle[positionX][startPosition]))) {
        return "CANNOT_FILL";
    }
    newPuzzle[positionX][startPosition] = fillStr;
    for (var iter = 1; iter < rodLength; iter++) {
        var currPosition = startPosition + currentDirection[1] * iter;
        if (puzzle[positionX][currPosition] === " " ||
            puzzle[positionX][currPosition] === "." ||
            currPosition === positionY) {
            newPuzzle[positionX][currPosition] = fillStr;
        }
        else {
            canFill = false;
            break;
        }
    }
    if (!canFill) {
        return "CANNOT_FILL";
    }
    return "FILLED";
}
function fillFromRivetInDirectionEW(puzzle, newPuzzle, rodLength, rivet, currentDirection, positionX, positionY, fillStr) {
    var canFill = true;
    var startPosition = positionX - currentDirection[0] * rivet;
    var endPostion = startPosition + currentDirection[0] * rodLength;
    if (startPosition < 0 || startPosition >= puzzleRows)
        return "CANNOT_FILL";
    if (endPostion < 0 || endPostion >= puzzleRows)
        return "CANNOT_FILL";
    if (puzzle[startPosition][positionY] !== " " &&
        puzzle[startPosition][positionY] !== "." &&
        (isNaN(+puzzle[startPosition][positionY]) ||
            isFinite(+puzzle[startPosition][positionY]))) {
        return "CANNOT_FILL";
    }
    newPuzzle[startPosition][positionY] = fillStr;
    for (var iter = 1; iter < rodLength; iter++) {
        var currPosition = startPosition + currentDirection[0] * iter;
        if (puzzle[currPosition][positionY] === " " ||
            puzzle[currPosition][positionY] === "." ||
            currPosition === positionX) {
            newPuzzle[currPosition][positionY] = fillStr;
        }
        else {
            canFill = false;
            break;
        }
    }
    if (!canFill) {
        return "CANNOT_FILL";
    }
    return "FILLED";
}
function linjatSolver(puzzle, positionX, positionY) {
    // handling invalid x values
    if (checkAllDotsAreCovered(puzzle) && checkAllNumberAreCovered(puzzle)) {
        console.log(puzzle.map(function (x) { return x.map(function (y) { return y.padEnd(7, " "); }).join(""); }).join("\n"));
        return "FOUND_SOLUTION";
    }
    if (positionX < 0 || positionX >= puzzleRows) {
        // console.log(
        //   puzzle.map((x) => x.map((y) => y.padEnd(5, " ")).join("")).join("\n")
        // );
        return "FAKE_SOLUTION";
    }
    if (positionY < 0 || positionY >= puzzleCols) {
        // handling invalid y values
        return linjatSolver(puzzle, positionX + 1, 0);
    }
    // handling empty cells
    if (puzzle[positionX][positionY] === " ") {
        return linjatSolver(puzzle, positionX, positionY + 1);
    }
    // handling the filled cells
    if (isNaN(+puzzle[positionX][positionY])) {
        return linjatSolver(puzzle, positionX, positionY + 1);
    }
    var rodLength = +puzzle[positionX][positionY];
    puzzle[positionX][positionY] = " ";
    // rivet position
    for (var rivet = 0; rivet < rodLength; rivet++) {
        // direction rod
        for (var direction = 0; direction < 4; direction++) {
            var canFill = true;
            var currentDirection = directions[direction];
            var newPuzzle = JSON.parse(JSON.stringify(puzzle));
            var fillStr = "".concat(positionX, "_").concat(positionY, "_").concat(rodLength);
            newPuzzle[positionX][positionY] = " ";
            // handling north and south directions
            if (direction > 1) {
                var fillResult_1 = fillFromRivetInDirectionEW(puzzle, newPuzzle, rodLength, rivet, currentDirection, positionX, positionY, fillStr);
                if (fillResult_1 === "CANNOT_FILL")
                    continue;
                var result_1 = linjatSolver(newPuzzle, positionX, positionY + 1);
                if (result_1 === "FOUND_SOLUTION") {
                    return result_1;
                }
                continue;
            }
            var fillResult = fillFromRivetInDirectionNS(puzzle, newPuzzle, rodLength, rivet, currentDirection, positionX, positionY, fillStr);
            if (fillResult === "CANNOT_FILL")
                continue;
            var result = linjatSolver(newPuzzle, positionX, positionY + 1);
            if (result === "FOUND_SOLUTION") {
                return result;
            }
        }
    }
    puzzle[positionX][positionY] = "" + rodLength;
    // console.log(puzzle);
    return "NO_SOLUTION"; // no solution found
}
console.log(linjatSolver(mainPuzzle, 0, 0));
