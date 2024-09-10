import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import TaskInput from "./components/popup/TaskInput";

interface Task {
  id: number;
  value: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [defaultTime, setDefaultTime] = useState(25); // Default time from Options
  const [isActive, setIsActive] = useState(false);

  // Load default time and current timer from background
  useEffect(() => {
    chrome.storage.sync.get(["defaultTime", "tasks"], (result) => {
      if (result.defaultTime) {
        setDefaultTime(result.defaultTime);
      }
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });

    chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
      setTimer(response.timerValue);
      setIsActive(response.status === "running");
    });

    // Set up a listener for timer updates from background.ts
    const handleTimerUpdate = (message: any) => {
      if (message.action === "updateTimer") {
        setTimer(message.timerValue);
      }
    };

    chrome.runtime.onMessage.addListener(handleTimerUpdate);

    // Clean up listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleTimerUpdate);
    };
  }, []);

  // Save tasks to sync when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      chrome.storage.sync.set({ tasks });
    }
  }, [tasks]);

  // Start/stop/reset the timer by sending messages to background.ts
  const startTimer = () => {
    chrome.runtime.sendMessage({ action: "startTimer" }, (response) => {
      setIsActive(true);
      setTimer(response.timerValue);
    });
  };

  const stopTimer = () => {
    chrome.runtime.sendMessage({ action: "stopTimer" }, (response) => {
      setIsActive(false);
      setTimer(response.timerValue);
    });
  };

  const resetTimer = () => {
    chrome.runtime.sendMessage(
      { action: "resetTimer", defaultTime },
      (response) => {
        setIsActive(false);
        setTimer(response.timerValue);
      }
    );
  };

  // Format the time to display as MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-start h-[600px] bg-gray-900 p-6 overflow-y-auto min-w-[350px]">
      <img
        src="/images/logo.jpg"
        alt="logo"
        className="w-20 h-20 rounded-full mb-6 border-4 border-indigo-500"
      />
      <div className="bg-gray-800 p-6 shadow-lg w-full rounded-xl flex flex-col">
        <h1 className="text-indigo-400 text-3xl font-bold mb-6 text-center">
          {formatTime(timer)}
        </h1>
        <div className="flex flex-col gap-3 mb-6">
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={isActive ? stopTimer : startTimer}
          >
            {isActive ? "Stop Timer" : "Start Timer"}
          </Button>
          <Button
            className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={resetTimer}
          >
            Reset Timer
          </Button>
          <Button
            className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={() =>
              setTasks((prevTasks) => [
                ...prevTasks,
                { id: Date.now(), value: "" },
              ])
            }
          >
            Add Task
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {tasks.map((task) => (
            <TaskInput
              key={task.id}
              id={task.id}
              value={task.value}
              onDelete={(id) =>
                setTasks((prevTasks) =>
                  prevTasks.filter((task) => task.id !== id)
                )
              }
              onUpdate={(id, value) =>
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === id ? { ...task, value } : task
                  )
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
