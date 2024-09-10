console.log("Hello world from bakground script");

let timerInterval: NodeJS.Timeout | null = null;
let timerValue = 25 * 60; // Default 25 minutes
let isTimerActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    startTimer();
    sendResponse({ status: "started", timerValue });
  } else if (message.action === "stopTimer") {
    stopTimer();
    sendResponse({ status: "stopped", timerValue });
  } else if (message.action === "resetTimer") {
    resetTimer(message.defaultTime);
    sendResponse({ status: "reset", timerValue });
  } else if (message.action === "getTimerState") {
    sendResponse({
      status: isTimerActive ? "running" : "stopped",
      timerValue,
    });
  }
});

function startTimer() {
  if (!isTimerActive) {
    isTimerActive = true;
    timerInterval = setInterval(() => {
      timerValue -= 1;
      chrome.storage.sync.set({ timerValue });

      // Send timer update to all open popup instances
      chrome.runtime.sendMessage({ action: "updateTimer", timerValue });

      if (timerValue <= 0) {
        stopTimer();
      }
    }, 1000);
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimerActive = false;
  chrome.storage.sync.set({ timerValue });
}

function resetTimer(defaultTime: number) {
  stopTimer();
  timerValue = defaultTime * 60;
  chrome.storage.sync.set({ timerValue });
}
