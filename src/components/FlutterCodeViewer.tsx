import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal, Download, Sparkles } from 'lucide-react';
import { FLUTTER_CODEBASE, FlutterCodeFile } from '../data/flutterCode';

export const FlutterCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(1); // Default to main.dart
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile: FlutterCodeFile = FLUTTER_CODEBASE[selectedFileIndex] || FLUTTER_CODEBASE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-stone-900 text-stone-100 rounded-3xl overflow-hidden border border-stone-800 shadow-xl">
      {/* Code Header Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-950/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Flutter 3.x & Dart Production Source
            </span>
            <span className="text-xs text-stone-400">Cross-Platform iOS, Android & Web</span>
          </div>
          <h2 className="text-lg font-bold text-white font-serif-romance">
            Flutter Front-End Codebase for Dating & Matching Lovers
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-stone-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
          <button
            onClick={handleCopy}
            className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Dart Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: File List Sidebar + Code Editor View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
        {/* File Navigator */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-800 bg-stone-950/40 p-3 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto no-scrollbar">
          <div className="hidden md:block text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2 py-1 mb-1">
            Project Tree
          </div>
          {FLUTTER_CODEBASE.map((file, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`p-2 rounded-xl text-xs font-mono text-left transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 md:shrink md:w-full ${
                  isSelected
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-400' : 'text-stone-500'}`} />
                <span className="truncate">{file.path}</span>
              </button>
            );
          })}

          {/* Flutter CLI Quick Snippet */}
          <div className="hidden md:block mt-auto pt-4 border-t border-stone-800/80 px-2">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-semibold mb-2">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Flutter Run Command</span>
            </div>
            <pre className="p-2 rounded-lg bg-black text-[11px] font-mono text-cyan-300 overflow-x-auto">
              flutter pub get{'\n'}flutter run
            </pre>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 flex flex-col bg-stone-950 overflow-hidden">
          {/* File Meta Header */}
          <div className="px-4 py-2 border-b border-stone-800/80 bg-stone-900/60 flex items-center justify-between text-xs text-stone-400">
            <span className="font-mono text-stone-300">{activeFile.path}</span>
            <span>{activeFile.description}</span>
          </div>

          {/* Syntax Content */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-stone-300 selection:bg-rose-500/40">
            <pre className="whitespace-pre">{activeFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
