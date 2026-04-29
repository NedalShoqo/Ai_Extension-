🤖 AI Autocomplete Chrome Extension

An AI-powered Chrome Extension that provides real-time text autocompletion across websites.
While you type, it suggests inline continuations that you can accept with the Tab key, similar to tools like Cursor or GitHub Copilot.

🚀 Features
✨ Inline AI suggestions while typing
⌨️ Accept suggestions with Tab
🌐 Works on most websites (inputs, textareas, contenteditable fields)
⚡ Debounced requests for low latency
🔌 Custom backend using Node.js + Express
🧠 Powered by AI (Groq API)
🧠 How It Works
Content Script (content.js)
Detects user input
Extracts text before cursor
Service Worker (service-worker.js)
Receives messages from content script
Sends request to backend
Backend (server.js)
Receives text
Sends it to AI API (Groq)
Returns suggestion
UI Overlay
Displays “ghost text” inline inside the input field
🛠️ Tech Stack
JavaScript (Vanilla)
Chrome Extension (Manifest V3)
Node.js + Express
REST API
Groq AI API
HTML/CSS
📦 Installation & Setup
1. Clone the repository
git clone 
cd 
2. Install backend dependencies
npm install express cors dotenv
3. Create .env file
GROQ_API_KEY=your_groq_api_key_here

⚠️ Never share your API key publicly.

4. Run backend server
node server.js

Server will run on:

http://localhost:3000
5. Load the Chrome Extension

Go to:

chrome://extensions
Enable Developer Mode
Click Load unpacked
Select the project folder
