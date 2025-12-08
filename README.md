# AI-Powered MCQ Generator & Testing Platform 🚀

A full-stack web platform that leverages Large Language Models (LLMs) to automatically generate Multiple Choice Questions (MCQs) from PDF documents. This solution is designed to streamline the assessment process for both students and teachers.

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## 📖 Overview
This project addresses the time-consuming task of manual quiz creation. By integrating the **Groq API**, the platform analyzes uploaded PDF content and generates relevant questions instantly. It features distinct modules for students to practice and for teachers to manage assessments in real-time.

## ✨ Key Features

### 🎓 Student Module
* **PDF-to-Quiz:** Upload study materials (PDFs) to instantly generate practice MCQs using LLM integration.
* **Performance Tracking:** Take quizzes and view detailed analytics on performance.
* **History:** Access past test results and review answers.

### 👨‍🏫 Teacher Dashboard
* **Test Generation:** Create standardized tests from document resources.
* **Real-time Monitoring:** Assign tests to students and monitor their progress as they take them.
* **Class Management:** Organize student data and test assignments efficiently.

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Python (Handling PDF processing and LLM integration)
* **Database:** MongoDB (Stores user data, test results, and generated MCQs)
* **AI/LLM:** Groq API

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
