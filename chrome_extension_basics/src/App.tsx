import "./App.css";

import { useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [currentTime, setCurrentTime] = useState("");

  // useEffect to set up the interval for updating the current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Set options for 12-hour format with AM/PM
      const options: Intl.DateTimeFormatOptions = {
        hour: "numeric", // Use 'numeric' or '2-digit'
        minute: "numeric", // Use 'numeric' or '2-digit'
        second: "numeric", // Use 'numeric' or '2-digit'
        hour12: true, // Enable 12-hour format
      };
      setCurrentTime(now.toLocaleTimeString(undefined, options)); // Update the current time
    };

    updateTime(); // Set the initial time immediately
    const intervalId = setInterval(updateTime, 1000); // Update every second

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <div className="flex justify-center items-center">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Timer Extension</h1>
      <div className="card">
        <button>Time is {currentTime}</button>
        {/* <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p> */}
      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
