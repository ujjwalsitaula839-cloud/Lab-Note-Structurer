# LabNote / Structurer

LabNote Structurer is a professional scientific utility designed to parse digital laboratory notebooks in PDF format, extract raw text, and organize it into structured, standard scientific reports. Utilizing high-performance open-weight models via the **Groq API** (`llama-3.3-70b-versatile`), it converts unstructured notes into publication-ready drafts containing inferred title, methodology, observations, results, conclusions, and flags for experimental uncertainties.

All outputs are presented in a unified document reading console with a one-click **Copy to Markdown** feature for seamless integration into digital lab notebooks (like Obsidian, Notion, or LaTeX).

---

## Features

* **PDF Parsing**: Automated digital text extraction utilizing `pdfplumber`.
* **Structured Llama-3.3 Analysis**: Deep text structuring through the Groq SDK, outputting valid structured JSON.
* **Unified Document Reading UI**: A clean, distraction-free document interface designed for researchers.
* **Markdown Export**: Direct clipboard copy formatted in clean markdown template notation.
* **Sleek Uploader Console**: Drag-and-drop file uploader with size indicators and validation.
* **Safe Configuration**: Pre-configured root `.gitignore` to prevent sensitive credentials and environment folders from leaking to GitHub.

---

## Technical Stack

* **Backend**: FastAPI (Python), Uvicorn, pdfplumber, Groq Client.
* **Frontend**: React (TypeScript), Vite, Tailwind CSS.

---

## Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)
* **Groq API Key**

---

### Backend Configuration

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it**:
   * **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Create a `.env` file inside the `backend` folder and add your key:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key
   ```

5. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend server runs at `http://localhost:8000`.

---

### Frontend Configuration

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Deploying / Committing to GitHub

To initialize Git and push the project to your GitHub repository:

1. **Initialize Git repository**:
   Run this in the project root folder (`lab-note-structurer`):
   ```bash
   git init
   ```

2. **Stage your files**:
   (The root-level `.gitignore` will automatically prevent committing `.env`, `node_modules`, and your virtual environment folder)
   ```bash
   git add .
   ```

3. **Create the initial commit**:
   ```bash
   git commit -m "Initial commit: Redesigned LabNote Structurer with Groq integration"
   ```

4. **Link and push to GitHub**:
   Replace the placeholder URL with your actual GitHub repository URL:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```
