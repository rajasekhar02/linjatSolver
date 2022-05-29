const mainPuzzle: Array<Array<string>> = [
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
].map((eachStr: string) => {
  return Array.from(eachStr);
});
interface dotsDicType {
  [index: string]: boolean;
}

const dotsDictionary: dotsDicType = mainPuzzle.reduce(
  (acc: dotsDicType, currRow: Array<string>, rowIndex: number) => {
    currRow.forEach((currItem: string, colIndex: number) => {
      if (currItem === ".") {
        acc[`${rowIndex}_${colIndex}`] = false;
      }
    });
    return acc;
  },
  {} as dotsDicType
);
const dotsPositions: Array<[number, number]> = mainPuzzle.reduce(
  (acc: Array<[number, number]>, currRow: Array<string>, rowIndex: number) => {
    currRow.forEach((currItem: string, colIndex: number) => {
      if (currItem === ".") {
        acc.push([rowIndex, colIndex]);
      }
    });
    return acc;
  },
  [] as Array<[number, number]>
);
const numberPositions: Array<[number, number]> = mainPuzzle.reduce(
  (acc: Array<[number, number]>, currRow: Array<string>, rowIndex: number) => {
    currRow.forEach((currItem: string, colIndex: number) => {
      if (parseInt(currItem)) {
        acc.push([rowIndex, colIndex]);
      }
    });
    return acc;
  },
  [] as Array<[number, number]>
);
const puzzleRows: number = mainPuzzle.length;
const puzzleCols: number = mainPuzzle[0].length;
const directions: Array<[number, number]> = [
  [0, 1], //"east",
  [0, -1], //"west",
  [1, 0], //"north",
  [-1, 0] //"south"
];
// for (let i: number = 0; i < puzzleRows; i++) {
//   for (let j: number = 0; j < puzzleCols; j++) {
//     console.log(mainPuzzle[i][j]);
//   }
//   console.log("\n");
// }
function checkAllDotsAreCovered(puzzle: Array<Array<string>>): boolean {
  return dotsPositions.every(
    ([rowIndex, colIndex]: [number, number]) =>
      puzzle[rowIndex][colIndex] !== "."
  );
}
function checkAllNumberAreCovered(puzzle: Array<Array<string>>): boolean {
  return numberPositions.every(([rowIndex, colIndex]: [number, number]) =>
    isNaN(+puzzle[rowIndex][colIndex])
  );
}
function linjatSolver(
  puzzle: Array<Array<string>>,
  positionX: number,
  positionY: number
): string {
  // handling invalid x values
  if (checkAllDotsAreCovered(puzzle) && checkAllNumberAreCovered(puzzle)) {
    console.log(
      puzzle.map((x) => x.map((y) => y.padEnd(5, " ")).join("")).join("\n")
    );
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
  let rodLength: number = +puzzle[positionX][positionY];
  puzzle[positionX][positionY] = " ";
  // rivet position
  for (let rivet: number = 0; rivet < rodLength; rivet++) {
    // direction rod
    for (let direction: number = 0; direction < 4; direction++) {
      let canFill: boolean = true;
      const currentDirection: [number, number] = directions[direction];
      const newPuzzle = JSON.parse(JSON.stringify(puzzle));
      const fillStr: string = `${positionX}_${positionY}`;
      newPuzzle[positionX][positionY] = " ";
      // handling north and south directions
      if (direction > 1) {
        const startPosition = positionX - currentDirection[0] * rivet;
        const endPostion = startPosition + currentDirection[0] * rodLength;
        if (startPosition < 0 || startPosition >= puzzleRows) continue;
        if (endPostion < 0 || endPostion >= puzzleRows) continue;
        if (
          puzzle[startPosition][positionY] !== " " &&
          puzzle[startPosition][positionY] !== "." &&
          isNaN(+puzzle[startPosition][positionY])
        ) {
          continue;
        }
        newPuzzle[startPosition][positionY] = fillStr;
        for (let iter: number = 1; iter < rodLength; iter++) {
          const currPosition: number =
            startPosition + currentDirection[0] * iter;
          if (
            puzzle[currPosition][positionY] === " " ||
            puzzle[currPosition][positionY] === "." ||
            currPosition === positionX
          ) {
            newPuzzle[currPosition][positionY] = fillStr;
          } else {
            canFill = false;
            break;
          }
        }
        if (!canFill) {
          continue;
        }
        const result: string = linjatSolver(
          newPuzzle,
          positionX,
          positionY + 1
        );
        if (result === "FOUND_SOLUTION") {
          return result;
        }
        continue;
      }
      // handling east and west directions
      const startPosition = positionY - currentDirection[1] * rivet;
      const endPostion = startPosition + currentDirection[1] * rodLength;
      if (startPosition < 0 || startPosition >= puzzleCols) continue;
      if (endPostion < 0 || endPostion >= puzzleCols) continue;
      if (
        puzzle[positionX][startPosition] !== " " &&
        puzzle[positionX][startPosition] !== "." &&
        isNaN(+puzzle[positionX][startPosition])
      ) {
        continue;
      }
      newPuzzle[positionX][startPosition] = fillStr;
      for (let iter: number = 1; iter < rodLength; iter++) {
        const currPosition: number = startPosition + currentDirection[1] * iter;
        if (currPosition < 0) {
          canFill = false;
          break;
        }
        if (
          puzzle[positionX][currPosition] === " " ||
          puzzle[positionX][currPosition] === "." ||
          currPosition === positionY
        ) {
          newPuzzle[positionX][currPosition] = fillStr;
        } else {
          canFill = false;
          break;
        }
      }
      if (!canFill) {
        continue;
      }
      const result: string = linjatSolver(newPuzzle, positionX, positionY + 1);
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
