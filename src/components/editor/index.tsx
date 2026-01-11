import React, { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import "./editor.css";

type RichTextEditorProps = {
  placeholder?: string;
  onChange: (json: string) => void;
  value: string;
};

function onError(error: Error): void {
  console.error(error);
}

const theme = {};

const GetEditorState = ({
  onChange,
}: {
  onChange: (lexicalJson: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const lexicalJson = JSON.stringify(editorState.toJSON());

      editorState.read(() => {
        onChange(lexicalJson);
      });
    });
  }, [editor, onChange]);
  return null;
};

function ApplySerializedStatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!value) return;

    const current = JSON.stringify(editor.getEditorState().toJSON());
    if (current === value) return;

    editor.update(
      () => {
        editor.setEditorState(editor.parseEditorState(value));
      },
      { discrete: true },
    );
  }, [editor, value]);

  return null;
}

const config = {
  namespace: "MyEditor",
  theme,
  onError,
};

export function TextReader({ value }: { value: string }) {
  const initialConfig = {
    namespace: "ResumePreview",
    editable: false,
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
    ...config,
    editorState: value,
  };

  const onEditorChange = (lexicalJson: string) => {
    onChange(lexicalJson);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
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
      <GetEditorState onChange={onEditorChange} />
    </LexicalComposer>
  );
}
