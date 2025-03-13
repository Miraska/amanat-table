import { lineNumbers } from '@codemirror/gutter';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useState, useEffect } from 'react';

import { useTailwindDarkMode } from '../hooks/useTailwindDarkMode';
import { customLightTheme, customDarkTheme } from '../themes/codemirrorThemes';

interface AutamationScriptEditorProps {
  script: string;
  onScriptChange: (newScript: string) => void;
}

export default function AutamationScriptEditor({
  script,
  onScriptChange,
}: AutamationScriptEditorProps) {
  const [code, setCode] = useState(script);

  useEffect(() => {
    setCode(script);
  }, [script]);

  // Определяем, включена ли тёмная тема (Tailwind добавляет класс 'dark')
  const isDarkTheme = useTailwindDarkMode();

  // Формируем расширения редактора: подсветка синтаксиса, нумерация строк и соответствующая тема
  const extensions = [
    javascript({ typescript: true }),
    lineNumbers(),
    ...(isDarkTheme ? customDarkTheme : [customLightTheme]),
  ];

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        height: '500px',
        overflow: 'hidden',
      }}
    >
      <CodeMirror
        value={code}
        height="100%"
        extensions={extensions}
        onChange={(value) => {
          setCode(value);
          onScriptChange(value);
        }}
      />
    </div>
  );
}
