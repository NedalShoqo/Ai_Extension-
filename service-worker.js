console.log("Service worker loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);

  if (!message || message.type !== "GET_AI_SUGGESTION") {
    sendResponse({ suggestion: "" });
    return false;
  }

  fetch("http://localhost:3000/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: message.text || ""
    })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
      sendResponse({ suggestion: data.suggestion || "" });
    })
    .catch((err) => {
      console.error("Backend error:", err);
      sendResponse({ suggestion: "" });
    });

  return true;
});