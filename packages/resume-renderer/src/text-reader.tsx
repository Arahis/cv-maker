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

export function createTextReader(value: string) {
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
  return <div dangerouslySetInnerHTML={{ __html: createTextReader(value).html }} />;
}
