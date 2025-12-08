# AI-Powered MCQ Generator & Testing Platform 🚀

A full-stack web platform that leverages Large Language Models (LLMs) to automatically generate Multiple Choice Questions (MCQs) from PDF documents. This solution is designed to streamline the assessment process for both students and teachers.

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## 📖 Overview
This project addresses the time-consuming task of manual quiz creation. By integrating the **Groq API**, the platform analyzes uploaded PDF content and generates relevant questions instantly. [cite_start]It features distinct modules for students to practice and for teachers to manage assessments in real-time[cite: 26, 29].

## ✨ Key Features

### 🎓 Student Module
* [cite_start]**PDF-to-Quiz:** Upload study materials (PDFs) to instantly generate practice MCQs[cite: 29].
* [cite_start]**Performance Tracking:** Take quizzes and view detailed analytics on performance[cite: 30].
* [cite_start]**History:** Access past test results and review answers[cite: 32].

### 👨‍🏫 Teacher Dashboard
* [cite_start]**Test Generation:** Create standardized tests from document resources[cite: 31].
* [cite_start]**Real-time Monitoring:** Assign tests to students and monitor their progress as they take them[cite: 31].
* **Class Management:** Organize student data and test assignments efficiently.

## 🛠️ Tech Stack

* [cite_start]**Frontend:** React.js [cite: 26]
* [cite_start]**Backend:** Python (Handling PDF processing and LLM integration) [cite: 33]
* [cite_start]**Database:** MongoDB (Stores user data, test results, and generated MCQs) [cite: 26, 32]
* [cite_start]**AI/LLM:** Groq API [cite: 26, 29]

## ⚙️ Installation

### Prerequisites
* Node.js & npm
* Python 3.x
* MongoDB (Local or Atlas)
* Groq API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/mcq-generator.git](https://github.com/yourusername/mcq-generator.git)
cd mcq-generator
