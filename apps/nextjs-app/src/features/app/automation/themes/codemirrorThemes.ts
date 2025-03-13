// src/themes/codemirrorThemes.ts
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

// Светлая тема: белый фон, чёрный текст, стили скроллбара
export const customLightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#ffffff',
      color: '#000000',
    },
    '.cm-content': {
      caretColor: '#000000',
    },
    '.cm-scroller': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
    },
    '.cm-scroller::-webkit-scrollbar': {
      width: '6px',
    },
    '.cm-scroller::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '.cm-scroller::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '3px',
    },
  },
  { dark: false }
);

// Тёмная тема: используем oneDark с дополнительными настройками для более тёмного фона и стилизованного скроллбара
export const customDarkTheme = [
  oneDark,
  EditorView.theme(
    {
      '&': {
        backgroundColor: '#1e1e1e', // тёмный фон
        color: '#d4d4d4',
      },
      '.cm-content': {
        caretColor: '#d4d4d4',
      },
      '.cm-scroller': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.4) transparent',
      },
      '.cm-scroller::-webkit-scrollbar': {
        width: '6px',
      },
      '.cm-scroller::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '.cm-scroller::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '3px',
      },
    },
    { dark: true }
  ),
];
