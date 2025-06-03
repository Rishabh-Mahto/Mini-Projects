import { useState, useEffect } from "react";

export const Board = () => {
  const [size, setSize] = useState<number>(3);
  const [board, setBoard] = useState<string[]>(Array(size * size).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [winningCombinations, setWinningCombinations] = useState<number[][]>(
    []
  );

  const generateWinningCombinations = (size: number): number[][] => {
    const lines: number[][] = [];

    // Rows
    for (let row = 0; row < size; row++) {
      const start = row * size;
      lines.push([...Array(size)].map((_, i) => start + i));
    }

    // Columns
    for (let col = 0; col < size; col++) {
      lines.push([...Array(size)].map((_, i) => col + i * size));
    }

    // Diagonal TL -> BR
    lines.push([...Array(size)].map((_, i) => i * (size + 1)));

    // Diagonal TR -> BL
    lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1)));

    return lines;
  };

  const initializeGame = (newSize: number) => {
    setBoard(Array(newSize * newSize).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningCells([]);
    setWinningCombinations(generateWinningCombinations(newSize));
  };

  useEffect(() => {
    initializeGame(size);
  }, [size]);

  const calculateWinner = (squares: string[]) => {
    for (let combo of winningCombinations) {
      const values = combo.map((index) => squares[index]);
      if (values.every((val) => val && val === values[0])) {
        setWinningCells(combo);
        return values[0];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const updatedBoard = [...board];
    updatedBoard[index] = isXNext ? "X" : "O";

    const newWinner = calculateWinner(updatedBoard);
    setBoard(updatedBoard);
    setIsXNext(!isXNext);
    if (newWinner) setWinner(newWinner);
  };

  const handleReset = () => {
    initializeGame(size);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-lg">Board Size:</label>
        <input
          type="number"
          min={3}
          max={10}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border px-2 py-1 w-16 text-center"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${size}, 4rem)` }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-16 h-16 border-2 border-gray-500 flex items-center justify-center text-2xl font-bold ${
              winningCells.includes(idx) ? "bg-green-200" : ""
            } ${
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
