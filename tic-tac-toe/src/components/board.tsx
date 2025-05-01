import { useState } from "react";

export const Board = () => {
  const initialState = Array(9).fill(null);
  const [board, setBoard] = useState(initialState);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const calculateWinner = (squares: string[]) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        setWinningCells([a, b, c]);
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return; // Ignore if cell is already filled or game is over

    const updatedBoard = [...board];
    updatedBoard[index] = isXNext ? "X" : "O";
    const newWinner = calculateWinner(updatedBoard);
    setBoard(updatedBoard);
    setIsXNext(!isXNext);

    if (newWinner) {
      setWinner(newWinner);
    }
  };

  const handleReset = () => {
    setBoard(initialState);
    setIsXNext(true);
    setWinner(null);
    setWinningCells([]);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
        <button
          className="px-2 py-1 bg-blue-500 text-white text-sm rounded mt-4 hover:bg-blue-700 cursor-pointer"
          onClick={() => handleReset()}
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-16 h-16 border-2 border-gray-500 ${
              winningCells.includes(idx) ? "bg-green-200" : ""
            } flex items-center justify-center text-2xl font-bold ${
              cell === "X"
                ? "text-blue-500"
                : cell === "O"
                ? "text-red-500"
                : ""
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      <div
        className={`mt-4 text-xl font-bold ${winner ? "text-green-500" : ""}`}
      >
        {winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? "X" : "O"}`}
      </div>
    </div>
  );
};
