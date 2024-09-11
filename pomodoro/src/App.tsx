// App.tsx

import {
  TimerState,
  timerState as timerStateDefault,
} from "@/background/background";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui";
import TaskInput from "@/components/popup/TaskInput";

interface Task {
  id: number;
  value: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timerState, setTimerState] = useState<TimerState>(timerStateDefault);

  const updateTimerState = useCallback((newState: Partial<TimerState>) => {
    setTimerState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["timerState", "tasks"], (result) => {
      if (result.timerState) {
        setTimerState(result.timerState);
      }
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });

    const handleTimerUpdate = (message: any) => {
      if (message.action === "updateTimer") {
        updateTimerState(message.timerState);
      }
    };

    chrome.runtime.onMessage.addListener(handleTimerUpdate);
    return () => {
      chrome.runtime.onMessage.removeListener(handleTimerUpdate);
    };
  }, [updateTimerState]);

  useEffect(() => {
    if (tasks.length > 0) {
      chrome.storage.local.set({ tasks });
    }
  }, [tasks]);

  const sendTimerAction = useCallback(
    (action: string, data = {}) => {
      chrome.runtime.sendMessage({ action, ...data }, (response) => {
        if (response) {
          updateTimerState(response);
        }
      });
    },
    [updateTimerState]
  );

  const startTimer = () => sendTimerAction("startTimer");
  const stopTimer = () => sendTimerAction("stopTimer");
  const resetTimer = () =>
    sendTimerAction("resetTimer", { defaultTime: timerState.defaultTime });

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isBreakTime = timerState.value <= 5 * 60; // Assuming break time is 5 minutes or less

  return (
    <div className="flex flex-col items-center justify-start h-[600px] bg-gray-900 p-6 overflow-y-auto min-w-[350px]">
      <img
        src="/images/logo.jpg"
        alt="logo"
        className="w-20 h-20 rounded-full mb-6 border-4 border-indigo-500"
      />
      <div className="bg-gray-800 p-6 shadow-lg w-full rounded-xl flex flex-col">
        <h1 className="text-indigo-400 text-3xl font-bold mb-6 text-center">
          {formatTime(timerState.value)}
        </h1>
        <p className="text-center text-indigo-300 mb-4">
          {isBreakTime ? "Break Time" : "Focus Time"}
        </p>
        <div className="flex flex-col gap-3 mb-6">
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={timerState.isActive ? stopTimer : startTimer}
          >
            {timerState.isActive ? "Stop Timer" : "Start Timer"}
          </Button>
          <Button
            className={`rounded-xl py-3 transition-all duration-300 ease-in-out ${
              timerState.isActive
                ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-indigo-300 hover:bg-gray-600"
            }`}
            onClick={resetTimer}
            disabled={timerState.isActive}
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
