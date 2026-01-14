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
  value: string | undefined;
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

export function TextReader({ value }: { value: string | undefined }) {
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
    // editor will not accept empty string as valid state
    editorState: value?.trim() ? value : undefined,
  };

  const onEditorChange = (lexicalJson: string) => {
    onChange(lexicalJson);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <div className="group/input-group border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 relative h-auto w-full min-w-0 rounded-md border shadow-xs transition-[color,box-shadow] outline-none has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content min-h-16 w-full resize-none rounded-none border-0 bg-transparent px-3 py-3 text-base shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-0 md:text-sm dark:bg-transparent"
              aria-placeholder={"Enter some text..."}
              data-slot="input-group-control"
              placeholder={
                <div className="editorPlaceholder text-muted-foreground top-3 left-3">
                  {placeholder}
                </div>
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
