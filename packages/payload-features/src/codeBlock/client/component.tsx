'use client';

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { useMemo } from 'react';

import type { CodeBlockNode } from './node';

const style = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
  margin: '0.5rem 0',
  padding: '1rem',
  width: '100%',
};

const textareaStyle = {
  fontFamily: 'var(--code-font-family, monospace)',
  fontSize: '0.85rem',
  minWidth: 0,
};

// A code block with a language input; the site renders it as pre/code with a
// language class for syntax highlighting.
export const CodeBlockEditor = ({ node }: { node: CodeBlockNode }) => {
  const [editor] = useLexicalComposerContext();

  const languages = useMemo(
    () => ['js', 'ts', 'tsx', 'css', 'html', 'json', 'bash', 'sql', ''],
    []
  );

  return (
    <div style={style}>
      <input
        list="codeblock-languages"
        onChange={(event) => {
          editor.update(() => {
            node.setLanguage(event.target.value.trim());
          });
        }}
        placeholder="language (optional)"
        style={{ fontSize: '0.8rem', width: '12rem' }}
        value={node.__language}
      />
      <datalist id="codeblock-languages">
        {languages.map((language) => (
          <option key={language || 'none'} value={language} />
        ))}
      </datalist>
      <textarea
        onChange={(event) => {
          editor.update(() => {
            node.setCode(event.target.value);
          });
        }}
        placeholder={'const x = 1'}
        rows={6}
        spellCheck={false}
        style={textareaStyle}
        value={node.__code}
      />
    </div>
  );
};
