'use client';

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils';
import { COMMAND_PRIORITY_EDITOR } from '@payloadcms/richtext-lexical/lexical';
import { useEffect } from 'react';

import { INSERT_MERMAID_COMMAND } from '../server/node';
import { $createMermaidNode } from './node';

// Registers the insert command used by the toolbar and slash menu entries.
export const MermaidPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<string | undefined>(
      INSERT_MERMAID_COMMAND,
      (code) => {
        $insertNodeToNearestRoot($createMermaidNode(code ?? ''));
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
};
