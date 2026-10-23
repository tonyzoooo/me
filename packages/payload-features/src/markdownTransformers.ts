import {
  TRANSFORMERS,
  type Transformer,
} from '@payloadcms/richtext-lexical/lexical/markdown';

import { CodeBlockMarkdownTransformer } from './codeBlock/server/markdownTransformer';
import { MermaidMarkdownTransformer } from './mermaid/server/markdownTransformer';

// The full transformer list for converting markdown documents into Lexical
// content. Order matters: the mermaid fence transformer must run before the
// generic code block transformer, whose regExpStart also matches ```mermaid.
export const markdownImportTransformers: Transformer[] = [
  MermaidMarkdownTransformer,
  CodeBlockMarkdownTransformer,
  ...TRANSFORMERS,
];
