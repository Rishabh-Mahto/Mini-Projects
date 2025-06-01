import { useState } from "react";

export const GridClickReverse = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [totalCells, setTotalCells] = useState<number>(0);
  const [clickedOrder, setClickedOrder] = useState<number[]>([]);
  const [activeCells, setActiveCells] = useState<boolean[]>(
    Array(totalCells).fill(false)
  );
  const [resetting, setResetting] = useState(false);

  const handleCellClick = (index: number) => {
    if (resetting || activeCells[index]) return;

    // Mark the cell as active
    const newActive = [...activeCells];
    console.log("clicked", index, newActive);
    newActive[index] = true;
    setActiveCells(newActive);

    //Append to order
    const newOrder = [...clickedOrder, index];
    console.log("new order", newOrder);

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

  function handleCreateCells() {
    const num = parseInt(inputValue) || 0;
    if (num < 1 || num > 100) {
      alert("Please enter a number between 1 and 100.");
      return;
    }
    setTotalCells(num);
  }

  console.log(Array.from({ length: totalCells }), "l");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1>Select the number of cells</h1>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCells();
        }}
        className="flex items-center gap-2 justify-center my-4"
      >
        <input
          type="number"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Enter number of cells"
          className="border border-gray-300 p-2 rounded-md text-sm"
        />
        <button
          type="submit"
          className="cursor-pointer border p-2 text-sm rounded-md text-amber-50 bg-black"
        >
          Create
        </button>
      </form>

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
