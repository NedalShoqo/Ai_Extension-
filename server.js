import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();


console.log("KEY:", process.env.GROQ_API_KEY);
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/complete", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.json({ suggestion: "" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an autocomplete engine. Return only the continuation text. Do not repeat the input."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 20,
        temperature: 0.3
      })
    });

    const data = await response.json();
    console.log("GROQ RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        suggestion: "",
        error: data
      });
    }

    const suggestion = data.choices?.[0]?.message?.content?.trim() || "";
    res.json({ suggestion });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      suggestion: "",
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});