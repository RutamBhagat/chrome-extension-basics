import { Button, Input } from "@/components/ui";
import { useEffect, useRef, useState } from "react";

import { Save } from "lucide-react";

function OptionsApp() {
  const [defaultTime, setDefaultTime] = useState(25); // Default value
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load default time from chrome storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get("defaultTime", (result) => {
      if (result.defaultTime) {
        setDefaultTime(result.defaultTime);
      }
    });
  }, []);

  // Debounced save to chrome storage
  const saveDefaultTimeWithDelay = (time: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      chrome.storage.sync.set({ defaultTime: time });
    }, 500);
  };

  // Handle change of default time input
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setDefaultTime(newTime); // Update local state immediately for better UX
    saveDefaultTimeWithDelay(newTime); // Save to sync storage with 500ms debounce
  };

  // Save immediately when the "Save Settings" button is clicked
  const handleSaveClick = () => {
    chrome.storage.sync.set({ defaultTime });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Pomodoro Timer
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Default Time (1-60 minutes)
            </label>
            <Input
              type="number"
              value={defaultTime}
              onChange={handleTimeChange}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-xl mt-4"
              min={1}
              max={60}
            />
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl"
            onClick={handleSaveClick}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Set your preferred Pomodoro duration above.</p>
        <p>Changes will apply to new timer sessions.</p>
      </div>
    </div>
  );
}

export default OptionsApp;
