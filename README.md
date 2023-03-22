# linjatSolver
The above code is a TypeScript implementation of a logic puzzle game [linjat](https://linjat.snellman.net/#fp) that involves filling a grid with rods of various lengths in a way that satisfies certain constraints specified in the input puzzle. 
The game involves placing rods on a grid of cells with each rod having a specific length and a rivet marked on it. 
The game requires that the rods be placed in a way that satisfies the following rules:
  1. No two rods overlap.
  2. The length of the rod matches the number shown in the corresponding cell of the grid.
  3. Rivets should be placed at the ends of the rods, and all rivets should be connected.

The code reads in a puzzle, which is a multi-dimensional array of strings, with numbers representing the length of the rod and dots representing empty cells, and spaces representing cells that cannot be filled. The code then solves the puzzle by filling the grid with rods of the appropriate length and rivets in the appropriate positions. The code uses several helper functions to accomplish this, including functions for checking if all dots and numbers are covered, and functions for filling rods in different directions.
