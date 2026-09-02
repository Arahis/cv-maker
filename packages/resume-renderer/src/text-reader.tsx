import { $generateHtmlFromNodes } from "@lexical/html";
import { ListItemNode, ListNode } from "@lexical/list";
import { $getRoot, createEditor, ParagraphNode, TextNode } from "lexical";

const nodes = [ParagraphNode, TextNode, ListNode, ListItemNode];

const theme = {
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function renderServerNode(node: any): string {
  const children = Array.isArray(node.children)
    ? node.children.map(renderServerNode).join("")
    : "";

  switch (node.type) {
    case "text": {
      let content = `<span style="white-space: pre-wrap;">${escapeHtml(node.text ?? "")}</span>`;
      const format = Number(node.format ?? 0);

      if (format & 1) content = `<strong>${content}</strong>`;
      if (format & 2) content = `<em>${content}</em>`;
      if (format & 4) content = `<s>${content}</s>`;
      if (format & 8) content = `<u>${content}</u>`;

      return content;
    }
    case "linebreak":
      return "<br />";
    case "paragraph":
      // Lexical keeps an empty paragraph as a line-sized block in the
      // browser. Preserve that height in the server-rendered HTML as well;
      // otherwise an empty paragraph becomes <p></p> and collapses during
      // PDF layout/pagination.
      return `<p dir="ltr">${children || "<br />"}</p>`;
    case "list": {
      const isNumbered = node.listType === "number";
      const tag = isNumbered ? "ol" : "ul";
      const className = isNumbered ? "editor-list-ol" : "editor-list-ul";

      return `<${tag} class="${className}">${children}</${tag}>`;
    }
    case "listitem":
      return `<li class="editor-listItem">${children}</li>`;
    case "link":
      return `<a href="${escapeHtml(node.url ?? "")}">${children}</a>`;
    default:
      return children;
  }
}

function createServerTextReader(value: string) {
  const state = JSON.parse(value) as { root?: { children?: unknown[] } };
  const children = state.root?.children ?? [];
  const html = children.map(renderServerNode).join("");

  return {
    html,
    text: children
      .map((node) => renderServerNode(node).replace(/<[^>]+>/g, ""))
      .join(""),
  };
}

export function createTextReader(value: string) {
  if (typeof document === "undefined") {
    return createServerTextReader(value);
  }

  const editor = createEditor({
    namespace: "ResumeRenderer",
    nodes,
    theme,
    onError: (error) => console.error(error),
  });
  const editorState = editor.parseEditorState(value);
  editor.setEditorState(editorState);

  let html = "";
  let text = "";

  editorState.read(() => {
    text = $getRoot().getTextContent();
    html = $generateHtmlFromNodes(editor);
  });

  return { html, text };
}

export function TextReader({ value }: { value: string }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: createTextReader(value).html }} />
  );
}
