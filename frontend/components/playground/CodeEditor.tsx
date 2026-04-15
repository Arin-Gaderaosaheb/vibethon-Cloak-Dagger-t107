import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function CodeEditor({ code, onChange, language = 'python' }: CodeEditorProps) {
  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          renderLineHighlight: 'all'
        }}
      />
    </div>
  );
}
