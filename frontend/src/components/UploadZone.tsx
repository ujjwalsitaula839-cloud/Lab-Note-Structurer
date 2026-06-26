import React, { useState, useRef } from "react";

interface UploadZoneProps {
  selectedFile: File | null;
  onFileSelected: (file: File | null) => void;
  onStructureRequested: () => void;
  loading: boolean;
  error: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  selectedFile,
  onFileSelected,
  onStructureRequested,
  loading,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        onFileSelected(file);
      } else {
        alert("Please select a PDF file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fadeIn">
      <div
        id="drop-zone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-8 border rounded-xl transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-indigo-500 bg-indigo-950/10 shadow-sm"
            : selectedFile
            ? "border-slate-700 bg-[#0f121d] hover:border-slate-600"
            : "border-slate-800 bg-[#0f121d] hover:border-slate-700 hover:bg-[#121624]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload-input"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={loading}
        />

        {/* Upload Icon */}
        <div className="mb-4">
          {selectedFile ? (
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          ) : (
            <div className="p-3 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          )}
        </div>

        <h3 className="mb-1 text-sm font-semibold text-slate-200">
          {selectedFile ? "File selected successfully" : "Upload lab note PDF"}
        </h3>
        
        <p className="mb-4 text-xs text-slate-400 text-center max-w-xs leading-normal">
          {selectedFile
            ? "Your document is ready to be structured. Click the button below to begin."
            : "Drag and drop your notebook PDF here, or click to choose a file."}
        </p>

        {selectedFile && (
          <div className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg mb-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="flex-shrink-0 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-slate-300 truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              id="clear-file-button"
              type="button"
              onClick={() => onFileSelected(null)}
              className="text-slate-500 hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4">
          <button
            id="structure-btn"
            onClick={onStructureRequested}
            disabled={loading}
            className={`w-full py-3 px-4 font-semibold text-xs rounded-lg text-white transition-all flex items-center justify-center space-x-2 ${
              loading
                ? "bg-indigo-600/50 cursor-not-allowed opacity-80"
                : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] hover:shadow-indigo-500/10 shadow-sm"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing and structuring report...</span>
              </>
            ) : (
              <>
                <span>Structure Document</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div id="error-message" className="mt-4 p-4 bg-red-950/15 border border-red-500/20 text-red-300 rounded-lg flex items-start space-x-3 text-xs leading-normal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-red-200">Analysis failed</p>
            <p className="text-red-400/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
