import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
  },
}));

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    tech: { type: "list", of: { type: "string" } },
    url: { type: "string", required: false },
  },
}));

export const CV = defineDocumentType(() => ({
  name: "CV",
  filePathPattern: `cv/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
  },
}));

export default makeSource({
  contentDirPath: "src/content",
  documentTypes: [Blog, Project, CV],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
  },
});
