<div align="center">

<img src="public/safespace-logo.png" width="200" alt="SafeSpace AI logo" />

# SafeSpace AI — Frontend

**Conversational UI for the SafeSpace AI mental health chatbot**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)


[Try it here!](https://duospace-safespace-ai-frontend.hf.space/about) 
</div>

---

> [!WARNING]
> **SafeSpace AI is not a substitute for professional mental health care.** Always direct users in genuine distress to qualified professionals or crisis resources.

---

## 📦 Repositories

| Component | Repository |
|-----------|------------|
| 💻 React Frontend *(this repo)* | https://github.com/ZeyadMahmoudAmrMohamed/SafeSpaceAI |
| 🤖 AI + FastAPI Backend | https://github.com/3omdawy11/SafeSpaceAI |

The backend repo contains the full NLP pipeline, RAG engine, and REST API. This repo is the chat interface that connects to it.

---

## 🎯 Overview

A real-time conversational UI built with React 19 and TanStack Router. It connects to the SafeSpace AI FastAPI backend and supports both text and voice input via OpenAI Whisper speech-to-text.

<div align="center"><img src="public/demo.gif" width="700" alt="SafeSpace AI demo"/></div>

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | ![React](https://img.shields.io/badge/-React_19-61DAFB?logo=react&logoColor=black) + ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) |
| Routing | TanStack Router + TanStack Start |
| Data fetching | TanStack Query |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) + shadcn/ui (Radix) |
| Speech to text | OpenAI Whisper via Groq |
| Build | ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) |

---

## ⚙️ Quick Start

```bash
git clone https://github.com/ZeyadMahmoudAmrMohamed/SafeSpaceAI
cd SafeSpaceAI && cp .env.example .env   # point VITE_API_URL at the backend
npm install
npm run dev
```

The backend must be running on `localhost:8000` (or update `VITE_API_URL` in `.env`). See the [backend repo](https://github.com/3omdawy11/SafeSpaceAI) for setup instructions.

---

## 👥 Team

| Mohamed Emad | Ziad Mahmoud |
|:---:|:---:|
| [![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/3omdawy11) | [![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/ZeyadMahmoudAmrMohamed) |

<div align="center">
<br/>
<sub>Built as an NLP course capstone · SafeSpace AI</sub>
</div>
