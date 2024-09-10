import { Button, Input } from "@/components/ui";
import React, { useEffect, useState } from "react";

interface TaskInputProps {
  id: number;
  value: string;
  onDelete: (id: number) => void;
  onUpdate: (id: number, value: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({
  id,
  value,
  onDelete,
  onUpdate,
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Update task whenever the input value changes
  useEffect(() => {
    // Ensure that the updateTask doesn't cause infinite re-renders
    if (inputValue !== value) {
      onUpdate(id, inputValue);
    }
  }, [inputValue, id, value, onUpdate]);

  return (
    <div className="flex gap-3 items-center mt-3">
      <Input
        className="bg-gray-700 border-2 border-gray-600 p-3 flex-grow placeholder:text-gray-400 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter task"
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
      />
      <Button
        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-6 py-3 transition-all duration-300 ease-in-out"
        onClick={() => onDelete(id)}
      >
        Del
      </Button>
    </div>
  );
};

export default TaskInput;
