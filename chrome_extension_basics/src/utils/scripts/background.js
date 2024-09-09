// src/utils/background.ts

// Function to set the badge text
function setBadgeText() {
  chrome.action.setBadgeText({ text: "TIME" }, () => {
    console.log("Finished setting badge text.");
  });
}

// Call the function to set the badge text immediately
setBadgeText();

// Optionally, you can set the badge text at intervals if needed
// setInterval(setBadgeText, 1000); // Uncomment if you want to reset it every second
