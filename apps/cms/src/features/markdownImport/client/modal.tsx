'use client'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

import {
  $convertFromMarkdownString,
  TRANSFORMERS,
  type Transformer,
} from '@payloadcms/richtext-lexical/lexical/markdown'

import { MermaidMarkdownTransformer } from '../../mermaid/server/markdownTransformer'

export const OPEN_MARKDOWN_IMPORT_COMMAND = 'markdown-import' as const

const transformers: Transformer[] = [...TRANSFORMERS, MermaidMarkdownTransformer]

// Modal opened from the toolbar; converts the pasted markdown document and
// replaces the editor content with the result.
export const MarkdownImportModal = () => {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const listener = (event: Event) => {
      if (event instanceof CustomEvent && event.type === OPEN_MARKDOWN_IMPORT_COMMAND) {
        setOpen(true)
      }
    }
    document.addEventListener(OPEN_MARKDOWN_IMPORT_COMMAND, listener)
    return () => document.removeEventListener(OPEN_MARKDOWN_IMPORT_COMMAND, listener)
  }, [])

  if (!open) {
    return null
  }

  const importMarkdown = () => {
    editor.update(
      () => {
        $convertFromMarkdownString(markdown, transformers)
      },
      { discrete: true },
    )
    setOpen(false)
    setMarkdown('')
  }

  return createPortal(
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setOpen(false)
        }
      }}
      style={{
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        position: 'fixed',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: 'var(--theme-bg)',
          borderRadius: '4px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '48rem',
          padding: '1.5rem',
          width: '90vw',
        }}
      >
        <h3 style={{ margin: 0 }}>Import markdown</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          This replaces the current content with the parsed markdown.
        </p>
        <textarea
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder={'# Hello\n\nA paragraph, with **bold** text.\n\n- one\n- two'}
          rows={14}
          spellCheck={false}
          style={{
            fontFamily: 'var(--code-font-family, monospace)',
            fontSize: '0.85rem',
          }}
          value={markdown}
        />
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setOpen(false)} type="button">
            Cancel
          </button>
          <button disabled={!markdown.trim()} onClick={importMarkdown} type="button">
            Import
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
