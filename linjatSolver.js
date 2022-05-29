var mainPuzzle = [
    "3      ",
    " 2     ",
    "  34   ",
    "4.     ",
    " 4 .  3",
    "  4.  2",
    ".4     ",
    "     52",
    "5  . ..",
    "   2  2"
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
function linjatSolver(puzzle, positionX, positionY) {
    // handling invalid x values
    if (checkAllDotsAreCovered(puzzle) && checkAllNumberAreCovered(puzzle)) {
        console.log(puzzle.map(function (x) { return x.map(function (y) { return y.padEnd(5, " "); }).join(""); }).join("\n"));
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
            var fillStr = "".concat(positionX, "_").concat(positionY);
            newPuzzle[positionX][positionY] = " ";
            // handling north and south directions
            if (direction > 1) {
                var startPosition_1 = positionX - currentDirection[0] * rivet;
                var endPostion_1 = startPosition_1 + currentDirection[0] * rodLength;
                if (startPosition_1 < 0 || startPosition_1 >= puzzleRows)
                    continue;
                if (endPostion_1 < 0 || endPostion_1 >= puzzleRows)
                    continue;
                if (puzzle[startPosition_1][positionY] !== " " &&
                    puzzle[startPosition_1][positionY] !== "." &&
                    isNaN(+puzzle[startPosition_1][positionY])) {
                    continue;
                }
                newPuzzle[startPosition_1][positionY] = fillStr;
                for (var iter = 1; iter < rodLength; iter++) {
                    var currPosition = startPosition_1 + currentDirection[0] * iter;
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
                    continue;
                }
                var result_1 = linjatSolver(newPuzzle, positionX, positionY + 1);
                if (result_1 === "FOUND_SOLUTION") {
                    return result_1;
                }
                continue;
            }
            // handling east and west directions
            var startPosition = positionY - currentDirection[1] * rivet;
            var endPostion = startPosition + currentDirection[1] * rodLength;
            if (startPosition < 0 || startPosition >= puzzleCols)
                continue;
            if (endPostion < 0 || endPostion >= puzzleCols)
                continue;
            if (puzzle[positionX][startPosition] !== " " &&
                puzzle[positionX][startPosition] !== "." &&
                isNaN(+puzzle[positionX][startPosition])) {
                continue;
            }
            newPuzzle[positionX][startPosition] = fillStr;
            for (var iter = 1; iter < rodLength; iter++) {
                var currPosition = startPosition + currentDirection[1] * iter;
                if (currPosition < 0) {
                    canFill = false;
                    break;
                }
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
                continue;
            }
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
