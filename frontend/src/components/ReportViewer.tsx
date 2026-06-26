import React, { useState } from "react";

interface StructuredData {
  title: string;
  methodology: string;
  observations: string;
  results: string;
  conclusions: string;
  confidence_note: string;
}

interface ReportViewerProps {
  rawText: string;
  structuredData: StructuredData;
  onReset: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  rawText,
  structuredData,
  onReset,
}) => {
  const [copiedType, setCopiedType] = useState<"markdown" | "raw" | null>(null);

  const handleCopyMarkdown = () => {
    const markdown = `# ${structuredData.title || "Structured Lab Report"}

## Methodology
${structuredData.methodology}

## Observations
${structuredData.observations}

## Results
${structuredData.results}

## Conclusions
${structuredData.conclusions}

---
*Confidence Note: ${structuredData.confidence_note}*`;

    navigator.clipboard.writeText(markdown);
    setCopiedType("markdown");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawText);
    setCopiedType("raw");
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-2 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Analysis complete</span>
          <h2 className="text-xl font-bold text-slate-100 mt-0.5 truncate max-w-2xl">
            {structuredData.title || "Untitled Lab Note"}
          </h2>
        </div>
        <button
          id="reset-btn"
          onClick={onReset}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-xs text-slate-300 hover:text-white font-medium rounded-lg border border-slate-800 transition-all cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 3H15" />
          </svg>
          <span>Upload Another File</span>
        </button>
      </div>

      {/* Main split dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Raw text reader (span 5) */}
        <div className="lg:col-span-5 flex flex-col h-[680px] bg-[#0c0e17] rounded-xl border border-slate-850 overflow-hidden">
          <div className="px-4 py-3 bg-[#0f121d] border-b border-slate-850 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Source Text</span>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {rawText.length.toLocaleString()} chars
              </span>
              <button
                onClick={handleCopyRaw}
                className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy raw text"
              >
                {copiedType === "raw" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h6m-6 4h6m-6 4h6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="p-5 overflow-y-auto flex-1 font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap selection:bg-indigo-650/30 selection:text-white">
            {rawText || "No source text extracted."}
          </div>
        </div>

        {/* Right Column: Structured document editor (span 7) */}
        <div className="lg:col-span-7 flex flex-col h-[680px] bg-[#111420] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-5 py-3 bg-[#0f121d] border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Structured Draft</span>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-600/10 hover:bg-indigo-650/20 text-indigo-400 hover:text-indigo-300 text-2xs font-medium rounded border border-indigo-500/20 transition-all cursor-pointer"
            >
              {copiedType === "markdown" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 4h6m-6 4h6m-6 4h6" />
                  </svg>
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-[#111420] text-slate-200">
            {/* Unified Document Layout */}
            <article className="prose prose-invert max-w-none text-xs leading-relaxed space-y-6">
              
              {/* Document Header Title */}
              <div className="border-b border-slate-800 pb-4">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {structuredData.title || "Untitled Lab Note"}
                </h1>
              </div>

              {/* Confidence Alert Panel */}
              {structuredData.confidence_note && (
                <div className={`p-3.5 rounded-lg border flex items-start space-x-2.5 text-2xs ${
                  structuredData.confidence_note.toLowerCase().includes("no issues") ||
                  structuredData.confidence_note.toLowerCase().includes("high confidence") ||
                  structuredData.confidence_note.toLowerCase() === "none"
                    ? "bg-emerald-950/10 border-emerald-500/15 text-emerald-400"
                    : "bg-amber-950/10 border-amber-500/15 text-amber-400"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-semibold block text-slate-300 uppercase tracking-wider mb-0.5 text-[9px]">Confidence Assessment</span>
                    <span>{structuredData.confidence_note}</span>
                  </div>
                </div>
              )}

              {/* Methodology */}
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">1. Methodology</h3>
                <p className="text-slate-300 pl-3 border-l border-slate-800 whitespace-pre-line leading-relaxed">
                  {structuredData.methodology}
                </p>
              </section>

              {/* Observations */}
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">2. Observations</h3>
                <p className="text-slate-300 pl-3 border-l border-slate-800 whitespace-pre-line leading-relaxed">
                  {structuredData.observations}
                </p>
              </section>

              {/* Results */}
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">3. Results</h3>
                <p className="text-slate-300 pl-3 border-l border-slate-800 whitespace-pre-line leading-relaxed">
                  {structuredData.results}
                </p>
              </section>

              {/* Conclusions */}
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">4. Conclusions</h3>
                <p className="text-slate-300 pl-3 border-l border-slate-800 whitespace-pre-line leading-relaxed">
                  {structuredData.conclusions}
                </p>
              </section>

            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
