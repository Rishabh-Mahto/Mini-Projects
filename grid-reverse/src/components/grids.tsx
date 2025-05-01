import { useState } from "react";

export const GridClickReverse = () => {
  const totalCells = 16;
  const [clickedOrder, setClickedOrder] = useState<number[]>([]);
  const [activeCells, setActiveCells] = useState<boolean[]>(
    Array(totalCells).fill(false)
  );
  const [resetting, setResetting] = useState(false);

  const handleCellClick = (index: number) => {
    if (resetting || activeCells[index]) return;

    // Mark the cell as active
    const newActive = [...activeCells];
    newActive[index] = true;
    setActiveCells(newActive);

    //Append to order
    const newOrder = [...clickedOrder, index];

    setClickedOrder(newOrder);

    // after the last cell, start the reverse reset
    if (newOrder.length === totalCells) {
      setTimeout(() => {
        startReverseReset(newOrder);
      }, 1000); // Wait a second before starting the reset
    }
  };

  const startReverseReset = (order: number[]) => {
    setResetting(true);

    const rev = [...order].reverse();

    rev.forEach((cellIndex, i) => {
      setTimeout(() => {
        setActiveCells((prev) => {
          const next = [...prev];
          next[cellIndex] = false;
          return next;
        });

        // once we've processed the final one, clear everything
        if (i === rev.length - 1) {
          setTimeout(() => {
            setClickedOrder([]);
            setResetting(false);
          }, 1000);
        }
      }, i * 1000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="grid grid-cols-4 ">
        {Array.from({ length: totalCells }).map((_, index) => (
          <div
            key={index}
            className={`w-16 h-16 border border-gray-300 ${
              activeCells[index] ? "bg-blue-500" : "bg-white"
            }`}
            onClick={() => {
              handleCellClick(index);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
