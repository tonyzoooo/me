import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    updatedAt: { type: 'date', required: false },
    description: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    draft: { type: 'boolean', required: false },
    cover: { type: 'string', required: false },
    coverAlt: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    wordCount: {
      type: 'number',
      resolve: (doc) => doc.body?.raw?.trim().split(/\s+/).length ?? 0,
    },
    readingTime: {
      type: 'number',
      resolve: (doc) =>
        Math.max(
          1,
          Math.ceil((doc.body?.raw?.trim().split(/\s+/).length ?? 0) / 200),
        ),
    },
    year: {
      type: 'string',
      resolve: (doc) => new Date(doc.date).getFullYear().toString(),
    },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    tech: { type: 'list', of: { type: 'string' } },
    url: { type: 'string', required: false },
    repo: { type: 'string', required: false },
    date: { type: 'date', required: false },
    updatedAt: { type: 'date', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    featured: { type: 'boolean', required: false },
    order: { type: 'number', required: false },
    image: { type: 'string', required: false },
    imageAlt: { type: 'string', required: false },
    summary: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').pop(),
    },
    wordCount: {
      type: 'number',
      resolve: (doc) => doc.body?.raw?.trim().split(/\s+/).length ?? 0,
    },
    readingTime: {
      type: 'number',
      resolve: (doc) =>
        Math.max(
          1,
          Math.ceil((doc.body?.raw?.trim().split(/\s+/).length ?? 0) / 200),
        ),
    },
    year: {
      type: 'string',
      resolve: (doc) =>
        doc.date ? new Date(doc.date).getFullYear().toString() : '',
    },
  },
}));

export const CV = defineDocumentType(() => ({
  name: 'CV',
  filePathPattern: `cv/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    updatedAt: { type: 'date', required: false },
    summary: { type: 'string', required: false },
    links: { type: 'json', required: false },
  },
  computedFields: {
    wordCount: {
      type: 'number',
      resolve: (doc) => doc.body?.raw?.trim().split(/\s+/).length ?? 0,
    },
    readingTime: {
      type: 'number',
      resolve: (doc) =>
        Math.max(
          1,
          Math.ceil((doc.body?.raw?.trim().split(/\s+/).length ?? 0) / 200),
        ),
    },
  },
}));

export default makeSource({
  contentDirPath: 'src/content',
  documentTypes: [Blog, Project, CV],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
  },
});
