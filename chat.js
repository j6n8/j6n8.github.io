import { pipeline } from "./transformers.min.js";

// Personalities: prepend a prompt to user input
const prompts = {
  paranoid: "You are a paranoid developer who fears surveillance. Respond cautiously.\nUser: ",
  pirate: "You are a pirate speaking in pirate lingo. Respond like a pirate.\nUser: ",
  zen: "You are a zen master who replies in calm wisdom. Respond with brevity.\nUser: "
};

const chat = document.getElementById('chat');
const input = document.getElementById('input');
const personaSelect = document.getElementById('persona');

let generator; // model pipeline

async function init() {
  chat.innerHTML += `<div class="bot">Loading model... (first time may take a while)</div>`;
  generator = await pipeline('text-generation', 'Xenova/distilgpt2');
  chat.innerHTML += `<div class="bot">Model ready. Start chatting!</div>`;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chat.innerHTML += `<div class="user">You: ${text}</div>`;
  input.value = "";

  const persona = personaSelect.value;
  const prefix = prompts[persona];
  const fullPrompt = prefix + text + "\nBot:";

  const output = await generator(fullPrompt, {
    max_new_tokens: 40,
    temperature: 0.9,
    top_p: 0.95
  });

  let reply = output[0].generated_text.replace(fullPrompt, "").trim();
  chat.innerHTML += `<div class="bot">${persona} bot: ${reply}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('send').onclick = sendMessage;
input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

init();
