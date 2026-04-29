console.log("Content script loaded");

let activeField = null;
let currentSuggestion = "";
let debounceTimer = null;

function isSupportedField(el) {
  return el &&
    (
      el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" && ["text", "search"].includes(el.type)) ||
      el.isContentEditable   // ✅ added
    ) &&
    !el.disabled &&
    !el.readOnly;
}
const ghost = document.createElement("div");
ghost.style.position = "absolute";
ghost.style.pointerEvents = "none";
ghost.style.zIndex = "999999";
ghost.style.color = "rgba(120,120,120,0.75)";
ghost.style.whiteSpace = "pre-wrap";
ghost.style.display = "none";
document.documentElement.appendChild(ghost);

document.addEventListener("focusin", (e) => {
  if (isSupportedField(e.target)) {
    activeField = e.target;
    console.log("Active field detected");
  }
});

document.addEventListener("input", (e) => {
  if (!isSupportedField(e.target)) return;

  activeField = e.target;
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const start = activeField.selectionStart;
    const end = activeField.selectionEnd;

    if (start !== end) {
      hideSuggestion();
      return;
    }

let textBeforeCursor;

if (activeField.isContentEditable) {
  textBeforeCursor = activeField.innerText;
} else {
  textBeforeCursor = activeField.value.slice(0, start);
}
    if (!textBeforeCursor.trim()) {
      hideSuggestion();
      return;
    }

    try {
      console.log("Sending to service worker:", textBeforeCursor);

      const response = await chrome.runtime.sendMessage({
        type: "GET_AI_SUGGESTION",
        text: textBeforeCursor
      });

      console.log("Response from service worker:", response);

      currentSuggestion = response?.suggestion || "";

      if (currentSuggestion) {
        showSuggestion(activeField, currentSuggestion);
      } else {
        hideSuggestion();
      }
    } catch (err) {
      console.error("Content script error:", err);
      hideSuggestion();
    }
  }, 500);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && activeField && currentSuggestion) {
    e.preventDefault();

    const pos = activeField.selectionStart;
    activeField.setRangeText(currentSuggestion, pos, pos, "end");
    activeField.dispatchEvent(new Event("input", { bubbles: true }));

    hideSuggestion();
  }
});

function showSuggestion(field, suggestion) {
  const rect = field.getBoundingClientRect();
  const style = getComputedStyle(field);

  ghost.style.left = `${window.scrollX + rect.left}px`;
  ghost.style.top = `${window.scrollY + rect.top}px`;
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  ghost.style.font = style.font;
  ghost.style.padding = style.padding;
  ghost.style.lineHeight = style.lineHeight;
  ghost.style.boxSizing = "border-box";
  ghost.style.display = "block";

  const textBeforeCursor = field.value.slice(0, field.selectionStart);

  ghost.innerHTML =
    `<span style="visibility:hidden">${escapeHtml(textBeforeCursor)}</span>` +
    `<span>${escapeHtml(suggestion)}</span>`;
}

function hideSuggestion() {
  ghost.style.display = "none";
  ghost.innerHTML = "";
  currentSuggestion = "";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}