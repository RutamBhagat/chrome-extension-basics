// background.ts

console.log("Hello world from background script");

export interface TimerState {
  value: number;
  isActive: boolean;
  defaultTime: number;
}

export let timerState: TimerState = {
  value: 25 * 60,
  isActive: false,
  defaultTime: 25,
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["timerState"], (result) => {
    if (result.timerState) {
      timerState = result.timerState;
    } else {
      chrome.storage.local.set({ timerState });
    }
  });
});

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.action) {
    case "startTimer":
      startTimer();
      break;
    case "stopTimer":
      stopTimer();
      break;
    case "resetTimer":
      resetTimer(message.defaultTime);
      break;
    case "getTimerState":
      sendResponse(timerState);
      return true;
    case "updateDefaultTime":
      updateDefaultTime(message.defaultTime);
      break;
  }
});

function startTimer() {
  if (!timerState.isActive) {
    timerState.isActive = true;
    updateTimerState();
    chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 });
  }
}

function stopTimer() {
  chrome.alarms.clear("pomodoroTimer");
  timerState.isActive = false;
  updateTimerState();
}

function resetTimer(defaultTime: number) {
  stopTimer();
  timerState.value = defaultTime * 60;
  timerState.defaultTime = defaultTime;
  updateTimerState();
}

function updateDefaultTime(newDefaultTime: number) {
  timerState.defaultTime = newDefaultTime;
  updateTimerState();
}

function updateTimerState() {
  chrome.storage.local.set({ timerState });
  chrome.runtime.sendMessage({ action: "updateTimer", timerState });
}

function notifyUser() {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "/images/icon-128.png",
      title: "Pomodoro Timer",
      message: "Time's up! Take a break.",
      buttons: [{ title: "Start Break" }, { title: "Dismiss" }],
      priority: 2,
    },
    (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error("Notification error:", chrome.runtime.lastError);
      } else {
        console.log("Notification created with ID:", notificationId);
      }
    }
  );
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    timerState.value -= 1;
    if (timerState.value <= 0) {
      stopTimer();
      notifyUser();
    } else {
      updateTimerState();
    }
  }
});

chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      // Start break timer (e.g., 5 minutes)
      resetTimer(5);
      startTimer();
    }
    chrome.notifications.clear(notificationId);
  }
);
