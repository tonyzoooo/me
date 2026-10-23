'use client'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'

import type { MermaidNode } from './node'

let initialized = false

function ensureMermaid(): void {
  if (initialized) {
    return
  }
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })
  initialized = true
}

// Renders the diagram code with a textarea beside a live preview.
export const MermaidEditor = ({ node }: { node: MermaidNode }) => {
  const [editor] = useLexicalComposerContext()
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const domId = `mermaid-preview-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  const code = node.__code
  const hasCode = code.trim().length > 0

  useEffect(() => {
    if (!hasCode) {
      return
    }
    ensureMermaid()
    let cancelled = false
    mermaid
      .render(domId, code)
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(rendered)
          setError('')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
        }
      })
    return () => {
      cancelled = true
    }
  }, [code, domId, hasCode])

  return (
    <div
      style={{
        alignItems: 'flex-start',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '4px',
        display: 'flex',
        gap: '1rem',
        margin: '0.5rem 0',
        padding: '1rem',
        width: '100%',
      }}
    >
      <textarea
        onChange={(event) => {
          editor.update(() => {
            node.setCode(event.target.value)
          })
        }}
        placeholder={'graph TD\n  A --> B'}
        rows={8}
        spellCheck={false}
        style={{
          fontFamily: 'var(--code-font-family, monospace)',
          fontSize: '0.85rem',
          minWidth: '16rem',
        }}
        value={code}
      />
      <div
        style={{
          alignSelf: 'center',
          flex: 1,
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {!hasCode || (!svg && !error) ? (
          <p style={{ opacity: 0.6 }}>{hasCode ? 'Rendering preview...' : 'No preview yet'}</p>
        ) : error ? (
          <pre style={{ color: 'var(--theme-error-500)', whiteSpace: 'pre-wrap' }}>{error}</pre>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        )}
      </div>
    </div>
  )
}
