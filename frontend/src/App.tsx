import { useState } from "react";
import { UploadZone } from "./components/UploadZone";
import { ReportViewer } from "./components/ReportViewer";

interface StructuredData {
  title: string;
  methodology: string;
  observations: string;
  results: string;
  conclusions: string;
  confidence_note: string;
}

type AppState = "idle" | "loading" | "success" | "error";

function App() {
  const [state, setState] = useState<AppState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
    if (state === "error") {
      setState("idle");
    }
  };

  const handleStructureRequest = async () => {
    if (!selectedFile) return;

    setState("loading");
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/structure", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned status code ${response.status}`);
      }

      const data = await response.json();
      setRawText(data.raw_text);
      setStructuredData(data.structured_data);
      setState("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with the server.");
      setState("error");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setRawText("");
    setStructuredData(null);
    setError(null);
    setState("idle");
  };

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-[#0f121d] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-md">
              LN
            </div>
            <div>
              <span className="font-semibold text-slate-100 tracking-tight">LabNote</span>
              <span className="text-slate-500 font-normal"> / Structurer</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              API Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col px-4 sm:px-6 py-12 max-w-7xl w-full mx-auto justify-center">
        {state !== "success" && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Structure Raw Laboratory Notebooks
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Upload a digital laboratory notebook PDF to extract raw text and organize it into standard scientific sections. Built for researchers, engineers, and scientists to draft methodologies, observations, and conclusions.
            </p>
          </div>
        )}

        {state !== "success" ? (
          <div className="w-full max-w-xl mx-auto">
            <UploadZone
              selectedFile={selectedFile}
              onFileSelected={handleFileChange}
              onStructureRequested={handleStructureRequest}
              loading={state === "loading"}
              error={error}
            />
          </div>
        ) : (
          structuredData && (
            <ReportViewer
              rawText={rawText}
              structuredData={structuredData}
              onReset={handleReset}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-[#07090e] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6">
          <p>
            LabNote Structurer is a productivity drafting tool. All structured outputs should be reviewed and verified by a qualified investigator.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
