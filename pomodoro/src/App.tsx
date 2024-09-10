import { Button, Input } from "@/components/ui";

function App() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen h-full bg-gray-900 p-6 overflow-y-auto min-w-[350px]">
      <img
        src="/images/logo.jpg"
        alt="logo"
        className="w-20 h-20 rounded-full mb-6 border-4 border-indigo-500"
      />
      <div className="bg-gray-800 p-6 shadow-lg w-full rounded-xl">
        <h1 className="text-indigo-400 text-3xl font-bold mb-6 text-center">
          25:00
        </h1>
        <div className="flex flex-col gap-3">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl py-3 transition-all duration-300 ease-in-out">
            Start Timer
          </Button>
          <Button className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out">
            Reset Timer
          </Button>
          <Button className="bg-gray-700 text-indigo-300 hover:bg-gray-600 rounded-xl py-3 transition-all duration-300 ease-in-out">
            Add Task
          </Button>
        </div>
        <div className="flex gap-3 items-center mt-6">
          <Input
            className="bg-gray-700 border-2 border-gray-600 p-3 flex-grow placeholder:text-gray-400 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter task"
          />
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-6 py-3 transition-all duration-300 ease-in-out">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
