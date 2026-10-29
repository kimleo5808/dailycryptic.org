import { Aside } from "@/components/mdx/Aside";
import { Callout } from "@/components/mdx/Callout";
import { MdxCard } from "@/components/mdx/MdxCard";
import React, { ReactNode } from "react";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className: string;
  children: ReactNode;
}

/** Plain text of a React node tree (headings can contain emphasis, code, etc.). */
export function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

/** URL-safe anchor id for a heading; the blog table of contents uses the same function. */
export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const Heading: React.FC<HeadingProps> = ({ level, className, children }) => {
  const HeadingTag = `h${level}` as keyof React.ElementType;
  const headingId = headingSlug(nodeText(children));

  return React.createElement(
    HeadingTag,
    { id: headingId, className },
    children
  );
};

interface MDXComponentsProps {
  [key: string]: React.FC<any>;
}

const MDXComponents: MDXComponentsProps = {
  h1: (props) => (
    <Heading level={1} className="text-4xl font-bold font-heading mt-8 mb-6" {...props} />
  ),
  h2: (props) => (
    <Heading
      level={2}
      className="text-2xl font-semibold font-heading mt-8 mb-6 border-l-4 border-indigo-500 pl-4"
      {...props}
    />
  ),
  h3: (props) => (
    <Heading
      level={3}
      className="text-xl font-semibold font-heading mt-6 mb-4 text-indigo-700 dark:text-indigo-300"
      {...props}
    />
  ),
  h4: (props) => (
    <Heading level={4} className="text-lg font-semibold font-heading mt-6 mb-4" {...props} />
  ),
  h5: (props) => (
    <Heading level={5} className="text-base font-semibold font-heading mt-6 mb-4" {...props} />
  ),
  h6: (props) => (
    <Heading
      level={6}
      className="text-sm font-semibold font-heading mt-6 mb-4"
      {...props}
    />
  ),
  hr: (props) => <hr className="border-t border-indigo-200 dark:border-indigo-800 my-8" {...props} />,
  p: (props) => (
    <p
      className="mt-6 mb-6 leading-relaxed text-slate-700 dark:text-slate-300"
      {...props}
    />
  ),
  a: (props) => {
    const external = /^https?:\/\//.test(props.href ?? "");
    return (
      <a
        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline underline-offset-4"
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        {...props}
      />
    );
  },
  ul: (props) => <ul className="list-disc pl-6 mt-0 mb-6" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mt-0 mb-6" {...props} />,
  li: (props) => (
    <li className="mb-3 text-slate-700 dark:text-slate-300" {...props} />
  ),
  code: (props) => (
    <code
      className="bg-indigo-50 dark:bg-indigo-900/30 rounded px-2 py-1 font-mono text-sm text-indigo-700 dark:text-indigo-300"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-lg p-4 overflow-x-auto my-4 bg-slate-100 dark:bg-slate-800"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="pl-6 border-l-4 border-indigo-300 dark:border-indigo-700 my-6 text-slate-600 dark:text-slate-400 italic"
      {...props}
    />
  ),
  img: (props) => (
    <img className="rounded-lg border-2 border-indigo-200 dark:border-indigo-800 my-6" {...props} />
  ),
  strong: (props) => <strong className="font-bold" {...props} />,
  table: (props) => (
    <div className="my-8 w-full overflow-x-auto">
      <table
        className="w-full shadow-sm rounded-lg overflow-hidden"
        {...props}
      />
    </div>
  ),
  tr: (props) => <tr className="border-t border-indigo-100 dark:border-indigo-900" {...props} />,
  th: (props) => (
    <th
      className="px-6 py-3 font-bold text-left bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-6 py-4 text-left border-t border-indigo-50 dark:border-indigo-900/50 [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  Aside,
  Callout,
  Card: MdxCard,
};

export default MDXComponents;
