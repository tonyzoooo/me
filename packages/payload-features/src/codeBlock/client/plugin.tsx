'use client';

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils';
import { COMMAND_PRIORITY_EDITOR } from '@payloadcms/richtext-lexical/lexical';
import { useEffect } from 'react';

import { INSERT_CODE_BLOCK_COMMAND } from '../server/node';
import { $createCodeBlockNode } from './node';

// Registers the insert command used by the toolbar and slash menu entries.
export const CodeBlockPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_CODE_BLOCK_COMMAND,
      (payload) => {
        const { code = '', language = '' } = payload ?? {};
        $insertNodeToNearestRoot($createCodeBlockNode(code, language));
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
};
