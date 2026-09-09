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

function addLexicalListPrefixes(html: string) {
  const prefix = "•\u00a0\u00a0\u00a0";
  const listPattern = /(<ul\b[^>]*class=["'][^"']*\beditor-list-ul\b[^"']*["'][^>]*>)([\s\S]*?)(<\/ul>)/g;

  return html.replace(listPattern, (list, opening, content, closing) => {
    const items = content.replace(
      /<li\b([^>]*)>([\s\S]*?)<\/li>/g,
      (item: string, attributes: string, itemContent: string) => {
        const withClass = /\bclass=["']/.test(attributes)
          ? attributes.replace(
              /(\bclass=["'][^"']*)["']/, `$1 lexical-text-bullet"`,
            )
          : `${attributes} class="lexical-text-bullet"`;
        const firstSpan = /(<span\b[^>]*>)/;

        if (firstSpan.test(itemContent)) {
          const prefixedContent = itemContent.replace(
            firstSpan,
            `$1${prefix}`,
          );
          return `<li${withClass}>${prefixedContent}</li>`;
        }

        return `<li${withClass}>${prefix}${itemContent}</li>`;
      },
    );

    return `${opening}${items}${closing}`;
  });
}

function addTextPrefix(html: string, prefix: string) {
  const escapedPrefix = escapeHtml(prefix);
  let prefixAdded = false;

  const prefixedHtml = html.replace(
    /<p\b([^>]*)>([\s\S]*?)<\/p>/g,
    (paragraph, attributes: string, content: string) => {
      if (prefixAdded || !content.replace(/<[^>]*>/g, "").trim()) {
        return paragraph;
      }

      prefixAdded = true;
      const attributesWithBulletClass = /\bclass=["']/.test(attributes)
        ? attributes.replace(
            /(\bclass=["'][^"']*)["']/, `$1 resume-text-bullet-paragraph"`,
          )
        : `${attributes} class="resume-text-bullet-paragraph"`;

      return `<p${attributesWithBulletClass}>${escapedPrefix}${content}</p>`;
    },
  );

  if (prefixAdded) return prefixedHtml;

  return html.replace(
    /(<p\b[^>]*>)/,
    `$1${escapedPrefix}`,
  );
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

export function TextReader({
  value,
  prefix,
}: {
  value: string;
  prefix?: string;
}) {
  const html = addLexicalListPrefixes(createTextReader(value).html);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: prefix ? addTextPrefix(html, prefix) : html,
      }}
    />
  );
}
