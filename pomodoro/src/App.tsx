import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui";
import TaskInput from "@/components/popup/TaskInput";

interface Task {
  id: number;
  value: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load tasks from storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(["tasks"], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  // Function to sync tasks after a 500ms delay
  const syncTasksWithDelay = (newTasks: Task[]) => {
    // Clear the previous timeout if a new change happens before 500ms
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout for syncing after 500ms of inactivity
    debounceTimeoutRef.current = setTimeout(() => {
      chrome.storage.sync.set({ tasks: newTasks });
    }, 500);
  };

  // Add a new task
  const addTask = () => {
    const newTasks = [...tasks, { id: Date.now(), value: "" }];
    setTasks(newTasks);
    syncTasksWithDelay(newTasks); // Sync changes with delay
  };

  // Delete a task
  const deleteTask = (id: number) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    syncTasksWithDelay(newTasks); // Sync changes with delay
  };

  // Update a task
  const updateTask = (id: number, value: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, value } : task
    );
    setTasks(newTasks);
    syncTasksWithDelay(newTasks); // Sync changes with delay
  };

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);

  // Start the timer
  const startTimer = () => setIsActive(true);

  // Reset the timer
  const resetTimer = () => {
    setIsActive(false);
    setTimer(25 * 60);
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
            onClick={startTimer}
          >
            Start Timer
          </Button>
          <Button
            className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={resetTimer}
          >
            Reset Timer
          </Button>
          <Button
            className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out"
            onClick={addTask}
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
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
