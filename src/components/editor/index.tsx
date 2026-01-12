import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";

import { ParagraphNode, TextNode } from "lexical";

import "./editor.css";
import ToolbarPlugin from "./plugins/Toolbar";
import ApplySerializedStatePlugin from "./plugins/ApplySerializedState";
import GetEditorStatePlugin from "./plugins/GetTextEditor";

type RichTextEditorProps = {
  placeholder?: string;
  onChange: (json: string) => void;
  value: string;
};

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

function onError(error: Error): void {
  console.error(error);
}

export function TextReader({ value }: { value: string }) {
  const initialConfig = {
    namespace: "EditorPreview",
    editable: false,
    nodes,
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ApplySerializedStatePlugin value={value} />
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}

export function TextEditor({
  placeholder = "Type your text right here...",
  onChange,
  value,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "Editor",
    theme,
    nodes,
    onError,
    editorState: value,
  };

  const onEditorChange = (lexicalJson: string) => {
    onChange(lexicalJson);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="contenteditable"
              aria-placeholder={"Enter some text..."}
              placeholder={
                <div className="editorPlaceholder">{placeholder}</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <GetEditorStatePlugin onChange={onEditorChange} />
    </LexicalComposer>
  );
}
